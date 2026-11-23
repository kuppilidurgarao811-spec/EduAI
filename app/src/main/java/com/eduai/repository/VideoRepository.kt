package com.eduai.repository

import android.content.Context
import android.net.Uri
import android.os.Handler
import android.os.Looper
import android.provider.OpenableColumns
import com.google.firebase.auth.FirebaseAuth
import com.google.firebase.storage.FirebaseStorage
import com.google.firebase.storage.StorageMetadata
import org.json.JSONObject
import java.net.HttpURLConnection
import java.net.URL
import java.util.concurrent.Executors

class VideoRepository {

    private val storage =
        FirebaseStorage.getInstance()

    private val networkExecutor =
        Executors.newSingleThreadExecutor()

    private val mainHandler =
        Handler(Looper.getMainLooper())

    fun uploadVideo(
        uri: Uri,
        subjectId: String,
        chapterId: String,
        lessonId: String,
        onProgress: (Int) -> Unit,
        onSuccess: (String, String) -> Unit,
        onError: (Exception) -> Unit
    ) {

        val path =
            "lessons/$subjectId/$chapterId/" +
            "$lessonId/video/lesson.mp4"

        val reference = storage.reference.child(path)

        val metadata = StorageMetadata.Builder()
            .setContentType("video/mp4")
            .build()

        reference.putFile(uri, metadata)
            .addOnProgressListener { snapshot ->

                val total = snapshot.totalByteCount

                if (total > 0) {
                    val percent =
                        (100.0 *
                            snapshot.bytesTransferred /
                            total).toInt()

                    onProgress(percent)
                }
            }
            .addOnSuccessListener {

                reference.downloadUrl
                    .addOnSuccessListener { downloadUri ->

                        onSuccess(
                            downloadUri.toString(),
                            path
                        )
                    }
                    .addOnFailureListener(onError)
            }
            .addOnFailureListener(onError)
    }

    /**
     * Production helper: validates MP4 MIME type and < 200 MB file size matching storage.rules,
     * and optionally reuses existingVideoPath.
     */
    fun uploadValidatedVideo(
        context: Context,
        uri: Uri,
        subjectId: String,
        chapterId: String,
        lessonId: String,
        existingVideoPath: String = "",
        maxSizeBytes: Long = 200L * 1024L * 1024L,
        onProgress: (Int) -> Unit,
        onSuccess: (String, String) -> Unit,
        onError: (Exception) -> Unit
    ) {
        val resolver = context.contentResolver
        val mimeType = resolver.getType(uri)
        if (mimeType != "video/mp4") {
            onError(IllegalArgumentException("Unsupported video format: ${mimeType ?: "unknown"}. Only MP4 (video/mp4) is permitted by Storage rules."))
            return
        }

        var fileSizeBytes = -1L
        resolver.query(uri, arrayOf(OpenableColumns.SIZE), null, null, null)?.use { cursor ->
            val sizeIndex = cursor.getColumnIndex(OpenableColumns.SIZE)
            if (sizeIndex != -1 && cursor.moveToFirst()) {
                fileSizeBytes = cursor.getLong(sizeIndex)
            }
        }

        if (fileSizeBytes >= maxSizeBytes) {
            onError(IllegalArgumentException("Video must be smaller than ${maxSizeBytes / (1024 * 1024)} MB."))
            return
        }

        val path = existingVideoPath.ifEmpty {
            "lessons/$subjectId/$chapterId/$lessonId/video/lesson.mp4"
        }

        val reference = storage.reference.child(path)
        val metadata = StorageMetadata.Builder()
            .setContentType(mimeType)
            .build()

        reference.putFile(uri, metadata)
            .addOnProgressListener { snapshot ->
                val total = snapshot.totalByteCount
                if (total > 0) {
                    val percent = (100.0 * snapshot.bytesTransferred / total).toInt()
                    onProgress(percent)
                }
            }
            .addOnSuccessListener {
                reference.downloadUrl
                    .addOnSuccessListener { downloadUri ->
                        onSuccess(downloadUri.toString(), path)
                    }
                    .addOnFailureListener(onError)
            }
            .addOnFailureListener(onError)
    }

    /**
     * Requests a short-lived authorized video URL from the backend (/api/video/authorize),
     * verifying the caller's Firebase Auth ID token and lesson publication status.
     */
    fun requestAuthorizedVideoUrl(
        lessonId: String,
        backendBaseUrl: String,
        onSuccess: (String) -> Unit,
        onError: (Exception) -> Unit
    ) {
        val currentUser = FirebaseAuth.getInstance().currentUser
        if (currentUser == null) {
            onError(IllegalStateException("Authentication required to stream lesson videos."))
            return
        }

        currentUser.getIdToken(false)
            .addOnSuccessListener { tokenResult ->
                val idToken = tokenResult.token
                if (idToken.isNullOrBlank()) {
                    onError(IllegalStateException("Unable to obtain Firebase ID token."))
                    return@addOnSuccessListener
                }

                networkExecutor.execute {
                    var connection: HttpURLConnection? = null
                    try {
                        val base = backendBaseUrl.trimEnd('/')
                        val endpoint = URL("$base/api/video/authorize")
                        connection = (endpoint.openConnection() as HttpURLConnection).apply {
                            requestMethod = "POST"
                            connectTimeout = 10_000
                            readTimeout = 10_000
                            doOutput = true
                            setRequestProperty("Authorization", "Bearer $idToken")
                            setRequestProperty("Content-Type", "application/json")
                        }

                        val body = JSONObject().put("lessonId", lessonId).toString()
                        connection.outputStream.use { out ->
                            out.write(body.toByteArray(Charsets.UTF_8))
                        }

                        val code = connection.responseCode
                        val stream = if (code in 200..299) connection.inputStream else connection.errorStream
                        val responseText = stream?.bufferedReader()?.use { it.readText() } ?: "{}"
                        val json = JSONObject(responseText)

                        if (code !in 200..299) {
                            val msg = json.optString("error", "Authorization failed (HTTP $code)")
                            mainHandler.post { onError(SecurityException(msg)) }
                            return@execute
                        }

                        val rawUrl = json.optString("authorizedUrl", "")
                        if (rawUrl.isBlank()) {
                            mainHandler.post { onError(IllegalStateException("Missing authorizedUrl in response")) }
                            return@execute
                        }

                        val resolvedUrl = if (rawUrl.startsWith("/")) "$base$rawUrl" else rawUrl
                        mainHandler.post { onSuccess(resolvedUrl) }
                    } catch (e: Exception) {
                        mainHandler.post { onError(e) }
                    } finally {
                        connection?.disconnect()
                    }
                }
            }
            .addOnFailureListener(onError)
    }
}

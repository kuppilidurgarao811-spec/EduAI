package com.eduai.repository

import android.net.Uri
import com.eduai.model.Lesson
import com.google.firebase.firestore.FieldValue
import com.google.firebase.firestore.FirebaseFirestore
import com.google.firebase.firestore.Query
import com.google.firebase.storage.FirebaseStorage

class LessonRepository {

    private val db = FirebaseFirestore.getInstance()

    private val lessons =
        db.collection("lessons")

    private val storage =
        FirebaseStorage.getInstance()

    /**
     * 1. Add Lesson with updated Firebase structure:
     * lessons -> lessonId {
     *   id, subjectId, chapterId, title, description,
     *   content, order, isActive, isPublished,
     *   pdfUrl, pdfPath, videoUrl, videoPath, createdAt
     * }
     */
    fun addLesson(
        subjectId: String,
        chapterId: String,
        title: String,
        description: String,
        content: String,
        order: Int,
        pdfUrl: String = "",
        pdfPath: String = "",
        videoUrl: String = "",
        videoPath: String = "",
        onSuccess: (String) -> Unit,
        onError: (Exception) -> Unit
    ) {

        val document = lessons.document()

        val data = hashMapOf(
            "id" to document.id,
            "subjectId" to subjectId,
            "chapterId" to chapterId,
            "title" to title,
            "description" to description,
            "content" to content,
            "order" to order,
            "isActive" to true,
            "isPublished" to false,
            "pdfUrl" to pdfUrl,
            "pdfPath" to pdfPath,
            "videoUrl" to videoUrl,
            "videoPath" to videoPath,
            "createdAt" to FieldValue.serverTimestamp()
        )

        document.set(data)
            .addOnSuccessListener {
                onSuccess(document.id)
            }
            .addOnFailureListener {
                onError(it)
            }
    }

    fun updateLesson(
        lessonId: String,
        title: String,
        description: String,
        content: String,
        order: Int,
        onSuccess: () -> Unit,
        onError: (Exception) -> Unit
    ) {

        val data = hashMapOf<String, Any>(
            "title" to title,
            "description" to description,
            "content" to content,
            "order" to order
        )

        lessons.document(lessonId)
            .update(data)
            .addOnSuccessListener {
                onSuccess()
            }
            .addOnFailureListener {
                onError(it)
            }
    }

    /**
     * 2. Firebase Storage structure:
     * lessons/
     *   └── {subjectId}/
     *        └── {chapterId}/
     *             └── {lessonId}/
     *                  ├── pdf/
     *                  │    └── lesson.pdf
     *                  └── video/
     *                       └── lesson.mp4
     */
    fun uploadLessonPdf(
        subjectId: String,
        chapterId: String,
        lessonId: String,
        fileUri: Uri,
        fileName: String = "lesson.pdf",
        existingPdfPath: String = "",
        onSuccess: (downloadUrl: String) -> Unit,
        onError: (Exception) -> Unit
    ) {
        val pdfPath = existingPdfPath.ifEmpty {
            "lessons/$subjectId/$chapterId/$lessonId/pdf/$fileName"
        }
        val storageRef = storage.reference.child(pdfPath)

        storageRef.putFile(fileUri)
            .addOnSuccessListener {
                storageRef.downloadUrl
                    .addOnSuccessListener { uri ->
                        val downloadUrl = uri.toString()
                        updatePdfUrl(
                            lessonId = lessonId,
                            pdfUrl = downloadUrl,
                            pdfPath = pdfPath,
                            onSuccess = {
                                onSuccess(downloadUrl)
                            },
                            onError = onError
                        )
                    }
                    .addOnFailureListener { err ->
                        onError(err)
                    }
            }
            .addOnFailureListener { err ->
                onError(err)
            }
    }

    fun updatePdfUrl(
        lessonId: String,
        pdfUrl: String,
        pdfPath: String = "",
        onSuccess: () -> Unit,
        onError: (Exception) -> Unit
    ) {
        val updates = hashMapOf<String, Any>(
            "pdfUrl" to pdfUrl
        )
        if (pdfPath.isNotEmpty()) {
            updates["pdfPath"] = pdfPath
        }

        lessons.document(lessonId)
            .update(updates)
            .addOnSuccessListener {
                onSuccess()
            }
            .addOnFailureListener {
                onError(it)
            }
    }

    fun updateLessonPdf(
        lessonId: String,
        pdfUrl: String,
        onSuccess: () -> Unit,
        onError: (Exception) -> Unit
    ) {
        updatePdfUrl(lessonId = lessonId, pdfUrl = pdfUrl, onSuccess = onSuccess, onError = onError)
    }

    /**
     * Video Learning Management System:
     * Upload or replace lesson video at:
     * lessons/{subjectId}/{chapterId}/{lessonId}/video/lesson.mp4
     * Reuses existingVideoPath when replacing so files can be updated in place.
     */
    fun uploadLessonVideo(
        subjectId: String,
        chapterId: String,
        lessonId: String,
        fileUri: Uri,
        fileName: String = "lesson.mp4",
        existingVideoPath: String = "",
        onSuccess: (downloadUrl: String, videoPath: String) -> Unit,
        onError: (Exception) -> Unit
    ) {
        val videoPath = existingVideoPath.ifEmpty {
            "lessons/$subjectId/$chapterId/$lessonId/video/$fileName"
        }
        val storageRef = storage.reference.child(videoPath)

        storageRef.putFile(fileUri)
            .addOnSuccessListener {
                storageRef.downloadUrl
                    .addOnSuccessListener { uri ->
                        val downloadUrl = uri.toString()
                        updateVideoUrl(
                            lessonId = lessonId,
                            videoUrl = downloadUrl,
                            videoPath = videoPath,
                            onSuccess = {
                                onSuccess(downloadUrl, videoPath)
                            },
                            onError = onError
                        )
                    }
                    .addOnFailureListener { err ->
                        onError(err)
                    }
            }
            .addOnFailureListener { err ->
                onError(err)
            }
    }

    /**
     * Video Learning Management System:
     * Update videoUrl and videoPath on lesson document in Firestore
     */
    fun updateVideoUrl(
        lessonId: String,
        videoUrl: String,
        videoPath: String = "",
        onSuccess: () -> Unit,
        onError: (Exception) -> Unit
    ) {
        val updates = hashMapOf<String, Any>(
            "videoUrl" to videoUrl
        )
        if (videoPath.isNotEmpty()) {
            updates["videoPath"] = videoPath
        }

        lessons.document(lessonId)
            .update(updates)
            .addOnSuccessListener {
                onSuccess()
            }
            .addOnFailureListener {
                onError(it)
            }
    }

    /**
     * Save both videoUrl and videoPath in Firestore
     */
    fun updateVideo(
        lessonId: String,
        videoUrl: String,
        videoPath: String,
        onSuccess: () -> Unit,
        onError: (Exception) -> Unit
    ) {

        lessons.document(lessonId)
            .update(
                mapOf(
                    "videoUrl" to videoUrl,
                    "videoPath" to videoPath
                )
            )
            .addOnSuccessListener {
                onSuccess()
            }
            .addOnFailureListener(onError)
    }

    fun disableLesson(
        lessonId: String,
        onSuccess: () -> Unit,
        onError: (Exception) -> Unit
    ) {

        lessons.document(lessonId)
            .update("isActive", false)
            .addOnSuccessListener {
                onSuccess()
            }
            .addOnFailureListener {
                onError(it)
            }
    }

    fun publishLesson(
        lessonId: String,
        onSuccess: () -> Unit,
        onError: (Exception) -> Unit
    ) {

        lessons.document(lessonId)
            .update("isPublished", true)
            .addOnSuccessListener {
                onSuccess()
            }
            .addOnFailureListener {
                onError(it)
            }
    }

    fun getLessons(
        chapterId: String,
        onSuccess: (List<Lesson>) -> Unit,
        onError: (Exception) -> Unit
    ) {

        lessons
            .whereEqualTo("chapterId", chapterId)
            .whereEqualTo("isActive", true)
            .orderBy("order", Query.Direction.ASCENDING)
            .get()
            .addOnSuccessListener { snapshot ->

                val list = snapshot.documents.mapNotNull {
                    it.toObject(Lesson::class.java)
                }

                onSuccess(list)
            }
            .addOnFailureListener {
                onError(it)
            }
    }

    /**
     * Student-side query: Students receive only published + active lessons
     */
    fun getPublishedLessons(
        chapterId: String,
        onSuccess: (List<Lesson>) -> Unit,
        onError: (Exception) -> Unit
    ) {

        FirebaseFirestore.getInstance()
            .collection("lessons")
            .whereEqualTo("chapterId", chapterId)
            .whereEqualTo("isActive", true)
            .whereEqualTo("isPublished", true)
            .orderBy(
                "order",
                Query.Direction.ASCENDING
            )
            .get()
            .addOnSuccessListener { result ->

                val lessons =
                    result.documents.mapNotNull {
                        it.toObject(Lesson::class.java)
                    }

                onSuccess(lessons)
            }
            .addOnFailureListener {
                onError(it)
            }
    }
}

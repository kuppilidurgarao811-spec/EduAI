package com.eduai.admin

import android.app.ProgressDialog
import android.content.Intent
import android.net.Uri
import android.os.Bundle
import android.provider.OpenableColumns
import android.widget.*
import android.widget.ProgressBar
import androidx.activity.result.ActivityResultLauncher
import androidx.activity.result.contract.ActivityResultContracts
import androidx.appcompat.app.AlertDialog
import androidx.appcompat.app.AppCompatActivity
import androidx.recyclerview.widget.LinearLayoutManager
import androidx.recyclerview.widget.RecyclerView
import com.eduai.R
import com.eduai.model.Lesson
import com.eduai.repository.LessonRepository
import com.eduai.repository.VideoRepository
import com.eduai.student.LessonPdfViewerActivity
import com.eduai.student.VideoPlayerActivity
import com.google.firebase.storage.FirebaseStorage
import com.google.firebase.storage.StorageMetadata

class LessonManagementActivity :
    AppCompatActivity() {

    private lateinit var recyclerView: RecyclerView
    private lateinit var adapter: LessonAdapter

    private val repository =
        LessonRepository()

    private val videoRepository = VideoRepository()

    private lateinit var subjectId: String
    private lateinit var chapterId: String

    // Target lesson when initiating a PDF file upload
    private var pendingUploadLesson: Lesson? = null
    private lateinit var pdfPickerLauncher: ActivityResultLauncher<String>

    // 6. Selected PDF URI & Activity Result Launcher
    private var selectedPdfUri: Uri? = null
    private var dialogTxtPdfName: TextView? = null

    private val pdfPicker =
        registerForActivityResult(
            ActivityResultContracts.GetContent()
        ) { uri ->

            if (uri != null) {

                selectedPdfUri = uri

                val fileName = queryFileName(uri) ?: "lesson.pdf"
                dialogTxtPdfName?.text = fileName

                Toast.makeText(
                    this,
                    "PDF selected",
                    Toast.LENGTH_SHORT
                ).show()
            }
        }

    // 6. Selected Video URI & Activity Result Launcher
    private var selectedVideoUri: Uri? = null
    private var videoStatusView: TextView? = null

    private val videoPicker =
        registerForActivityResult(
            ActivityResultContracts.GetContent()
        ) { uri ->

            selectedVideoUri = uri

            videoStatusView?.text =
                if (uri != null) {
                    "Video selected"
                } else {
                    "No video selected"
                }
        }

    override fun onCreate(savedInstanceState: Bundle?) {

        super.onCreate(savedInstanceState)

        setContentView(
            R.layout.activity_lesson_management
        )

        subjectId =
            intent.getStringExtra("subjectId") ?: ""

        chapterId =
            intent.getStringExtra("chapterId") ?: ""

        val chapterName =
            intent.getStringExtra("chapterName")
                ?: "Chapter"

        findViewById<TextView>(
            R.id.txtChapterName
        ).text = chapterName

        // Register Activity Result launcher for selecting PDF files
        pdfPickerLauncher = registerForActivityResult(
            ActivityResultContracts.GetContent()
        ) { uri: Uri? ->
            uri?.let { fileUri ->
                pendingUploadLesson?.let { lesson ->
                    uploadPdfToFirebase(lesson, fileUri)
                }
            }
        }

        recyclerView =
            findViewById(R.id.recyclerLessons)

        recyclerView.layoutManager =
            LinearLayoutManager(this)

        adapter = LessonAdapter(
            emptyList(),

            onEdit = { lesson ->
                showLessonDialog(lesson)
            },

            onPublish = { lesson ->
                publishLesson(lesson)
            },

            onDisable = { lesson ->
                disableLesson(lesson)
            },

            // Implementation 3: Upload PDF to Firebase Storage
            onUploadPdf = { lesson ->
                pendingUploadLesson = lesson
                pdfPickerLauncher.launch("application/pdf")
            },

            // Implementation 3: Open PDF Viewer
            onOpenPdf = { lesson ->
                val intent = Intent(
                    this,
                    LessonPdfViewerActivity::class.java
                ).apply {
                    putExtra("pdfUrl", lesson.pdfUrl)
                    putExtra("lessonTitle", lesson.title)
                }
                startActivity(intent)
            },

            // Video LMS: Preview video in VideoPlayerActivity
            onWatchVideo = { lesson ->

                val intent = Intent(
                    this,
                    VideoPlayerActivity::class.java
                )

                intent.putExtra("lessonId", lesson.id)
                intent.putExtra("videoUrl", lesson.videoUrl)
                intent.putExtra("lessonTitle", lesson.title)

                startActivity(intent)
            },

            // Quiz Management: Open QuizManagementActivity for selected lesson
            onManageQuiz = { lesson ->

                val intent = Intent(
                    this,
                    QuizManagementActivity::class.java
                )

                intent.putExtra("lessonId", lesson.id)
                intent.putExtra(
                    "subjectId",
                    lesson.subjectId.ifEmpty { subjectId }
                )
                intent.putExtra(
                    "chapterId",
                    lesson.chapterId.ifEmpty { chapterId }
                )

                startActivity(intent)
            }
        )

        recyclerView.adapter = adapter

        findViewById<Button>(
            R.id.btnAddLesson
        ).setOnClickListener {

            showLessonDialog(null)
        }

        loadLessons()
    }

    private fun loadLessons() {

        repository.getLessons(
            chapterId,

            onSuccess = {
                adapter.updateData(it)
            },

            onError = {
                Toast.makeText(
                    this,
                    it.message,
                    Toast.LENGTH_LONG
                ).show()
            }
        )
    }

    /**
     * 8. Upload PDF to Firebase Storage:
     * lessons/{subjectId}/{chapterId}/{lessonId}/pdf/lesson.pdf
     */
    private fun uploadPdf(
        uri: Uri,
        subjectId: String,
        chapterId: String,
        lessonId: String,
        onSuccess: (String) -> Unit,
        onError: (Exception) -> Unit
    ) {

        val storage =
            FirebaseStorage.getInstance()

        val reference =
            storage.reference
                .child(
                    "lessons/" +
                    "$subjectId/" +
                    "$chapterId/" +
                    "$lessonId/" +
                    "pdf/lesson.pdf"
                )

        reference.putFile(uri)
            .addOnSuccessListener {

                reference.downloadUrl
                    .addOnSuccessListener { downloadUri ->

                        onSuccess(
                            downloadUri.toString()
                        )
                    }
                    .addOnFailureListener {
                        onError(it)
                    }
            }
            .addOnFailureListener {
                onError(it)
            }
    }

    private fun uploadLessonVideo(
        lesson: Lesson,
        uri: Uri,
        progressBar: ProgressBar,
        statusView: TextView,
        onFinished: () -> Unit
    ) {

        progressBar.visibility = android.view.View.VISIBLE
        progressBar.progress = 0

        videoRepository.uploadVideo(
            uri = uri,
            subjectId = lesson.subjectId,
            chapterId = lesson.chapterId,
            lessonId = lesson.id,

            onProgress = { percent ->
                progressBar.progress = percent
                statusView.text = "Uploading: $percent%"
            },

            onSuccess = { url, path ->

                repository.updateVideo(
                    lessonId = lesson.id,
                    videoUrl = url,
                    videoPath = path,

                    onSuccess = {
                        statusView.text = "Video uploaded"
                        progressBar.visibility =
                            android.view.View.GONE

                        onFinished()
                    },

                    onError = { error ->
                        statusView.text =
                            "Could not save video URL: ${error.message}"
                    }
                )
            },

            onError = { error ->
                statusView.text =
                    "Upload failed: ${error.message}"

                progressBar.visibility =
                    android.view.View.GONE
            }
        )
    }

    /**
     * Uploads the selected PDF file to Firebase Storage and updates Firestore
     */
    private fun uploadPdfToFirebase(lesson: Lesson, uri: Uri) {
        val fileName = queryFileName(uri) ?: "lesson_${lesson.id}.pdf"

        @Suppress("DEPRECATION")
        val progressDialog = ProgressDialog(this).apply {
            setTitle("Uploading PDF")
            setMessage("Uploading '$fileName' to Firebase Storage...")
            setCancelable(false)
            show()
        }

        repository.uploadLessonPdf(
            subjectId = subjectId,
            chapterId = chapterId,
            lessonId = lesson.id,
            fileUri = uri,
            fileName = "lesson.pdf",
            onSuccess = { downloadUrl ->
                progressDialog.dismiss()
                Toast.makeText(
                    this,
                    "PDF uploaded and linked successfully!",
                    Toast.LENGTH_SHORT
                ).show()
                loadLessons()
            },
            onError = { err ->
                progressDialog.dismiss()
                Toast.makeText(
                    this,
                    "Upload failed: ${err.message}",
                    Toast.LENGTH_LONG
                ).show()
            }
        )
    }

    private fun queryFileName(uri: Uri): String? {
        var name: String? = null
        contentResolver.query(uri, null, null, null, null)?.use { cursor ->
            val nameIndex = cursor.getColumnIndex(OpenableColumns.DISPLAY_NAME)
            if (nameIndex != -1 && cursor.moveToFirst()) {
                name = cursor.getString(nameIndex)
            }
        }
        return name
    }

    private fun showLessonDialog(
        existingLesson: Lesson?
    ) {

        val view = layoutInflater.inflate(
            R.layout.dialog_add_lesson,
            null
        )

        val title =
            view.findViewById<EditText>(
                R.id.edtLessonTitle
            )

        val description =
            view.findViewById<EditText>(
                R.id.edtLessonDescription
            )

        val content =
            view.findViewById<EditText>(
                R.id.edtLessonContent
            )

        val order =
            view.findViewById<EditText>(
                R.id.edtLessonOrder
            )

        val uploadPdfButton =
            view.findViewById<Button>(
                R.id.btnUploadPdf
            )

        val pdfName =
            view.findViewById<TextView>(
                R.id.txtPdfName
            )

        dialogTxtPdfName = pdfName
        selectedPdfUri = null

        if (existingLesson != null && existingLesson.pdfUrl.isNotEmpty()) {
            pdfName.text = "PDF Attached"
        } else {
            pdfName.text = "No PDF selected"
        }

        uploadPdfButton.setOnClickListener {

            pdfPicker.launch("application/pdf")
        }

        val btnUploadVideo =
            view.findViewById<Button>(R.id.btnUploadVideo)

        val txtVideoStatus =
            view.findViewById<TextView>(R.id.txtVideoStatus)

        val videoProgress =
            view.findViewById<ProgressBar>(R.id.videoProgress)

        selectedVideoUri = null
        videoStatusView = txtVideoStatus

        txtVideoStatus.text =
            if (existingLesson?.videoUrl?.isNotEmpty() == true) {
                "Video already uploaded"
            } else {
                "No video selected"
            }

        btnUploadVideo.setOnClickListener {
            videoPicker.launch("video/*")
        }

        existingLesson?.let {

            title.setText(it.title)

            description.setText(
                it.description
            )

            content.setText(
                it.content
            )

            order.setText(
                it.order.toString()
            )
        }

        val dialog = AlertDialog.Builder(this)
            .setTitle(
                if (existingLesson == null)
                    "Add Lesson"
                else
                    "Edit Lesson"
            )
            .setView(view)
            .setNegativeButton(
                "Cancel",
                null
            )
            .setPositiveButton(
                if (existingLesson == null)
                    "Save Draft"
                else
                    "Update",
                null
            )
            .create()

        dialog.setOnShowListener {

            dialog.getButton(
                AlertDialog.BUTTON_POSITIVE
            ).setOnClickListener {

                val lessonTitle =
                    title.text.toString().trim()

                val lessonDescription =
                    description.text.toString().trim()

                val lessonContent =
                    content.text.toString().trim()

                val lessonOrder =
                    order.text.toString()
                        .toIntOrNull()

                if (lessonTitle.isEmpty()) {

                    title.error =
                        "Enter lesson title"

                    return@setOnClickListener
                }

                if (lessonOrder == null) {

                    order.error =
                        "Enter valid order"

                    return@setOnClickListener
                }

                if (existingLesson == null) {

                    repository.addLesson(
                        subjectId = subjectId,
                        chapterId = chapterId,
                        title = lessonTitle,
                        description = lessonDescription,
                        content = lessonContent,
                        order = lessonOrder,
                        onSuccess = { lessonId ->

                            if (lessonId.isEmpty()) {
                                Toast.makeText(
                                    this,
                                    "Missing lesson ID after save",
                                    Toast.LENGTH_LONG
                                ).show()
                                return@addLesson
                            }

                            val pdfUri = selectedPdfUri
                            val videoUri = selectedVideoUri

                            if (pdfUri == null && videoUri == null) {
                                dialog.dismiss()
                                loadLessons()
                                Toast.makeText(
                                    this,
                                    "Lesson saved without media",
                                    Toast.LENGTH_SHORT
                                ).show()
                                return@addLesson
                            }

                            val savedLesson = Lesson(
                                id = lessonId,
                                subjectId = subjectId,
                                chapterId = chapterId,
                                title = lessonTitle,
                                description = lessonDescription,
                                content = lessonContent,
                                order = lessonOrder
                            )

                            var pdfDone = (pdfUri == null)
                            var videoDone = (videoUri == null)

                            fun checkAllFinished() {
                                if (pdfDone && videoDone) {
                                    dialog.dismiss()
                                    loadLessons()
                                }
                            }

                            if (pdfUri != null) {
                                uploadPdf(
                                    uri = pdfUri,
                                    subjectId = subjectId,
                                    chapterId = chapterId,
                                    lessonId = lessonId,
                                    onSuccess = { pdfUrl ->
                                        repository.updatePdfUrl(
                                            lessonId = lessonId,
                                            pdfUrl = pdfUrl,
                                            pdfPath = "lessons/$subjectId/$chapterId/$lessonId/pdf/lesson.pdf",
                                            onSuccess = {
                                                Toast.makeText(
                                                    this,
                                                    "Lesson PDF saved",
                                                    Toast.LENGTH_SHORT
                                                ).show()
                                                pdfDone = true
                                                checkAllFinished()
                                            },
                                            onError = {
                                                Toast.makeText(
                                                    this,
                                                    it.message,
                                                    Toast.LENGTH_LONG
                                                ).show()
                                                pdfDone = true
                                                checkAllFinished()
                                            }
                                        )
                                    },
                                    onError = {
                                        Toast.makeText(
                                            this,
                                            "PDF upload failed: ${it.message}",
                                            Toast.LENGTH_LONG
                                        ).show()
                                        pdfDone = true
                                        checkAllFinished()
                                    }
                                )
                            }

                            if (videoUri != null) {
                                uploadLessonVideo(
                                    lesson = savedLesson,
                                    uri = videoUri,
                                    progressBar = videoProgress,
                                    statusView = txtVideoStatus,
                                    onFinished = {
                                        videoDone = true
                                        checkAllFinished()
                                    }
                                )
                            }
                        },

                        onError = {

                            Toast.makeText(
                                this,
                                it.message,
                                Toast.LENGTH_LONG
                            ).show()
                        }
                    )

                } else {

                    repository.updateLesson(
                        lessonId = existingLesson.id,
                        title = lessonTitle,
                        description = lessonDescription,
                        content = lessonContent,
                        order = lessonOrder,
                        onSuccess = {
                            val pdfUri = selectedPdfUri
                            val videoUri = selectedVideoUri
                            val targetLesson = existingLesson.copy(
                                subjectId = existingLesson.subjectId.ifEmpty { subjectId },
                                chapterId = existingLesson.chapterId.ifEmpty { chapterId }
                            )

                            if (pdfUri == null && videoUri == null) {
                                dialog.dismiss()
                                loadLessons()
                                Toast.makeText(
                                    this,
                                    "Lesson updated",
                                    Toast.LENGTH_SHORT
                                ).show()
                                return@updateLesson
                            }

                            var pdfDone = (pdfUri == null)
                            var videoDone = (videoUri == null)

                            fun finishIfBothDone() {
                                if (pdfDone && videoDone) {
                                    dialog.dismiss()
                                    loadLessons()
                                }
                            }

                            if (pdfUri != null) {
                                uploadPdf(
                                    uri = pdfUri,
                                    subjectId = targetLesson.subjectId,
                                    chapterId = targetLesson.chapterId,
                                    lessonId = targetLesson.id,
                                    onSuccess = { downloadUrl ->
                                        repository.updatePdfUrl(
                                            lessonId = targetLesson.id,
                                            pdfUrl = downloadUrl,
                                            pdfPath = "lessons/${targetLesson.subjectId}/${targetLesson.chapterId}/${targetLesson.id}/pdf/lesson.pdf",
                                            onSuccess = {
                                                Toast.makeText(
                                                    this,
                                                    "Lesson PDF updated",
                                                    Toast.LENGTH_SHORT
                                                ).show()
                                                pdfDone = true
                                                finishIfBothDone()
                                            },
                                            onError = { err ->
                                                Toast.makeText(
                                                    this,
                                                    "Failed to save PDF URL: ${err.message}",
                                                    Toast.LENGTH_LONG
                                                ).show()
                                                pdfDone = true
                                                finishIfBothDone()
                                            }
                                        )
                                    },
                                    onError = { err ->
                                        Toast.makeText(
                                            this,
                                            "Lesson updated, but PDF upload failed: ${err.message}",
                                            Toast.LENGTH_LONG
                                        ).show()
                                        pdfDone = true
                                        finishIfBothDone()
                                    }
                                )
                            }

                            if (videoUri != null) {
                                uploadLessonVideo(
                                    lesson = targetLesson,
                                    uri = videoUri,
                                    progressBar = videoProgress,
                                    statusView = txtVideoStatus,
                                    onFinished = {
                                        videoDone = true
                                        finishIfBothDone()
                                    }
                                )
                            }
                        },
                        onError = {
                            Toast.makeText(
                                this,
                                it.message,
                                Toast.LENGTH_LONG
                            ).show()
                        }
                    )
                }
            }
        }

        dialog.show()
    }

    private fun publishLesson(
        lesson: Lesson
    ) {

        AlertDialog.Builder(this)
            .setTitle("Publish Lesson")
            .setMessage(
                "Publish '${lesson.title}' for students?"
            )
            .setNegativeButton(
                "Cancel",
                null
            )
            .setPositiveButton(
                "Publish"
            ) { _, _ ->

                repository.publishLesson(
                    lesson.id,

                    onSuccess = {

                        loadLessons()

                        Toast.makeText(
                            this,
                            "Lesson published",
                            Toast.LENGTH_SHORT
                        ).show()
                    },

                    onError = {

                        Toast.makeText(
                            this,
                            it.message,
                            Toast.LENGTH_LONG
                        ).show()
                    }
                )
            }
            .show()
    }

    private fun disableLesson(
        lesson: Lesson
    ) {

        AlertDialog.Builder(this)
            .setTitle("Disable Lesson")
            .setMessage(
                "Hide this lesson?"
            )
            .setNegativeButton(
                "Cancel",
                null
            )
            .setPositiveButton(
                "Disable"
            ) { _, _ ->

                repository.disableLesson(
                    lesson.id,

                    onSuccess = {

                        loadLessons()

                        Toast.makeText(
                            this,
                            "Lesson disabled",
                            Toast.LENGTH_SHORT
                        ).show()
                    },

                    onError = {

                        Toast.makeText(
                            this,
                            it.message,
                            Toast.LENGTH_LONG
                        ).show()
                    }
                )
            }
            .show()
    }
}

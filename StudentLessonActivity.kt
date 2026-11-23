package com.eduai.student

import android.content.Intent
import android.net.Uri
import android.os.Bundle
import android.widget.Button
import android.widget.TextView
import android.widget.Toast
import androidx.appcompat.app.AppCompatActivity
import com.eduai.R
import com.eduai.model.Lesson

class StudentLessonActivity : AppCompatActivity() {

    private lateinit var lesson: Lesson

    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        setContentView(R.layout.activity_student_lesson)

        // Retrieve lesson details passed via Intent
        val lessonId = intent.getStringExtra("lessonId") ?: ""
        val title = intent.getStringExtra("title") ?: "Simple Linear Regression"
        val description = intent.getStringExtra("description") ?: "Introduction to simple regression"
        val content = intent.getStringExtra("content") ?: "Linear regression is a foundational statistical model used to learn the relationship between features and target outcomes."
        val pdfUrl = intent.getStringExtra("pdfUrl") ?: ""
        val videoUrl = intent.getStringExtra("videoUrl") ?: ""
        val videoPath = intent.getStringExtra("videoPath") ?: ""

        lesson = Lesson(
            id = lessonId,
            title = title,
            description = description,
            content = content,
            pdfUrl = pdfUrl,
            videoUrl = videoUrl,
            videoPath = videoPath
        )

        val txtTitle = findViewById<TextView>(R.id.txtLessonTitle)
        val txtSubtitle = findViewById<TextView>(R.id.txtLessonSubtitle)
        val txtContent = findViewById<TextView>(R.id.txtLessonContent)
        val btnOpenPdf = findViewById<Button>(R.id.btnOpenPdf)
        val btnWatchVideo = findViewById<Button>(R.id.btnWatchVideo)
        val btnAskAi = findViewById<Button>(R.id.btnAskAi)
        val btnTakeQuiz = findViewById<Button>(R.id.btnTakeQuiz)

        txtTitle.text = lesson.title
        txtSubtitle.text = "Introduction"
        txtContent.text = if (lesson.content.isNotEmpty()) lesson.content else lesson.description

        // 14. Student PDF Viewer Button Click Listener
        btnOpenPdf.setOnClickListener {

            if (lesson.pdfUrl.isNotEmpty()) {

                val intent = Intent(
                    Intent.ACTION_VIEW,
                    Uri.parse(lesson.pdfUrl)
                )

                startActivity(intent)

            } else {

                Toast.makeText(
                    this,
                    "PDF is not available",
                    Toast.LENGTH_SHORT
                ).show()
            }
        }

        // Video LMS: Student Video Player Button Click Listener
        btnWatchVideo.setOnClickListener {
            if (lesson.videoUrl.isNotEmpty() || lesson.videoPath.isNotEmpty()) {
                val intent = Intent(
                    this,
                    VideoPlayerActivity::class.java
                ).apply {
                    putExtra("lessonId", lesson.id)
                    putExtra("videoUrl", lesson.videoUrl)
                    putExtra("lessonTitle", lesson.title)
                }
                startActivity(intent)
            } else {
                Toast.makeText(
                    this,
                    "Video is not available for this lesson",
                    Toast.LENGTH_SHORT
                ).show()
            }
        }

        btnAskAi.setOnClickListener {
            Toast.makeText(this, "AI Study Assistant activated for ${lesson.title}", Toast.LENGTH_SHORT).show()
        }

        btnTakeQuiz.setOnClickListener {
            Toast.makeText(this, "Opening Quiz for ${lesson.title}", Toast.LENGTH_SHORT).show()
        }
    }
}

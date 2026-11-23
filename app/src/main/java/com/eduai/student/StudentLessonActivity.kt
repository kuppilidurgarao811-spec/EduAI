package com.eduai.student

import android.content.Intent
import android.net.Uri
import android.os.Bundle
import android.view.View
import android.widget.Button
import android.widget.TextView
import android.widget.Toast
import androidx.appcompat.app.AppCompatActivity
import androidx.recyclerview.widget.LinearLayoutManager
import androidx.recyclerview.widget.RecyclerView
import com.eduai.R
import com.eduai.model.Lesson
import com.eduai.model.Quiz
import com.eduai.repository.QuizRepository

class StudentLessonActivity : AppCompatActivity() {

    private lateinit var lesson: Lesson
    private val quizRepository = QuizRepository()
    private lateinit var quizAdapter: StudentQuizAdapter
    private var publishedQuizzes: List<Quiz> = emptyList()

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
        val txtNoQuizzes = findViewById<TextView>(R.id.txtNoQuizzes)
        val recyclerQuizzes = findViewById<RecyclerView>(R.id.recyclerLessonQuizzes)

        txtTitle.text = lesson.title
        txtSubtitle.text = "Introduction"
        txtContent.text = if (lesson.content.isNotEmpty()) lesson.content else lesson.description

        // 13. Setup RecyclerView for published lesson quizzes
        recyclerQuizzes.layoutManager = LinearLayoutManager(this)
        quizAdapter = StudentQuizAdapter(emptyList()) { quiz ->
            openQuiz(quiz)
        }
        recyclerQuizzes.adapter = quizAdapter

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
            val firstQuiz = publishedQuizzes.firstOrNull()
            if (firstQuiz != null) {
                openQuiz(firstQuiz)
            } else {
                Toast.makeText(
                    this,
                    "No published quiz available for ${lesson.title}",
                    Toast.LENGTH_SHORT
                ).show()
            }
        }

        loadPublishedQuizzes(txtNoQuizzes)
    }

    private fun loadPublishedQuizzes(emptyView: TextView) {
        if (lesson.id.isBlank()) {
            emptyView.visibility = View.VISIBLE
            return
        }

        quizRepository.getPublishedQuizzes(
            lessonId = lesson.id,

            onSuccess = { quizzes ->
                publishedQuizzes = quizzes
                quizAdapter.updateData(quizzes)
                emptyView.visibility =
                    if (quizzes.isEmpty()) View.VISIBLE else View.GONE
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

    private fun openQuiz(quiz: Quiz) {
        val intent = Intent(
            this,
            StudentQuizActivity::class.java
        )

        intent.putExtra("quizId", quiz.id)
        intent.putExtra("quizTitle", quiz.title)

        startActivity(intent)
    }
}

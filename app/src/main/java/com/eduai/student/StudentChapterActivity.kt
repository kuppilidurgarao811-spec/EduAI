package com.eduai.student

import android.os.Bundle
import android.widget.TextView
import android.widget.Toast
import androidx.appcompat.app.AppCompatActivity
import androidx.recyclerview.widget.LinearLayoutManager
import androidx.recyclerview.widget.RecyclerView
import com.eduai.R
import com.eduai.model.Chapter
import com.eduai.repository.ChapterRepository

class StudentChapterActivity : AppCompatActivity() {

    private lateinit var recyclerView: RecyclerView
    private lateinit var adapter: StudentChapterAdapter
    private val repository = ChapterRepository()
    private lateinit var subjectId: String

    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        setContentView(R.layout.activity_student_chapters)

        // Default or Intent passed subjectId
        subjectId = intent.getStringExtra("subjectId") ?: "ml001"
        val subjectName = intent.getStringExtra("subjectName") ?: "Machine Learning"

        findViewById<TextView>(R.id.txtSubjectName).text = subjectName

        recyclerView = findViewById(R.id.recyclerStudentChapters)
        recyclerView.layoutManager = LinearLayoutManager(this)

        adapter = StudentChapterAdapter(emptyList()) { chapter ->
            Toast.makeText(this, "Opening ${chapter.title}", Toast.LENGTH_SHORT).show()
        }
        recyclerView.adapter = adapter

        loadActiveChapters()
    }

    /**
     * 12. Student side:
     * Students should only receive active chapters.
     *
     * Firestore Query:
     * FirebaseFirestore.getInstance()
     *     .collection("chapters")
     *     .whereEqualTo("subjectId", subjectId)
     *     .whereEqualTo("isActive", true)
     *     .get()
     */
    private fun loadActiveChapters() {
        repository.getStudentChapters(
            subjectId,
            onSuccess = { activeChapters ->
                // Students only receive active chapters directly filtered by Firestore
                adapter.updateData(activeChapters)
            },
            onError = {
                Toast.makeText(this, it.message, Toast.LENGTH_LONG).show()
            }
        )
    }
}

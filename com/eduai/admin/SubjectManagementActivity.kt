package com.eduai.admin

import android.content.Intent
import android.os.Bundle
import androidx.appcompat.app.AppCompatActivity
import androidx.recyclerview.widget.LinearLayoutManager
import androidx.recyclerview.widget.RecyclerView
import com.eduai.R
import com.eduai.model.Subject

class SubjectManagementActivity : AppCompatActivity() {

    private lateinit var recyclerView: RecyclerView

    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        setContentView(R.layout.activity_subject_management)
    }

    /**
     * 10. Open Chapter Management from Subject Management
     * When the admin clicks a subject:
     */
    fun openChapterManagement(subject: Subject) {
        val intent = Intent(
            this,
            ChapterManagementActivity::class.java
        )

        intent.putExtra(
            "subjectId",
            subject.id
        )

        intent.putExtra(
            "subjectName",
            subject.name
        )

        startActivity(intent)
    }
}

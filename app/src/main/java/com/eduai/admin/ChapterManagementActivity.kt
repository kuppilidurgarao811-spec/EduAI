package com.eduai.admin

import android.content.Intent
import android.os.Bundle
import android.widget.*
import androidx.appcompat.app.AlertDialog
import androidx.appcompat.app.AppCompatActivity
import androidx.recyclerview.widget.LinearLayoutManager
import androidx.recyclerview.widget.RecyclerView
import com.eduai.R
import com.eduai.model.Chapter
import com.eduai.repository.ChapterRepository

class ChapterManagementActivity :
    AppCompatActivity() {

    private lateinit var recyclerView: RecyclerView
    private lateinit var adapter: ChapterAdapter

    private val repository =
        ChapterRepository()

    private lateinit var subjectId: String

    override fun onCreate(savedInstanceState: Bundle?) {

        super.onCreate(savedInstanceState)

        setContentView(
            R.layout.activity_chapter_management
        )

        subjectId =
            intent.getStringExtra("subjectId") ?: ""

        val subjectName =
            intent.getStringExtra("subjectName")
                ?: "Subject"

        findViewById<TextView>(
            R.id.txtSubjectName
        ).text = subjectName

        recyclerView =
            findViewById(R.id.recyclerChapters)

        recyclerView.layoutManager =
            LinearLayoutManager(this)

        adapter = ChapterAdapter(
            emptyList(),

            onEdit = { chapter ->
                showChapterDialog(chapter)
            },

            onDelete = { chapter ->
                disableChapter(chapter)
            },

            onChapterClick = { chapter ->

                val intent = Intent(
                    this,
                    LessonManagementActivity::class.java
                )

                intent.putExtra(
                    "subjectId",
                    chapter.subjectId
                )

                intent.putExtra(
                    "chapterId",
                    chapter.id
                )

                intent.putExtra(
                    "chapterName",
                    chapter.title
                )

                startActivity(intent)
            }
        )

        recyclerView.adapter = adapter

        findViewById<Button>(
            R.id.btnAddChapter
        ).setOnClickListener {

            showChapterDialog(null)
        }

        loadChapters()
    }

    private fun loadChapters() {

        repository.getChapters(
            subjectId,

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

    private fun showChapterDialog(
        existingChapter: Chapter?
    ) {

        val view = layoutInflater.inflate(
            R.layout.dialog_add_chapter,
            null
        )

        val title =
            view.findViewById<EditText>(
                R.id.edtChapterTitle
            )

        val description =
            view.findViewById<EditText>(
                R.id.edtChapterDescription
            )

        val order =
            view.findViewById<EditText>(
                R.id.edtChapterOrder
            )

        existingChapter?.let {

            title.setText(it.title)
            description.setText(it.description)
            order.setText(it.order.toString())
        }

        val dialog = AlertDialog.Builder(this)
            .setTitle(
                if (existingChapter == null)
                    "Add Chapter"
                else
                    "Edit Chapter"
            )
            .setView(view)
            .setNegativeButton("Cancel", null)
            .setPositiveButton(
                if (existingChapter == null)
                    "Save"
                else
                    "Update",
                null
            )
            .create()

        dialog.setOnShowListener {

            dialog.getButton(
                AlertDialog.BUTTON_POSITIVE
            ).setOnClickListener {

                val chapterTitle =
                    title.text.toString().trim()

                val chapterDescription =
                    description.text.toString().trim()

                val chapterOrder =
                    order.text.toString()
                        .toIntOrNull()

                if (chapterTitle.isEmpty()) {
                    title.error =
                        "Enter chapter title"
                    return@setOnClickListener
                }

                if (chapterOrder == null) {
                    order.error =
                        "Enter valid order"
                    return@setOnClickListener
                }

                if (existingChapter == null) {

                    repository.addChapter(
                        subjectId,
                        chapterTitle,
                        chapterDescription,
                        chapterOrder,

                        onSuccess = {
                            dialog.dismiss()
                            loadChapters()

                            Toast.makeText(
                                this,
                                "Chapter added",
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

                } else {

                    repository.updateChapter(
                        existingChapter.id,
                        chapterTitle,
                        chapterDescription,
                        chapterOrder,

                        onSuccess = {
                            dialog.dismiss()
                            loadChapters()

                            Toast.makeText(
                                this,
                                "Chapter updated",
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
            }
        }

        dialog.show()
    }

    private fun disableChapter(
        chapter: Chapter
    ) {

        AlertDialog.Builder(this)
            .setTitle("Disable Chapter")
            .setMessage(
                "Hide '${chapter.title}' from students?"
            )
            .setNegativeButton("Cancel", null)
            .setPositiveButton("Disable") { _, _ ->

                repository.disableChapter(
                    chapter.id,

                    onSuccess = {
                        loadChapters()

                        Toast.makeText(
                            this,
                            "Chapter disabled",
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

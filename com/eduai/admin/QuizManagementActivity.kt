package com.eduai.admin

import android.os.Bundle
import android.widget.*
import androidx.appcompat.app.AlertDialog
import androidx.appcompat.app.AppCompatActivity
import com.eduai.R
import com.eduai.repository.QuizRepository

class QuizManagementActivity : AppCompatActivity() {

    private val repository = QuizRepository()

    private lateinit var lessonId: String
    private lateinit var subjectId: String
    private lateinit var chapterId: String

    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        setContentView(R.layout.activity_quiz_management)

        lessonId = intent.getStringExtra("lessonId") ?: ""
        subjectId = intent.getStringExtra("subjectId") ?: ""
        chapterId = intent.getStringExtra("chapterId") ?: ""

        if (lessonId.isBlank() ||
            subjectId.isBlank() ||
            chapterId.isBlank()
        ) {
            Toast.makeText(
                this, "Missing lesson information",
                Toast.LENGTH_LONG
            ).show()
            finish()
            return
        }

        findViewById<Button>(R.id.btnCreateQuiz)
            .setOnClickListener {
                showCreateQuizDialog()
            }

        findViewById<TextView>(R.id.txtQuizLesson)
            .text = "Quiz Management"
    }

    private fun showCreateQuizDialog() {
        val view = layoutInflater.inflate(
            R.layout.dialog_create_quiz, null
        )

        val title = view.findViewById<EditText>(R.id.edtQuizTitle)
        val description = view.findViewById<EditText>(R.id.edtQuizDescription)
        val total = view.findViewById<EditText>(R.id.edtTotalMarks)
        val pass = view.findViewById<EditText>(R.id.edtPassMarks)
        val duration = view.findViewById<EditText>(R.id.edtDuration)

        val dialog = AlertDialog.Builder(this)
            .setTitle("Create Quiz")
            .setView(view)
            .setNegativeButton("Cancel", null)
            .setPositiveButton("Create", null)
            .create()

        dialog.setOnShowListener {
            dialog.getButton(AlertDialog.BUTTON_POSITIVE)
                .setOnClickListener {

                    val quizTitle = title.text.toString().trim()
                    val quizDescription = description.text.toString().trim()
                    val totalMarks = total.text.toString().toIntOrNull()
                    val passMarks = pass.text.toString().toIntOrNull()
                    val minutes = duration.text.toString().toIntOrNull()

                    if (quizTitle.isBlank()) {
                        title.error = "Enter quiz title"
                        return@setOnClickListener
                    }

                    if (totalMarks == null || totalMarks <= 0 ||
                        passMarks == null || passMarks < 0 ||
                        passMarks > totalMarks ||
                        minutes == null || minutes <= 0
                    ) {
                        Toast.makeText(
                            this,
                            "Check marks and duration",
                            Toast.LENGTH_SHORT
                        ).show()
                        return@setOnClickListener
                    }

                    repository.addQuiz(
                        subjectId,
                        chapterId,
                        lessonId,
                        quizTitle,
                        quizDescription,
                        totalMarks,
                        passMarks,
                        minutes,
                        onSuccess = { quizId ->
                            dialog.dismiss()
                            showAddQuestionDialog(quizId, 1)
                        },
                        onError = {
                            Toast.makeText(
                                this, it.message,
                                Toast.LENGTH_LONG
                            ).show()
                        }
                    )
                }
        }

        dialog.show()
    }

    private fun showAddQuestionDialog(
        quizId: String,
        questionOrder: Int
    ) {
        val view = layoutInflater.inflate(
            R.layout.dialog_add_question, null
        )

        val question = view.findViewById<EditText>(R.id.edtQuestion)
        val optionIds = listOf(
            R.id.edtOption1, R.id.edtOption2,
            R.id.edtOption3, R.id.edtOption4
        )
        val optionViews = optionIds.map {
            view.findViewById<EditText>(it)
        }

        val radioGroup =
            view.findViewById<RadioGroup>(R.id.radioCorrectAnswer)

        val marksView =
            view.findViewById<EditText>(R.id.edtQuestionMarks)

        val dialog = AlertDialog.Builder(this)
            .setTitle("Add Question $questionOrder")
            .setView(view)
            .setNegativeButton("Finish Later", null)
            .setPositiveButton("Save Question", null)
            .create()

        dialog.setOnShowListener {
            dialog.getButton(AlertDialog.BUTTON_POSITIVE)
                .setOnClickListener {

                    val text = question.text.toString().trim()
                    val options = optionViews.map {
                        it.text.toString().trim()
                    }

                    val selectedIndex = when (radioGroup.checkedRadioButtonId) {
                        R.id.radioA -> 0
                        R.id.radioB -> 1
                        R.id.radioC -> 2
                        R.id.radioD -> 3
                        else -> -1
                    }

                    val marks = marksView.text.toString().toIntOrNull()

                    if (text.isBlank() ||
                        options.any { it.isBlank() } ||
                        selectedIndex == -1 ||
                        marks == null || marks <= 0
                    ) {
                        Toast.makeText(
                            this,
                            "Complete all fields and select the answer",
                            Toast.LENGTH_SHORT
                        ).show()
                        return@setOnClickListener
                    }

                    repository.addQuestion(
                        quizId = quizId,
                        questionText = text,
                        options = options,
                        correctOptionIndex = selectedIndex,
                        marks = marks,
                        order = questionOrder,
                        onSuccess = {
                            dialog.dismiss()
                            showAddQuestionDialog(
                                quizId, questionOrder + 1
                            )
                        },
                        onError = {
                            Toast.makeText(
                                this, it.message,
                                Toast.LENGTH_LONG
                            ).show()
                        }
                    )
                }
        }

        dialog.show()
    }
}

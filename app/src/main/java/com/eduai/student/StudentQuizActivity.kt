package com.eduai.student

import android.os.Bundle
import android.widget.*
import androidx.appcompat.app.AppCompatActivity
import com.eduai.R
import com.eduai.model.QuizQuestion
import com.eduai.repository.QuizRepository
import com.google.firebase.auth.FirebaseAuth
import com.google.firebase.functions.FirebaseFunctions

class StudentQuizActivity : AppCompatActivity() {

    private val repository = QuizRepository()
    private val functions = FirebaseFunctions.getInstance()

    private lateinit var quizId: String

    private lateinit var questions: List<QuizQuestion>

    private val answers = mutableMapOf<String, Int>()

    private var currentIndex = 0

    private lateinit var questionText: TextView
    private lateinit var questionNumber: TextView
    private lateinit var optionsGroup: RadioGroup
    private lateinit var nextButton: Button
    private lateinit var submitButton: Button

    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)

        setContentView(R.layout.activity_student_quiz)

        quizId = intent.getStringExtra("quizId") ?: ""

        if (quizId.isBlank() ||
            FirebaseAuth.getInstance().currentUser == null
        ) {
            Toast.makeText(
                this,
                "Please log in and select a quiz",
                Toast.LENGTH_LONG
            ).show()
            finish()
            return
        }

        questionText = findViewById(R.id.txtQuestion)
        questionNumber = findViewById(R.id.txtQuestionNumber)
        optionsGroup = findViewById(R.id.radioOptions)
        nextButton = findViewById(R.id.btnNextQuestion)
        submitButton = findViewById(R.id.btnSubmitQuiz)

        findViewById<TextView>(R.id.txtQuizTitle).text =
            intent.getStringExtra("quizTitle") ?: "Quiz"

        nextButton.setOnClickListener {
            saveAnswer()

            if (currentIndex < questions.lastIndex) {
                currentIndex++
                displayQuestion()
            }
        }

        submitButton.setOnClickListener {
            saveAnswer()
            submitQuiz()
        }

        loadQuestions()
    }

    private fun loadQuestions() {

        repository.getQuestions(
            quizId,

            onSuccess = { list ->

                if (list.isEmpty()) {
                    Toast.makeText(
                        this,
                        "No questions available",
                        Toast.LENGTH_SHORT
                    ).show()
                    finish()
                    return@getQuestions
                }

                questions = list

                displayQuestion()
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

    private fun displayQuestion() {

        val question = questions[currentIndex]

        questionNumber.text =
            "Question ${currentIndex + 1} of ${questions.size}"

        questionText.text = question.questionText

        optionsGroup.removeAllViews()

        question.options.forEachIndexed { index, option ->

            val radio = RadioButton(this)

            radio.id = index + 1
            radio.text = option
            radio.textSize = 16f
            radio.tag = index

            optionsGroup.addView(radio)
        }

        val previousAnswer = answers[question.id]

        if (previousAnswer != null) {
            optionsGroup.check(previousAnswer + 1)
        }

        nextButton.isEnabled =
            currentIndex < questions.lastIndex

        nextButton.text =
            if (currentIndex == questions.lastIndex)
                "Last Question"
            else
                "Next Question"
    }

    private fun saveAnswer() {

        val selectedId = optionsGroup.checkedRadioButtonId

        if (selectedId == -1) return

        val selectedRadio =
            findViewById<RadioButton>(selectedId)

        val selectedIndex =
            selectedRadio.tag as Int

        answers[questions[currentIndex].id] =
            selectedIndex
    }

    private fun submitQuiz() {

        if (answers.size != questions.size) {
            Toast.makeText(
                this,
                "Please answer all questions",
                Toast.LENGTH_SHORT
            ).show()
            return
        }

        submitButton.isEnabled = false
        nextButton.isEnabled = false

        val answerList = questions.map { question ->

            mapOf(
                "questionId" to question.id,
                "selectedOptionIndex" to answers[question.id]
            )
        }

        val payload = hashMapOf(
            "quizId" to quizId,
            "answers" to answerList
        )

        functions
            .getHttpsCallable("submitEduAIQuiz")
            .call(payload)
            .addOnSuccessListener { result ->

                val data =
                    result.data as? Map<*, *>

                val score =
                    (data?.get("score") as? Number)?.toInt() ?: 0

                val total =
                    (data?.get("totalMarks") as? Number)?.toInt() ?: 0

                val percentage =
                    (data?.get("percentage") as? Number)?.toDouble() ?: 0.0

                val passed =
                    data?.get("passed") as? Boolean ?: false

                showResult(score, total, percentage, passed)
            }
            .addOnFailureListener { error ->

                submitButton.isEnabled = true
                nextButton.isEnabled = true

                Toast.makeText(
                    this,
                    error.message ?: "Submission failed",
                    Toast.LENGTH_LONG
                ).show()
            }
    }

    private fun showResult(
        score: Int,
        total: Int,
        percentage: Double,
        passed: Boolean
    ) {

        val message = """
            Your Quiz Result

            Marks: $score / $total

            Percentage: ${"%.1f".format(percentage)}%

            Result: ${if (passed) "PASS" else "FAIL"}
        """.trimIndent()

        androidx.appcompat.app.AlertDialog.Builder(this)
            .setTitle("Quiz Completed")
            .setMessage(message)
            .setCancelable(false)
            .setPositiveButton("Finish") { _, _ ->
                finish()
            }
            .show()
    }
}

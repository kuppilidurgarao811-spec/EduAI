package com.eduai.repository

import com.eduai.model.Quiz
import com.eduai.model.QuizQuestion
import com.google.firebase.firestore.FieldValue
import com.google.firebase.firestore.FirebaseFirestore
import com.google.firebase.firestore.Query

class QuizRepository {

    private val db = FirebaseFirestore.getInstance()

    private val quizzes = db.collection("quizzes")

    fun addQuiz(
        subjectId: String,
        chapterId: String,
        lessonId: String,
        title: String,
        description: String,
        totalMarks: Int,
        passMarks: Int,
        durationMinutes: Int,
        onSuccess: (String) -> Unit,
        onError: (Exception) -> Unit
    ) {
        val ref = quizzes.document()

        val data = hashMapOf(
            "id" to ref.id,
            "subjectId" to subjectId,
            "chapterId" to chapterId,
            "lessonId" to lessonId,
            "title" to title,
            "description" to description,
            "totalMarks" to totalMarks,
            "passMarks" to passMarks,
            "durationMinutes" to durationMinutes,
            "isPublished" to false,
            "isActive" to true,
            "createdAt" to FieldValue.serverTimestamp()
        )

        ref.set(data)
            .addOnSuccessListener {
                onSuccess(ref.id)
            }
            .addOnFailureListener(onError)
    }

    fun addQuestion(
        quizId: String,
        questionText: String,
        options: List<String>,
        correctOptionIndex: Int,
        marks: Int,
        order: Int,
        onSuccess: () -> Unit,
        onError: (Exception) -> Unit
    ) {
        if (options.size != 4 ||
            options.any { it.isBlank() } ||
            correctOptionIndex !in 0..3 ||
            questionText.isBlank() ||
            marks <= 0
        ) {
            onError(IllegalArgumentException("Invalid question details"))
            return
        }

        val questionRef = quizzes.document(quizId)
            .collection("questions").document()

        val answerRef = quizzes.document(quizId)
            .collection("answerKeys").document(questionRef.id)

        val batch = db.batch()

        batch.set(questionRef, mapOf(
            "id" to questionRef.id,
            "questionText" to questionText,
            "options" to options,
            "marks" to marks,
            "order" to order
        ))

        batch.set(answerRef, mapOf(
            "correctOptionIndex" to correctOptionIndex
        ))

        batch.commit()
            .addOnSuccessListener { onSuccess() }
            .addOnFailureListener(onError)
    }

    fun getAdminQuizzes(
        lessonId: String,
        onSuccess: (List<Quiz>) -> Unit,
        onError: (Exception) -> Unit
    ) {
        quizzes
            .whereEqualTo("lessonId", lessonId)
            .whereEqualTo("isActive", true)
            .get()
            .addOnSuccessListener { result ->
                onSuccess(
                    result.documents.mapNotNull {
                        it.toObject(Quiz::class.java)
                    }
                )
            }
            .addOnFailureListener(onError)
    }

    fun getPublishedQuizzes(
        lessonId: String,
        onSuccess: (List<Quiz>) -> Unit,
        onError: (Exception) -> Unit
    ) {
        quizzes
            .whereEqualTo("lessonId", lessonId)
            .whereEqualTo("isActive", true)
            .whereEqualTo("isPublished", true)
            .get()
            .addOnSuccessListener { result ->
                onSuccess(
                    result.documents.mapNotNull {
                        it.toObject(Quiz::class.java)
                    }
                )
            }
            .addOnFailureListener(onError)
    }

    fun getQuestions(
        quizId: String,
        onSuccess: (List<QuizQuestion>) -> Unit,
        onError: (Exception) -> Unit
    ) {
        quizzes.document(quizId)
            .collection("questions")
            .orderBy("order", Query.Direction.ASCENDING)
            .get()
            .addOnSuccessListener { result ->
                onSuccess(
                    result.documents.mapNotNull {
                        it.toObject(QuizQuestion::class.java)
                    }
                )
            }
            .addOnFailureListener(onError)
    }

    fun publishQuiz(
        quizId: String,
        onSuccess: () -> Unit,
        onError: (Exception) -> Unit
    ) {
        quizzes.document(quizId)
            .update("isPublished", true)
            .addOnSuccessListener { onSuccess() }
            .addOnFailureListener(onError)
    }

    fun publishQuizAfterValidation(
        quizId: String,
        onSuccess: () -> Unit,
        onError: (Exception) -> Unit
    ) {
        val quizRef = quizzes.document(quizId)

        quizRef.collection("questions")
            .get()
            .addOnSuccessListener { snapshot ->

                if (snapshot.isEmpty) {
                    onError(
                        IllegalStateException(
                            "Add at least one question before publishing"
                        )
                    )
                    return@addOnSuccessListener
                }

                val totalQuestionMarks = snapshot.documents.sumOf {
                    it.getLong("marks")?.toInt() ?: 0
                }

                quizRef.get()
                    .addOnSuccessListener { quiz ->

                        val expectedMarks =
                            quiz.getLong("totalMarks")?.toInt() ?: 0

                        if (totalQuestionMarks != expectedMarks) {
                            onError(
                                IllegalStateException(
                                    "Question marks ($totalQuestionMarks) " +
                                    "must equal quiz total marks ($expectedMarks)"
                                )
                            )
                            return@addOnSuccessListener
                        }

                        quizRef.update("isPublished", true)
                            .addOnSuccessListener { onSuccess() }
                            .addOnFailureListener(onError)
                    }
                    .addOnFailureListener(onError)
            }
            .addOnFailureListener(onError)
    }
}

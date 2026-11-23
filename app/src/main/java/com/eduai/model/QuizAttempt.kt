package com.eduai.model

import com.google.firebase.Timestamp

data class QuizAttempt(
    val id: String = "",
    val quizId: String = "",
    val userId: String = "",
    val score: Int = 0,
    val totalMarks: Int = 0,
    val percentage: Double = 0.0,
    val passed: Boolean = false,
    val submittedAt: Timestamp? = null
)

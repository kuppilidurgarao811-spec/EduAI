package com.eduai.model

data class QuizQuestion(
    val id: String = "",
    val questionText: String = "",
    val options: List<String> = emptyList(),
    val marks: Int = 1,
    val order: Int = 0
)

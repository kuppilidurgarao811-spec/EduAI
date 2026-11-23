package com.eduai.model

import com.google.firebase.Timestamp

data class Quiz(
    val id: String = "",
    val subjectId: String = "",
    val chapterId: String = "",
    val lessonId: String = "",
    val title: String = "",
    val description: String = "",
    val totalMarks: Int = 0,
    val passMarks: Int = 0,
    val durationMinutes: Int = 30,
    val isPublished: Boolean = false,
    val isActive: Boolean = true,
    val createdAt: Timestamp? = null
)

package com.eduai.model

import com.google.firebase.Timestamp

data class Lesson(
    val id: String = "",
    val subjectId: String = "",
    val chapterId: String = "",
    val title: String = "",
    val description: String = "",
    val content: String = "",
    val order: Int = 0,
    val isActive: Boolean = true,
    val isPublished: Boolean = false,
    val pdfUrl: String = "",
    val videoUrl: String = "",
    val videoPath: String = "",
    val createdAt: Timestamp? = null
)

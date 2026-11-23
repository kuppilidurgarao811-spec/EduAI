package com.eduai.model

import com.google.firebase.Timestamp

data class Chapter(
    val id: String = "",
    val subjectId: String = "",
    val title: String = "",
    val description: String = "",
    val order: Int = 0,
    val isActive: Boolean = true,
    val createdAt: Timestamp? = null
)

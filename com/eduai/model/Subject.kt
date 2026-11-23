package com.eduai.model

data class Subject(
    val id: String = "",
    val name: String = "",
    val description: String = "",
    val code: String = "",
    val level: String = "",
    val semester: Int? = null,
    val isActive: Boolean = true
)

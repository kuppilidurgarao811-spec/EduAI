package com.eduai.repository

import com.eduai.model.Chapter
import com.google.firebase.firestore.FirebaseFirestore
import com.google.firebase.firestore.Query
import com.google.firebase.firestore.FieldValue

class ChapterRepository {

    private val db = FirebaseFirestore.getInstance()

    private val chapters =
        db.collection("chapters")

    fun addChapter(
        subjectId: String,
        title: String,
        description: String,
        order: Int,
        onSuccess: () -> Unit,
        onError: (Exception) -> Unit
    ) {

        val document = chapters.document()

        val chapter = hashMapOf(
            "id" to document.id,
            "subjectId" to subjectId,
            "title" to title,
            "description" to description,
            "order" to order,
            "isActive" to true,
            "createdAt" to FieldValue.serverTimestamp()
        )

        document.set(chapter)
            .addOnSuccessListener {
                onSuccess()
            }
            .addOnFailureListener {
                onError(it)
            }
    }

    fun updateChapter(
        chapterId: String,
        title: String,
        description: String,
        order: Int,
        onSuccess: () -> Unit,
        onError: (Exception) -> Unit
    ) {

        val updateData = hashMapOf<String, Any>(
            "title" to title,
            "description" to description,
            "order" to order
        )

        chapters.document(chapterId)
            .update(updateData)
            .addOnSuccessListener {
                onSuccess()
            }
            .addOnFailureListener {
                onError(it)
            }
    }

    fun disableChapter(
        chapterId: String,
        onSuccess: () -> Unit,
        onError: (Exception) -> Unit
    ) {

        chapters.document(chapterId)
            .update("isActive", false)
            .addOnSuccessListener {
                onSuccess()
            }
            .addOnFailureListener {
                onError(it)
            }
    }

    fun getChapters(
        subjectId: String,
        onSuccess: (List<Chapter>) -> Unit,
        onError: (Exception) -> Unit
    ) {

        chapters
            .whereEqualTo("subjectId", subjectId)
            .whereEqualTo("isActive", true)
            .orderBy("order", Query.Direction.ASCENDING)
            .get()
            .addOnSuccessListener { snapshot ->

                val list = snapshot.documents.mapNotNull {
                    it.toObject(Chapter::class.java)
                }

                onSuccess(list)
            }
            .addOnFailureListener {
                onError(it)
            }
    }

    /**
     * 12. Student side:
     * Students should only receive active chapters.
     *
     * Query:
     * FirebaseFirestore.getInstance()
     *     .collection("chapters")
     *     .whereEqualTo("subjectId", subjectId)
     *     .whereEqualTo("isActive", true)
     *     .get()
     */
    fun getStudentChapters(
        subjectId: String,
        onSuccess: (List<Chapter>) -> Unit,
        onError: (Exception) -> Unit
    ) {
        FirebaseFirestore.getInstance()
            .collection("chapters")
            .whereEqualTo("subjectId", subjectId)
            .whereEqualTo("isActive", true)
            .get()
            .addOnSuccessListener { snapshot ->
                val list = snapshot.documents.mapNotNull {
                    it.toObject(Chapter::class.java)
                }.sortedBy { it.order }
                onSuccess(list)
            }
            .addOnFailureListener {
                onError(it)
            }
    }
}

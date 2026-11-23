package com.eduai.repository

import com.eduai.model.Lesson
import com.google.firebase.firestore.FirebaseFirestore
import com.google.firebase.firestore.FieldValue
import com.google.firebase.firestore.Query

class LessonRepository {

    private val db = FirebaseFirestore.getInstance()

    private val lessons =
        db.collection("lessons")

    fun addLesson(
        subjectId: String,
        chapterId: String,
        title: String,
        description: String,
        content: String,
        order: Int,
        onSuccess: () -> Unit,
        onError: (Exception) -> Unit
    ) {

        val document = lessons.document()

        val data = hashMapOf(
            "id" to document.id,
            "subjectId" to subjectId,
            "chapterId" to chapterId,
            "title" to title,
            "description" to description,
            "content" to content,
            "order" to order,
            "isActive" to true,
            "isPublished" to false,
            "createdAt" to FieldValue.serverTimestamp()
        )

        document.set(data)
            .addOnSuccessListener {
                onSuccess()
            }
            .addOnFailureListener {
                onError(it)
            }
    }

    fun updateLesson(
        lessonId: String,
        title: String,
        description: String,
        content: String,
        order: Int,
        onSuccess: () -> Unit,
        onError: (Exception) -> Unit
    ) {

        val data = hashMapOf<String, Any>(
            "title" to title,
            "description" to description,
            "content" to content,
            "order" to order
        )

        lessons.document(lessonId)
            .update(data)
            .addOnSuccessListener {
                onSuccess()
            }
            .addOnFailureListener {
                onError(it)
            }
    }

    fun disableLesson(
        lessonId: String,
        onSuccess: () -> Unit,
        onError: (Exception) -> Unit
    ) {

        lessons.document(lessonId)
            .update("isActive", false)
            .addOnSuccessListener {
                onSuccess()
            }
            .addOnFailureListener {
                onError(it)
            }
    }

    fun publishLesson(
        lessonId: String,
        onSuccess: () -> Unit,
        onError: (Exception) -> Unit
    ) {

        lessons.document(lessonId)
            .update("isPublished", true)
            .addOnSuccessListener {
                onSuccess()
            }
            .addOnFailureListener {
                onError(it)
            }
    }

    fun getLessons(
        chapterId: String,
        onSuccess: (List<Lesson>) -> Unit,
        onError: (Exception) -> Unit
    ) {

        lessons
            .whereEqualTo("chapterId", chapterId)
            .whereEqualTo("isActive", true)
            .orderBy("order", Query.Direction.ASCENDING)
            .get()
            .addOnSuccessListener { snapshot ->

                val list = snapshot.documents.mapNotNull {
                    it.toObject(Lesson::class.java)
                }

                onSuccess(list)
            }
            .addOnFailureListener {
                onError(it)
            }
    }

    /**
     * 11. Student-side query
     * Students should see only published lessons.
     */
    fun getPublishedLessons(
        chapterId: String,
        onSuccess: (List<Lesson>) -> Unit,
        onError: (Exception) -> Unit
    ) {

        FirebaseFirestore.getInstance()
            .collection("lessons")
            .whereEqualTo("chapterId", chapterId)
            .whereEqualTo("isActive", true)
            .whereEqualTo("isPublished", true)
            .orderBy(
                "order",
                Query.Direction.ASCENDING
            )
            .get()
            .addOnSuccessListener { result ->

                val lessons =
                    result.documents.mapNotNull {
                        it.toObject(Lesson::class.java)
                    }

                onSuccess(lessons)
            }
            .addOnFailureListener {
                onError(it)
            }
    }
}

package com.eduai.student

import android.view.LayoutInflater
import android.view.View
import android.view.ViewGroup
import android.widget.Button
import android.widget.TextView
import androidx.recyclerview.widget.RecyclerView
import com.eduai.R
import com.eduai.model.Quiz

class StudentQuizAdapter(
    private var quizzes: List<Quiz>,
    private val onSelectQuiz: (Quiz) -> Unit
) : RecyclerView.Adapter<StudentQuizAdapter.QuizViewHolder>() {

    class QuizViewHolder(view: View) : RecyclerView.ViewHolder(view) {
        val title: TextView = view.findViewById(R.id.txtQuizItemTitle)
        val description: TextView = view.findViewById(R.id.txtQuizItemDescription)
        val meta: TextView = view.findViewById(R.id.txtQuizItemMeta)
        val startButton: Button = view.findViewById(R.id.btnStartQuiz)
    }

    override fun onCreateViewHolder(
        parent: ViewGroup,
        viewType: Int
    ): QuizViewHolder {
        val view = LayoutInflater.from(parent.context)
            .inflate(R.layout.item_student_quiz, parent, false)
        return QuizViewHolder(view)
    }

    override fun onBindViewHolder(
        holder: QuizViewHolder,
        position: Int
    ) {
        val quiz = quizzes[position]

        holder.title.text = quiz.title
        holder.description.text = quiz.description
        holder.description.visibility =
            if (quiz.description.isNotBlank()) View.VISIBLE else View.GONE
        holder.meta.text =
            "Marks: ${quiz.totalMarks} · Pass: ${quiz.passMarks} · ${quiz.durationMinutes} mins"

        holder.itemView.setOnClickListener {
            onSelectQuiz(quiz)
        }
        holder.startButton.setOnClickListener {
            onSelectQuiz(quiz)
        }
    }

    override fun getItemCount(): Int = quizzes.size

    fun updateData(newList: List<Quiz>) {
        quizzes = newList
        notifyDataSetChanged()
    }
}

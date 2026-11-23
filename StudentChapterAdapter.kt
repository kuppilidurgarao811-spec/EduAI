package com.eduai.student

import android.view.LayoutInflater
import android.view.View
import android.view.ViewGroup
import android.widget.TextView
import androidx.recyclerview.widget.RecyclerView
import com.eduai.R
import com.eduai.model.Chapter

class StudentChapterAdapter(
    private var chapters: List<Chapter>,
    private val onChapterClick: (Chapter) -> Unit
) : RecyclerView.Adapter<StudentChapterAdapter.StudentChapterViewHolder>() {

    class StudentChapterViewHolder(view: View) :
        RecyclerView.ViewHolder(view) {

        val title: TextView =
            view.findViewById(R.id.txtStudentChapterTitle)

        val description: TextView =
            view.findViewById(R.id.txtStudentChapterDescription)

        val order: TextView =
            view.findViewById(R.id.txtStudentChapterOrder)
    }

    override fun onCreateViewHolder(
        parent: ViewGroup,
        viewType: Int
    ): StudentChapterViewHolder {

        val view = LayoutInflater.from(parent.context)
            .inflate(R.layout.item_student_chapter, parent, false)

        return StudentChapterViewHolder(view)
    }

    override fun onBindViewHolder(
        holder: StudentChapterViewHolder,
        position: Int
    ) {

        val chapter = chapters[position]

        holder.title.text =
            "${chapter.order}. ${chapter.title}"

        holder.description.text =
            chapter.description

        holder.order.text =
            "Chapter ${chapter.order}"

        holder.itemView.setOnClickListener {
            onChapterClick(chapter)
        }
    }

    override fun getItemCount(): Int =
        chapters.size

    fun updateData(newList: List<Chapter>) {
        chapters = newList
        notifyDataSetChanged()
    }
}

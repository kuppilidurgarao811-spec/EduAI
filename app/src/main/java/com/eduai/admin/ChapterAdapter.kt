package com.eduai.admin

import android.view.LayoutInflater
import android.view.View
import android.view.ViewGroup
import android.widget.Button
import android.widget.TextView
import androidx.recyclerview.widget.RecyclerView
import com.eduai.R
import com.eduai.model.Chapter

class ChapterAdapter(
    private var chapters: List<Chapter>,
    private val onEdit: (Chapter) -> Unit,
    private val onDelete: (Chapter) -> Unit,
    private val onChapterClick: (Chapter) -> Unit
) : RecyclerView.Adapter<ChapterAdapter.ChapterViewHolder>() {

    class ChapterViewHolder(view: View) :
        RecyclerView.ViewHolder(view) {

        val title: TextView =
            view.findViewById(R.id.txtChapterTitle)

        val description: TextView =
            view.findViewById(R.id.txtChapterDescription)

        val order: TextView =
            view.findViewById(R.id.txtChapterOrder)

        val edit: Button =
            view.findViewById(R.id.btnEdit)

        val delete: Button =
            view.findViewById(R.id.btnDelete)
    }

    override fun onCreateViewHolder(
        parent: ViewGroup,
        viewType: Int
    ): ChapterViewHolder {

        val view = LayoutInflater.from(parent.context)
            .inflate(R.layout.item_chapter, parent, false)

        return ChapterViewHolder(view)
    }

    override fun onBindViewHolder(
        holder: ChapterViewHolder,
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

        holder.edit.setOnClickListener {
            onEdit(chapter)
        }

        holder.delete.setOnClickListener {
            onDelete(chapter)
        }
    }

    override fun getItemCount(): Int =
        chapters.size

    fun updateData(newList: List<Chapter>) {
        chapters = newList
        notifyDataSetChanged()
    }
}

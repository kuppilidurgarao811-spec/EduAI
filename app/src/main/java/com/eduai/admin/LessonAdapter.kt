package com.eduai.admin

import android.view.LayoutInflater
import android.view.View
import android.view.ViewGroup
import android.widget.Button
import android.widget.TextView
import androidx.recyclerview.widget.RecyclerView
import com.eduai.R
import com.eduai.model.Lesson

class LessonAdapter(
    private var lessons: List<Lesson>,
    private val onEdit: (Lesson) -> Unit,
    private val onPublish: (Lesson) -> Unit,
    private val onDisable: (Lesson) -> Unit,
    private val onUploadPdf: (Lesson) -> Unit = {},
    private val onOpenPdf: (Lesson) -> Unit = {},
    private val onWatchVideo: (Lesson) -> Unit = {},
    private val onManageQuiz: (Lesson) -> Unit = {}
) : RecyclerView.Adapter<LessonAdapter.LessonViewHolder>() {

    class LessonViewHolder(view: View) :
        RecyclerView.ViewHolder(view) {

        val title: TextView =
            view.findViewById(R.id.txtLessonTitle)

        val description: TextView =
            view.findViewById(R.id.txtLessonDescription)

        val pdfStatus: TextView =
            view.findViewById(R.id.txtPdfStatus)

        val status: TextView =
            view.findViewById(R.id.txtLessonStatus)

        val edit: Button =
            view.findViewById(R.id.btnEditLesson)

        val publish: Button =
            view.findViewById(R.id.btnPublishLesson)

        val disable: Button =
            view.findViewById(R.id.btnDisableLesson)

        val pdfButton: Button? =
            view.findViewById(R.id.btnLessonPdf)

        val watchVideo: Button =
            view.findViewById(R.id.btnWatchVideo)

        val manageQuiz: Button =
            view.findViewById(R.id.btnManageQuiz)
    }

    override fun onCreateViewHolder(
        parent: ViewGroup,
        viewType: Int
    ): LessonViewHolder {

        val view = LayoutInflater.from(parent.context)
            .inflate(
                R.layout.item_lesson,
                parent,
                false
            )

        return LessonViewHolder(view)
    }

    override fun onBindViewHolder(
        holder: LessonViewHolder,
        position: Int
    ) {

        val lesson = lessons[position]

        holder.title.text =
            "${lesson.order}. ${lesson.title}"

        holder.description.text =
            lesson.description

        if (lesson.pdfUrl.isNotEmpty()) {

            holder.pdfStatus.text =
                "📄 PDF: Uploaded"

        } else {

            holder.pdfStatus.text =
                "📄 PDF: Not uploaded"
        }

        holder.status.text =
            if (lesson.isPublished)
                "Published"
            else
                "Draft"

        holder.edit.setOnClickListener {
            onEdit(lesson)
        }

        holder.publish.setOnClickListener {
            onPublish(lesson)
        }

        holder.disable.setOnClickListener {
            onDisable(lesson)
        }

        holder.publish.isEnabled =
            !lesson.isPublished

        // Implementation 3: PDF Upload & View
        holder.pdfButton?.let { btn ->
            if (lesson.pdfUrl.isNotEmpty()) {
                btn.text = "📖 Open PDF"
                btn.setOnClickListener {
                    onOpenPdf(lesson)
                }
            } else {
                btn.text = "📄 Upload PDF"
                btn.setOnClickListener {
                    onUploadPdf(lesson)
                }
            }
        }

        // Video LMS: Watch Video preview button
        holder.watchVideo.isEnabled =
            lesson.videoUrl.isNotEmpty()

        holder.watchVideo.setOnClickListener {
            onWatchVideo(lesson)
        }

        // Quiz Management: Open QuizManagementActivity for this lesson
        holder.manageQuiz.setOnClickListener {
            onManageQuiz(lesson)
        }
    }

    override fun getItemCount(): Int =
        lessons.size

    fun updateData(newList: List<Lesson>) {

        lessons = newList

        notifyDataSetChanged()
    }
}

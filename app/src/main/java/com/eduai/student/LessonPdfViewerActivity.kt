package com.eduai.student

import android.annotation.SuppressLint
import android.content.Intent
import android.net.Uri
import android.os.Bundle
import android.view.View
import android.webkit.WebChromeClient
import android.webkit.WebView
import android.webkit.WebViewClient
import android.widget.ImageButton
import android.widget.ProgressBar
import android.widget.TextView
import android.widget.Toast
import androidx.appcompat.app.AppCompatActivity
import com.eduai.R

/**
 * EduAI Student App — Lesson PDF Viewer
 * Opens and renders lesson notes and study handbooks saved in Firebase Storage.
 */
class LessonPdfViewerActivity : AppCompatActivity() {

    private lateinit var webView: WebView
    private lateinit var progressBar: ProgressBar
    private lateinit var txtTitle: TextView
    private lateinit var btnClose: ImageButton
    private lateinit var btnExternal: ImageButton

    private var pdfUrl: String = ""
    private var lessonTitle: String = "Lesson Handbook"

    @SuppressLint("SetJavaScriptEnabled")
    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        setContentView(R.layout.activity_pdf_viewer)

        pdfUrl = intent.getStringExtra("pdfUrl") ?: ""
        lessonTitle = intent.getStringExtra("lessonTitle") ?: "Lesson Document"

        txtTitle = findViewById(R.id.txtPdfTitle)
        progressBar = findViewById(R.id.pdfProgressBar)
        webView = findViewById(R.id.pdfWebView)
        btnClose = findViewById(R.id.btnPdfClose)
        btnExternal = findViewById(R.id.btnPdfExternal)

        txtTitle.text = lessonTitle

        btnClose.setOnClickListener {
            finish()
        }

        btnExternal.setOnClickListener {
            if (pdfUrl.isNotEmpty()) {
                val intent = Intent(Intent.ACTION_VIEW, Uri.parse(pdfUrl))
                startActivity(intent)
            } else {
                Toast.makeText(this, "PDF URL is missing", Toast.LENGTH_SHORT).show()
            }
        }

        if (pdfUrl.isEmpty()) {
            Toast.makeText(this, "No PDF attached to this lesson", Toast.LENGTH_LONG).show()
            finish()
            return
        }

        setupWebView()
    }

    @SuppressLint("SetJavaScriptEnabled")
    private fun setupWebView() {
        webView.settings.javaScriptEnabled = true
        webView.settings.builtInZoomControls = true
        webView.settings.displayZoomControls = false
        webView.settings.loadWithOverviewMode = true
        webView.settings.useWideViewPort = true

        webView.webChromeClient = object : WebChromeClient() {
            override fun onProgressChanged(view: WebView?, newProgress: Int) {
                if (newProgress < 100) {
                    progressBar.visibility = View.VISIBLE
                    progressBar.progress = newProgress
                } else {
                    progressBar.visibility = View.GONE
                }
            }
        }

        webView.webViewClient = object : WebViewClient() {
            override fun onPageFinished(view: WebView?, url: String?) {
                progressBar.visibility = View.GONE
            }

            override fun onReceivedError(view: WebView?, errorCode: Int, description: String?, failingUrl: String?) {
                progressBar.visibility = View.GONE
                Toast.makeText(this@LessonPdfViewerActivity, "Unable to load PDF: $description", Toast.LENGTH_SHORT).show()
            }
        }

        // Render PDF directly using Google Docs viewer embed or native PDF stream
        val embeddedUrl = if (pdfUrl.startsWith("http")) {
            "https://docs.google.com/gview?embedded=true&url=" + Uri.encode(pdfUrl)
        } else {
            pdfUrl
        }

        webView.loadUrl(embeddedUrl)
    }
}

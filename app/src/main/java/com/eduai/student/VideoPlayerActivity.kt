package com.eduai.student

import android.os.Bundle
import android.widget.TextView
import android.widget.Toast
import androidx.appcompat.app.AppCompatActivity
import androidx.media3.common.MediaItem
import androidx.media3.common.PlaybackException
import androidx.media3.common.Player
import androidx.media3.exoplayer.ExoPlayer
import androidx.media3.ui.PlayerView
import com.eduai.R
import com.eduai.repository.VideoRepository
import com.google.firebase.auth.FirebaseAuth

class VideoPlayerActivity : AppCompatActivity() {

    private var player: ExoPlayer? = null
    private lateinit var playerView: PlayerView
    private val videoRepository = VideoRepository()

    private var lessonId = ""
    private var backendBaseUrl = ""
    private var videoUrl = ""
    private var resolvedStreamUrl = ""
    private var isResolvingStream = false
    private var playbackPosition = 0L
    private var playWhenReady = true

    private val playerListener = object : Player.Listener {
        override fun onPlayerError(error: PlaybackException) {
            Toast.makeText(
                this@VideoPlayerActivity,
                "Playback error: ${error.localizedMessage ?: "Unable to play video"}",
                Toast.LENGTH_LONG
            ).show()
        }
    }

    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)

        setContentView(R.layout.activity_video_player)

        if (savedInstanceState != null) {
            playbackPosition = savedInstanceState.getLong(KEY_PLAYBACK_POSITION, 0L)
            playWhenReady = savedInstanceState.getBoolean(KEY_PLAY_WHEN_READY, true)
        }

        lessonId = intent.getStringExtra("lessonId") ?: ""
        backendBaseUrl = intent.getStringExtra("backendBaseUrl") ?: DEFAULT_BACKEND_BASE_URL
        videoUrl = intent.getStringExtra("videoUrl") ?: ""

        val title = intent.getStringExtra("lessonTitle")
            ?: "Video Lesson"

        findViewById<TextView>(
            R.id.txtVideoTitle
        ).text = title

        playerView = findViewById(R.id.playerView)
        playerView.setShowBuffering(PlayerView.SHOW_BUFFERING_WHEN_PLAYING)

        if (videoUrl.isBlank() && lessonId.isBlank()) {
            Toast.makeText(this, "Video is not available", Toast.LENGTH_SHORT).show()
            finish()
        }
    }

    override fun onStart() {
        super.onStart()

        if (resolvedStreamUrl.isNotBlank()) {
            initializePlayer(resolvedStreamUrl)
            return
        }

        val alreadyAuthorized =
            videoUrl.contains("/api/video/stream") || videoUrl.contains("X-Goog-Signature")
        val hasSignedInUser = FirebaseAuth.getInstance().currentUser != null

        if (lessonId.isNotBlank() && backendBaseUrl.isNotBlank() && hasSignedInUser && !alreadyAuthorized) {
            if (isResolvingStream) return
            isResolvingStream = true
            videoRepository.requestAuthorizedVideoUrl(
                lessonId = lessonId,
                backendBaseUrl = backendBaseUrl,
                onSuccess = { authorizedUrl ->
                    isResolvingStream = false
                    resolvedStreamUrl = authorizedUrl
                    if (!isFinishing && !isDestroyed) {
                        initializePlayer(authorizedUrl)
                    }
                },
                onError = { error ->
                    isResolvingStream = false
                    if (error is SecurityException || videoUrl.isBlank()) {
                        Toast.makeText(
                            this,
                            error.localizedMessage ?: "Video playback unauthorized",
                            Toast.LENGTH_LONG
                        ).show()
                        finish()
                    } else if (!isFinishing && !isDestroyed) {
                        resolvedStreamUrl = videoUrl
                        initializePlayer(videoUrl)
                    }
                }
            )
            return
        }

        if (videoUrl.isNotBlank()) {
            resolvedStreamUrl = videoUrl
            initializePlayer(videoUrl)
        } else {
            Toast.makeText(this, "Sign in to stream this lesson video", Toast.LENGTH_SHORT).show()
            finish()
        }
    }

    private fun initializePlayer(streamUrl: String) {
        if (player != null) return
        player = ExoPlayer.Builder(this).build().also {
            playerView.player = it
            it.addListener(playerListener)

            it.setMediaItem(
                MediaItem.fromUri(streamUrl)
            )

            it.playWhenReady = playWhenReady
            if (playbackPosition > 0L) {
                it.seekTo(playbackPosition)
            }
            it.prepare()
        }
    }

    override fun onSaveInstanceState(outState: Bundle) {
        super.onSaveInstanceState(outState)
        player?.let {
            playbackPosition = it.currentPosition
            playWhenReady = it.playWhenReady
        }
        outState.putLong(KEY_PLAYBACK_POSITION, playbackPosition)
        outState.putBoolean(KEY_PLAY_WHEN_READY, playWhenReady)
    }

    override fun onStop() {
        player?.let {
            playbackPosition = it.currentPosition
            playWhenReady = it.playWhenReady
            it.removeListener(playerListener)
        }
        playerView.player = null
        player?.release()
        player = null

        super.onStop()
    }

    companion object {
        private const val DEFAULT_BACKEND_BASE_URL =
            "https://ais-dev-sc3isu754flmt7x7g6jcys-485642152592.asia-east1.run.app"
        private const val KEY_PLAYBACK_POSITION = "playback_position"
        private const val KEY_PLAY_WHEN_READY = "play_when_ready"
    }
}

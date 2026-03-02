package com.betaalai.app

import android.app.Service
import android.content.Intent
import android.graphics.Color
import android.graphics.PixelFormat
import android.os.IBinder
import android.util.Log
import android.view.Gravity
import android.view.WindowManager
import android.widget.FrameLayout
import android.widget.TextView

class OverlayService : Service() {

    companion object {
        const val TAG = "OverlayService"
    }

    private var windowManager: WindowManager? = null
    private var overlayView: FrameLayout? = null

    override fun onStartCommand(intent: Intent?, flags: Int, startId: Int): Int {
        val type = intent?.getStringExtra("type") ?: "black"
        val message = intent?.getStringExtra("message") ?: "Take a break!"
        val intensity = intent?.getFloatExtra("intensity", 1.0f) ?: 1.0f

        removeOverlay()
        showOverlay(type, message, intensity)

        return START_NOT_STICKY
    }

    private fun showOverlay(type: String, message: String, intensity: Float) {
        windowManager = getSystemService(WINDOW_SERVICE) as WindowManager

        val params = WindowManager.LayoutParams(
            WindowManager.LayoutParams.MATCH_PARENT,
            WindowManager.LayoutParams.MATCH_PARENT,
            WindowManager.LayoutParams.TYPE_APPLICATION_OVERLAY,
            WindowManager.LayoutParams.FLAG_NOT_FOCUSABLE or
                    WindowManager.LayoutParams.FLAG_NOT_TOUCH_MODAL or
                    WindowManager.LayoutParams.FLAG_LAYOUT_IN_SCREEN,
            PixelFormat.TRANSLUCENT
        )

        overlayView = FrameLayout(this).apply {
            when (type) {
                "black" -> {
                    val alpha = (intensity * 255).toInt().coerceIn(0, 255)
                    setBackgroundColor(Color.argb(alpha, 0, 0, 0))
                }
                "blur" -> {
                    // Semi-transparent dark overlay to simulate blur
                    val alpha = (intensity * 200).toInt().coerceIn(0, 200)
                    setBackgroundColor(Color.argb(alpha, 30, 30, 30))
                }
                "warning" -> {
                    val alpha = (intensity * 180).toInt().coerceIn(0, 180)
                    setBackgroundColor(Color.argb(alpha, 50, 0, 0))
                }
                else -> {
                    setBackgroundColor(Color.argb(230, 0, 0, 0))
                }
            }

            // Add message text
            val textView = TextView(this@OverlayService).apply {
                text = message
                setTextColor(Color.WHITE)
                textSize = 24f
                gravity = Gravity.CENTER
                setPadding(48, 48, 48, 48)
            }

            val textParams = FrameLayout.LayoutParams(
                FrameLayout.LayoutParams.WRAP_CONTENT,
                FrameLayout.LayoutParams.WRAP_CONTENT,
                Gravity.CENTER
            )
            addView(textView, textParams)
        }

        try {
            windowManager?.addView(overlayView, params)
            Log.d(TAG, "Overlay shown: type=$type, intensity=$intensity")
        } catch (e: Exception) {
            Log.e(TAG, "Failed to show overlay: ${e.message}")
        }
    }

    private fun removeOverlay() {
        try {
            overlayView?.let {
                windowManager?.removeView(it)
                overlayView = null
            }
        } catch (e: Exception) {
            Log.e(TAG, "Failed to remove overlay: ${e.message}")
        }
    }

    override fun onDestroy() {
        removeOverlay()
        super.onDestroy()
    }

    override fun onBind(intent: Intent?): IBinder? = null
}

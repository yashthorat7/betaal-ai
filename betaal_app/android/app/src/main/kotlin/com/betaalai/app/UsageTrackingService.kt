package com.betaalai.app

import android.app.Notification
import android.app.NotificationChannel
import android.app.NotificationManager
import android.app.Service
import android.content.Intent
import android.os.Handler
import android.os.IBinder
import android.os.Looper
import android.util.Log
import androidx.core.app.NotificationCompat

class UsageTrackingService : Service() {

    companion object {
        const val TAG = "UsageTrackingService"
        const val CHANNEL_ID = "betaal_tracking"
        const val NOTIFICATION_ID = 1001
        const val POLL_INTERVAL_MS = 5000L // 5 seconds
    }

    private val handler = Handler(Looper.getMainLooper())
    private lateinit var trackingHelper: UsageTrackingHelper

    private val pollRunnable = object : Runnable {
        override fun run() {
            try {
                val foregroundApp = trackingHelper.getForegroundApp()
                val screenTime = trackingHelper.getTodayScreenTime()
                Log.d(TAG, "Foreground: $foregroundApp | Today: ${screenTime}min")
            } catch (e: Exception) {
                Log.e(TAG, "Polling error: ${e.message}")
            }
            handler.postDelayed(this, POLL_INTERVAL_MS)
        }
    }

    override fun onCreate() {
        super.onCreate()
        trackingHelper = UsageTrackingHelper(this)
        createNotificationChannel()
    }

    override fun onStartCommand(intent: Intent?, flags: Int, startId: Int): Int {
        val notification = buildNotification()
        startForeground(NOTIFICATION_ID, notification)
        handler.post(pollRunnable)
        Log.d(TAG, "Usage tracking started")
        return START_STICKY
    }

    override fun onDestroy() {
        handler.removeCallbacks(pollRunnable)
        Log.d(TAG, "Usage tracking stopped")
        super.onDestroy()
    }

    override fun onBind(intent: Intent?): IBinder? = null

    private fun createNotificationChannel() {
        val channel = NotificationChannel(
            CHANNEL_ID,
            "Betaal Usage Tracking",
            NotificationManager.IMPORTANCE_LOW
        ).apply {
            description = "Monitors your screen time in the background"
            setShowBadge(false)
        }
        val manager = getSystemService(NotificationManager::class.java)
        manager.createNotificationChannel(channel)
    }

    private fun buildNotification(): Notification {
        return NotificationCompat.Builder(this, CHANNEL_ID)
            .setContentTitle("Betaal AI")
            .setContentText("Monitoring your screen time")
            .setSmallIcon(android.R.drawable.ic_menu_info_details)
            .setOngoing(true)
            .setPriority(NotificationCompat.PRIORITY_LOW)
            .build()
    }
}

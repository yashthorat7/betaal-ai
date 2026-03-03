package com.betaalai.app

import android.app.Notification
import android.app.NotificationChannel
import android.app.NotificationManager
import android.app.Service
import android.content.Context
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
        const val COOLDOWN_MS = 10 * 60 * 1000L // 10 minutes
        const val FLUTTER_PREFS = "FlutterSharedPreferences"
        const val KEY_PREFIX = "flutter."

        // Mild types — used when <10% over quota
        val MILD_TYPES = setOf(
            "blur_screen", "tint", "grayscale", "timer_overlay",
            "status_bar", "progressive_dim", "brightness_zero"
        )

        // Heavy types excluded from medium tier (10-30% over)
        val HEAVY_TYPES = setOf(
            "lock_screen", "quiz_gate", "earthquake", "close_app",
            "black_screen", "screen_shake", "force_rotate"
        )
    }

    private val handler = Handler(Looper.getMainLooper())
    private lateinit var trackingHelper: UsageTrackingHelper
    private var overlayActive = false

    private val pollRunnable = object : Runnable {
        override fun run() {
            try {
                pollAndDecide()
            } catch (e: Exception) {
                Log.e(TAG, "Polling error: ${e.message}")
            }
            handler.postDelayed(this, POLL_INTERVAL_MS)
        }
    }

    private fun pollAndDecide() {
        val prefs = getSharedPreferences(FLUTTER_PREFS, Context.MODE_PRIVATE)

        // Read engine config
        val quotaMin = prefs.getLong("${KEY_PREFIX}daily_quota_min", 378L).toInt()
        val targetApps = prefs.getStringSet("${KEY_PREFIX}target_apps", emptySet()) ?: emptySet()
        val lastTriggerMs = prefs.getLong("${KEY_PREFIX}last_trigger_time_ms", 0L)

        // Read current state
        val foregroundApp = trackingHelper.getForegroundApp()
        val screenTime = trackingHelper.getTodayScreenTime()

        Log.d(TAG, "Foreground: $foregroundApp | Today: ${screenTime}min | Quota: ${quotaMin}min")

        val isTargetApp = targetApps.contains(foregroundApp)

        // If user left target app → stop overlay
        if (!isTargetApp && overlayActive) {
            stopOverlay()
            return
        }

        // Check trigger conditions
        if (!isTargetApp) return
        if (screenTime < quotaMin) return

        // Cooldown check
        val now = System.currentTimeMillis()
        if (now - lastTriggerMs < COOLDOWN_MS) {
            Log.d(TAG, "Cooldown active, skipping trigger")
            return
        }

        // Already showing overlay
        if (overlayActive) return

        // Determine intensity based on overage ratio
        val overage = screenTime - quotaMin
        val overageRatio = if (quotaMin > 0) overage.toDouble() / quotaMin else 1.0

        // Read enabled types from prefs
        val enabledTypes = readEnabledTypes(prefs)
        if (enabledTypes.isEmpty()) {
            Log.d(TAG, "No interruption types enabled, skipping")
            return
        }

        // Filter by intensity
        val allowedTypes = when {
            overageRatio < 0.10 -> enabledTypes.filter { MILD_TYPES.contains(it) }
            overageRatio < 0.30 -> enabledTypes.filter { !HEAVY_TYPES.contains(it) }
            else -> enabledTypes
        }

        if (allowedTypes.isEmpty()) {
            Log.d(TAG, "No types available at current intensity level")
            return
        }

        // Fire overlay
        Log.d(TAG, "TRIGGER: ${allowedTypes.size} types, overage=${overage}min (${(overageRatio * 100).toInt()}%)")

        val intent = Intent(this, OverlayService::class.java).apply {
            action = OverlayService.ACTION_START_CYCLE
            putStringArrayListExtra("types", ArrayList(allowedTypes))
        }
        startForegroundService(intent)
        overlayActive = true

        // Save trigger time
        prefs.edit().putLong("${KEY_PREFIX}last_trigger_time_ms", now).apply()
    }

    private fun stopOverlay() {
        Log.d(TAG, "User left target app, stopping overlay")
        val intent = Intent(this, OverlayService::class.java).apply {
            action = OverlayService.ACTION_STOP_ALL
        }
        startService(intent)
        overlayActive = false
    }

    private fun readEnabledTypes(prefs: android.content.SharedPreferences): List<String> {
        val types = mutableListOf<String>()
        val allTypes = listOf(
            "black_screen", "blur_screen", "warning", "loading", "tint",
            "half_block", "mistouch", "fly", "status_bar", "brightness_zero",
            "lock_screen", "flicker", "grayscale", "invert_colors", "pixel_rain",
            "static_noise", "delayed_touch", "swapped_touch", "vibrate_pulse",
            "timer_overlay", "shame_counter", "quiz_gate", "force_rotate",
            "volume_zero", "close_app", "screen_shake", "progressive_dim",
            "glitch_effect", "screen_shrink", "random_popup", "earthquake"
        )
        for (type in allTypes) {
            // Flutter stores booleans as booleans in SharedPreferences
            val enabled = prefs.getBoolean("${KEY_PREFIX}interruption_$type", true)
            if (enabled) types.add(type)
        }
        return types
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
        if (overlayActive) stopOverlay()
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

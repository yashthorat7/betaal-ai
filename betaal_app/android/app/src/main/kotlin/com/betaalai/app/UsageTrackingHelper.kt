package com.betaalai.app

import android.app.Activity
import android.app.AppOpsManager
import android.app.usage.UsageEvents
import android.app.usage.UsageStatsManager
import android.content.Context
import android.content.Intent
import android.os.Process
import android.provider.Settings

class UsageTrackingHelper(private val context: Context) {

    private val usageStatsManager: UsageStatsManager
        get() = context.getSystemService(Context.USAGE_STATS_SERVICE) as UsageStatsManager

    fun hasUsagePermission(): Boolean {
        val appOps = context.getSystemService(Context.APP_OPS_SERVICE) as AppOpsManager
        val mode = appOps.unsafeCheckOpNoThrow(
            AppOpsManager.OPSTR_GET_USAGE_STATS,
            Process.myUid(),
            context.packageName
        )
        return mode == AppOpsManager.MODE_ALLOWED
    }

    fun requestUsagePermission(activity: Activity) {
        val intent = Intent(Settings.ACTION_USAGE_ACCESS_SETTINGS)
        activity.startActivity(intent)
    }

    fun getForegroundApp(): String {
        val endTime = System.currentTimeMillis()
        val startTime = endTime - 10_000 // last 10 seconds

        val usageEvents = usageStatsManager.queryEvents(startTime, endTime)
        val event = UsageEvents.Event()
        var lastApp = ""

        while (usageEvents.hasNextEvent()) {
            usageEvents.getNextEvent(event)
            if (event.eventType == UsageEvents.Event.ACTIVITY_RESUMED) {
                lastApp = event.packageName
            }
        }

        return lastApp
    }

    /**
     * Compute today's total screen time by walking UsageEvents from midnight.
     * Tracks ACTIVITY_RESUMED → ACTIVITY_PAUSED/STOPPED per package, then sums.
     */
    fun getTodayScreenTime(): Long {
        val perApp = computeTodayPerAppMs()
        val totalMs = perApp.values.sum()
        return totalMs / 1000 / 60 // minutes
    }

    /**
     * Count today's screen unlocks using KEYGUARD_HIDDEN events.
     */
    fun getTodayUnlocks(): Int {
        val midnight = java.util.Calendar.getInstance().apply {
            set(java.util.Calendar.HOUR_OF_DAY, 0)
            set(java.util.Calendar.MINUTE, 0)
            set(java.util.Calendar.SECOND, 0)
            set(java.util.Calendar.MILLISECOND, 0)
        }.timeInMillis
        val now = System.currentTimeMillis()

        val events = usageStatsManager.queryEvents(midnight, now)
        val event = UsageEvents.Event()
        var unlocks = 0

        while (events.hasNextEvent()) {
            events.getNextEvent(event)
            // KEYGUARD_HIDDEN = 18 (screen unlock)
            if (event.eventType == 18) {
                unlocks++
            }
        }
        return unlocks
    }

    /**
     * Get per-app usage in minutes for today.
     */
    fun getTodayAppUsage(): Map<String, Long> {
        val perAppMs = computeTodayPerAppMs()
        val result = mutableMapOf<String, Long>()
        for ((pkg, ms) in perAppMs) {
            val minutes = ms / 1000 / 60
            if (minutes > 0) {
                result[pkg] = minutes
            }
        }
        return result
    }

    /**
     * Walk UsageEvents from midnight to now, computing per-package foreground ms.
     */
    private fun computeTodayPerAppMs(): Map<String, Long> {
        val midnight = java.util.Calendar.getInstance().apply {
            set(java.util.Calendar.HOUR_OF_DAY, 0)
            set(java.util.Calendar.MINUTE, 0)
            set(java.util.Calendar.SECOND, 0)
            set(java.util.Calendar.MILLISECOND, 0)
        }.timeInMillis
        val now = System.currentTimeMillis()

        val events = usageStatsManager.queryEvents(midnight, now)
        val event = UsageEvents.Event()

        // Track when each package was last resumed
        val resumedAt = mutableMapOf<String, Long>()
        val totalMs = mutableMapOf<String, Long>()

        while (events.hasNextEvent()) {
            events.getNextEvent(event)
            val pkg = event.packageName
            val time = event.timeStamp

            when (event.eventType) {
                UsageEvents.Event.ACTIVITY_RESUMED -> {
                    resumedAt[pkg] = time
                }
                UsageEvents.Event.ACTIVITY_PAUSED,
                UsageEvents.Event.ACTIVITY_STOPPED -> {
                    val start = resumedAt.remove(pkg)
                    if (start != null && time > start) {
                        totalMs[pkg] = (totalMs[pkg] ?: 0L) + (time - start)
                    }
                }
            }
        }

        // If an app is still in foreground (resumed but not paused yet), count up to now
        for ((pkg, start) in resumedAt) {
            if (now > start) {
                totalMs[pkg] = (totalMs[pkg] ?: 0L) + (now - start)
            }
        }

        return totalMs
    }
}

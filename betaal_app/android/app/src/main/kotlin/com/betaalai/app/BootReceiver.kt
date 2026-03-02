package com.betaalai.app

import android.content.BroadcastReceiver
import android.content.Context
import android.content.Intent
import android.util.Log

class BootReceiver : BroadcastReceiver() {

    companion object {
        const val TAG = "BootReceiver"
    }

    override fun onReceive(context: Context, intent: Intent) {
        if (intent.action == Intent.ACTION_BOOT_COMPLETED) {
            Log.d(TAG, "Device booted — restarting UsageTrackingService")
            val serviceIntent = Intent(context, UsageTrackingService::class.java)
            context.startForegroundService(serviceIntent)
        }
    }
}

package com.betaalai.app

import android.content.Intent
import android.os.Bundle
import io.flutter.embedding.android.FlutterActivity
import io.flutter.embedding.engine.FlutterEngine
import io.flutter.plugin.common.MethodChannel

class MainActivity : FlutterActivity() {

    companion object {
        const val USAGE_CHANNEL = "com.betaalai.app/usage"
        const val OVERLAY_CHANNEL = "com.betaalai.app/overlay"
        const val STEALTH_CHANNEL = "com.betaalai.app/stealth"
    }

    override fun configureFlutterEngine(flutterEngine: FlutterEngine) {
        super.configureFlutterEngine(flutterEngine)

        // Usage Tracking Channel
        MethodChannel(flutterEngine.dartExecutor.binaryMessenger, USAGE_CHANNEL).setMethodCallHandler { call, result ->
            when (call.method) {
                "startTracking" -> {
                    val intent = Intent(this, UsageTrackingService::class.java)
                    startForegroundService(intent)
                    result.success(true)
                }
                "stopTracking" -> {
                    val intent = Intent(this, UsageTrackingService::class.java)
                    stopService(intent)
                    result.success(true)
                }
                "getForegroundApp" -> {
                    val tracker = UsageTrackingHelper(this)
                    result.success(tracker.getForegroundApp())
                }
                "getTodayScreenTime" -> {
                    val tracker = UsageTrackingHelper(this)
                    result.success(tracker.getTodayScreenTime())
                }
                "getTodayAppUsage" -> {
                    val tracker = UsageTrackingHelper(this)
                    result.success(tracker.getTodayAppUsage())
                }
                "hasUsagePermission" -> {
                    val tracker = UsageTrackingHelper(this)
                    result.success(tracker.hasUsagePermission())
                }
                "requestUsagePermission" -> {
                    val tracker = UsageTrackingHelper(this)
                    tracker.requestUsagePermission(this)
                    result.success(true)
                }
                else -> result.notImplemented()
            }
        }

        // Overlay Channel
        MethodChannel(flutterEngine.dartExecutor.binaryMessenger, OVERLAY_CHANNEL).setMethodCallHandler { call, result ->
            when (call.method) {
                "showOverlay" -> {
                    val type = call.argument<String>("type") ?: "black"
                    val message = call.argument<String>("message") ?: ""
                    val intensity = call.argument<Double>("intensity") ?: 1.0
                    val intent = Intent(this, OverlayService::class.java).apply {
                        putExtra("type", type)
                        putExtra("message", message)
                        putExtra("intensity", intensity.toFloat())
                    }
                    startService(intent)
                    result.success(true)
                }
                "hideOverlay" -> {
                    val intent = Intent(this, OverlayService::class.java)
                    stopService(intent)
                    result.success(true)
                }
                "hasOverlayPermission" -> {
                    result.success(android.provider.Settings.canDrawOverlays(this))
                }
                "requestOverlayPermission" -> {
                    val intent = Intent(
                        android.provider.Settings.ACTION_MANAGE_OVERLAY_PERMISSION,
                        android.net.Uri.parse("package:$packageName")
                    )
                    startActivity(intent)
                    result.success(true)
                }
                else -> result.notImplemented()
            }
        }

        // Stealth Channel
        MethodChannel(flutterEngine.dartExecutor.binaryMessenger, STEALTH_CHANNEL).setMethodCallHandler { call, result ->
            when (call.method) {
                "setStealthMode" -> {
                    val mode = call.argument<String>("mode") ?: "default"
                    val stealthHelper = StealthHelper(this)
                    stealthHelper.setStealthMode(mode)
                    result.success(true)
                }
                "getCurrentMode" -> {
                    val stealthHelper = StealthHelper(this)
                    result.success(stealthHelper.getCurrentMode())
                }
                else -> result.notImplemented()
            }
        }
    }
}

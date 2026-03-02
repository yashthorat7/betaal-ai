package com.betaalai.app

import android.content.ComponentName
import android.content.Context
import android.content.pm.PackageManager
import android.util.Log

class StealthHelper(private val context: Context) {

    companion object {
        const val TAG = "StealthHelper"

        private val ALIASES = mapOf(
            "default" to ".MainActivity",
            "calculator" to ".CalculatorAlias",
            "notes" to ".NotesAlias",
            "weather" to ".WeatherAlias"
        )
    }

    fun setStealthMode(mode: String) {
        val packageManager = context.packageManager
        val packageName = context.packageName

        // Disable all aliases and main activity launcher
        ALIASES.forEach { (_, className) ->
            val component = ComponentName(packageName, "$packageName$className")
            packageManager.setComponentEnabledSetting(
                component,
                PackageManager.COMPONENT_ENABLED_STATE_DISABLED,
                PackageManager.DONT_KILL_APP
            )
        }

        // Enable the selected one
        val targetClass = ALIASES[mode] ?: ALIASES["default"]!!
        val component = ComponentName(packageName, "$packageName$targetClass")
        packageManager.setComponentEnabledSetting(
            component,
            PackageManager.COMPONENT_ENABLED_STATE_ENABLED,
            PackageManager.DONT_KILL_APP
        )

        Log.d(TAG, "Stealth mode set to: $mode ($targetClass)")
    }

    fun getCurrentMode(): String {
        val packageManager = context.packageManager
        val packageName = context.packageName

        ALIASES.forEach { (mode, className) ->
            val component = ComponentName(packageName, "$packageName$className")
            val state = packageManager.getComponentEnabledSetting(component)
            if (state == PackageManager.COMPONENT_ENABLED_STATE_ENABLED ||
                (state == PackageManager.COMPONENT_ENABLED_STATE_DEFAULT && mode == "default")) {
                return mode
            }
        }

        return "default"
    }
}

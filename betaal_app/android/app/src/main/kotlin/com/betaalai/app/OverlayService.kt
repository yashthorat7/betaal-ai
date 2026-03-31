package com.betaalai.app

import android.annotation.SuppressLint
import android.app.Notification
import android.app.NotificationChannel
import android.app.NotificationManager
import android.app.PendingIntent
import android.app.Service
import android.content.Context
import android.content.Intent
import android.graphics.Bitmap
import android.graphics.Canvas
import android.graphics.Color
import android.graphics.Paint
import android.graphics.PixelFormat
import android.media.AudioManager
import android.os.Build
import android.os.Handler
import android.os.IBinder
import android.os.Looper
import android.os.VibrationEffect
import android.os.Vibrator
import android.os.VibratorManager
import android.provider.Settings
import android.util.Log
import android.util.TypedValue
import android.view.Gravity
import android.view.View
import android.view.WindowManager
import android.widget.Button
import android.widget.EditText
import android.widget.FrameLayout
import android.widget.ImageView
import android.widget.LinearLayout
import android.widget.ProgressBar
import android.widget.TextView
import androidx.core.app.NotificationCompat
import java.util.Random

class OverlayService : Service() {

    companion object {
        const val TAG = "OverlayService"
        const val ACTION_SHOW = "ACTION_SHOW"
        const val ACTION_HIDE = "ACTION_HIDE"
        const val ACTION_START_CYCLE = "ACTION_START_CYCLE"
        const val ACTION_STOP_ALL = "ACTION_STOP_ALL"
    }

    private var windowManager: WindowManager? = null
    private val mainHandler = Handler(Looper.getMainLooper())
    private val random = Random()

    // --- VIEWS (existing 12) ---
    private var blackView: View? = null
    private var blurView: View? = null
    private var warningView: View? = null
    private var loadingBgView: View? = null
    private var loadingSpinner: ProgressBar? = null
    private var tintView: View? = null
    private var halfBlockView: View? = null
    private var flyView: View? = null
    private var statusBarView: View? = null
    private var flickerView: View? = null
    private val mistouchViews = ArrayList<View>()

    // --- VIEWS (new 14) ---
    private var pixelRainView: ImageView? = null
    private var staticNoiseView: ImageView? = null
    private var delayedTouchView: View? = null
    private var timerOverlayView: TextView? = null
    private var shameCounterView: TextView? = null
    private var quizGateView: FrameLayout? = null
    private val swappedTouchViews = ArrayList<View>()

    // --- VIEWS (intense modes) ---
    private var shakeView: View? = null
    private var dimView: View? = null
    private var glitchView: ImageView? = null
    private val shrinkViews = ArrayList<View>() // 4 border views
    private val popupViews = ArrayList<View>()
    private var earthquakeView: View? = null

    // --- FLAGS ---
    private var isCycleActive = false
    private var isMistouchActive = false
    private var isFlickerActive = false
    private var isPixelRainActive = false
    private var isStaticNoiseActive = false
    private var isDelayedTouchActive = false
    private var isSwappedTouchActive = false
    private var isTimerActive = false
    private var isVibrateActive = false
    private var isGrayscaleApplied = false
    private var isInvertApplied = false
    private var isForceRotateApplied = false
    private var isVolumeMuted = false
    private var savedVolumes: IntArray? = null
    private var isShakeActive = false
    private var isDimActive = false
    private var isGlitchActive = false
    private var isPopupActive = false
    private var isEarthquakeActive = false

    // --- CYCLE ---
    private var activeDisturbances = ArrayList<String>()
    private var currentIndex = 0
    private var timerStartMs = 0L

    override fun onBind(intent: Intent?): IBinder? = null

    @SuppressLint("ForegroundServiceType")
    override fun onCreate() {
        super.onCreate()
        windowManager = getSystemService(Context.WINDOW_SERVICE) as WindowManager
        startForeground(999, createNotification())
    }

    override fun onStartCommand(intent: Intent?, flags: Int, startId: Int): Int {
        when (intent?.action) {
            ACTION_STOP_ALL -> stopAll()
            ACTION_HIDE -> clearViews()
            ACTION_SHOW -> {
                val type = intent.getStringExtra("type") ?: "black_screen"
                clearViews()
                activateMode(type)
            }
            ACTION_START_CYCLE -> {
                val types = intent.getStringArrayListExtra("types") ?: arrayListOf()
                if (types.isNotEmpty()) {
                    activeDisturbances.clear()
                    activeDisturbances.addAll(types)
                    startCycle()
                }
            }
        }
        return START_STICKY
    }

    // ==================== CYCLE ====================

    private fun startCycle() {
        stopCycle(keepServiceAlive = true)
        isCycleActive = true
        currentIndex = 0
        runCycleStep()
    }

    private fun stopCycle(keepServiceAlive: Boolean = false) {
        isCycleActive = false
        mainHandler.removeCallbacksAndMessages(null)
        clearViews()
        if (!keepServiceAlive) {
            stopForeground(true)
            stopSelf()
        }
    }

    private fun runCycleStep() {
        if (!isCycleActive || activeDisturbances.isEmpty()) return
        clearViews()
        val mode = activeDisturbances[currentIndex]
        activateMode(mode)
        // In debug mode, show each overlay for 6s with 10s gap between them
        val prefs = getSharedPreferences("FlutterSharedPreferences", Context.MODE_PRIVATE)
        val debugMode = prefs.getBoolean("flutter.debug_mode", false)
        val duration = if (activeDisturbances.size == 1) {
            120_000L
        } else if (debugMode) {
            6_000L // overlay visible time in debug; gap is added after clearViews
        } else {
            6_000L
        }
        currentIndex = (currentIndex + 1) % activeDisturbances.size
        mainHandler.postDelayed({
            if (isCycleActive) {
                if (debugMode && activeDisturbances.size > 1) {
                    // Clear the current overlay, then wait 10s before next
                    clearViews()
                    mainHandler.postDelayed({
                        if (isCycleActive) runCycleStep()
                    }, 10_000L)
                    return@postDelayed
                }
                runCycleStep()
            }
        }, duration)
    }

    // ==================== MODE DISPATCHER ====================

    private fun activateMode(mode: String) {
        Log.d(TAG, "Activating mode: $mode")
        when (mode) {
            // Original 12
            "black_screen" -> showBlackScreen()
            "blur_screen" -> showBlurScreen()
            "warning" -> showWarning()
            "loading" -> showLoading()
            "tint" -> showTint()
            "half_block" -> showHalfBlock()
            "mistouch" -> startMistouch()
            "fly" -> startFly()
            "status_bar" -> showStatusBar()
            "brightness_zero" -> setBrightness(0)
            "lock_screen" -> triggerLockScreen()
            "flicker" -> startFlicker()
            // New 14
            "grayscale" -> enableGrayscale()
            "invert_colors" -> enableInvertColors()
            "pixel_rain" -> startPixelRain()
            "static_noise" -> startStaticNoise()
            "delayed_touch" -> startDelayedTouch()
            "swapped_touch" -> startSwappedTouch()
            "vibrate_pulse" -> startVibratePulse()
            "timer_overlay" -> showTimerOverlay()
            "shame_counter" -> showShameCounter()
            "quiz_gate" -> showQuizGate()
            "force_rotate" -> enableForceRotate()
            "volume_zero" -> muteVolume()
            "close_app" -> closeApp()
            // Intense modes
            "screen_shake" -> startScreenShake()
            "progressive_dim" -> startProgressiveDim()
            "glitch_effect" -> startGlitchEffect()
            "screen_shrink" -> startScreenShrink()
            "random_popup" -> startRandomPopup()
            "earthquake" -> startEarthquake()
        }
    }

    // ==================== ORIGINAL 12 MODES ====================

    // --- 1. BLACK SCREEN ---
    private fun showBlackScreen() {
        blackView = View(this).apply {
            setBackgroundColor(Color.BLACK)
            setOnTouchListener { _, _ -> true }
        }
        val params = createParams(
            WindowManager.LayoutParams.MATCH_PARENT,
            WindowManager.LayoutParams.MATCH_PARENT
        )
        params.format = PixelFormat.OPAQUE
        addToWindow(blackView, params)
    }

    // --- 2. BLUR SCREEN ---
    private fun showBlurScreen() {
        blurView = View(this).apply {
            setBackgroundColor(Color.argb(180, 30, 30, 30))
            setOnTouchListener { _, _ -> true }
        }
        addToWindow(blurView, createParams(
            WindowManager.LayoutParams.MATCH_PARENT,
            WindowManager.LayoutParams.MATCH_PARENT
        ))
    }

    // --- 3. WARNING ---
    private fun showWarning() {
        warningView = View(this).apply {
            setBackgroundColor(Color.argb(180, 180, 0, 0))
            setOnTouchListener { _, _ -> true }
        }
        addToWindow(warningView, createParams(
            WindowManager.LayoutParams.MATCH_PARENT,
            WindowManager.LayoutParams.MATCH_PARENT
        ))
    }

    // --- 4. LOADING ---
    private fun showLoading() {
        loadingBgView = View(this).apply {
            setBackgroundColor(Color.argb(150, 0, 0, 0))
            setOnTouchListener { _, _ -> true }
        }
        addToWindow(loadingBgView, createParams(
            WindowManager.LayoutParams.MATCH_PARENT,
            WindowManager.LayoutParams.MATCH_PARENT
        ))
        loadingSpinner = ProgressBar(this)
        addToWindow(loadingSpinner, createParams(200, 200).apply { gravity = Gravity.CENTER })
    }

    // --- 5. TINT ---
    private fun showTint() {
        tintView = View(this).apply {
            setBackgroundColor(Color.argb(150, 100, 120, 0))
        }
        val params = createParams(
            WindowManager.LayoutParams.MATCH_PARENT,
            WindowManager.LayoutParams.MATCH_PARENT
        )
        params.flags = params.flags or WindowManager.LayoutParams.FLAG_NOT_TOUCHABLE
        addToWindow(tintView, params)
    }

    // --- 6. HALF BLOCK ---
    private fun showHalfBlock() {
        halfBlockView = View(this).apply {
            setBackgroundColor(Color.argb(50, 255, 0, 0))
            setOnTouchListener { _, _ -> true }
        }
        val h = resources.displayMetrics.heightPixels
        val params = createParams(WindowManager.LayoutParams.MATCH_PARENT, h / 2)
        params.gravity = Gravity.BOTTOM
        addToWindow(halfBlockView, params)
    }

    // --- 7. MISTOUCH ---
    private fun startMistouch() {
        isMistouchActive = true
        val w = resources.displayMetrics.widthPixels
        val h = resources.displayMetrics.heightPixels
        for (i in 0 until 40) {
            val v = View(this).apply {
                setBackgroundColor(Color.TRANSPARENT)
                setOnTouchListener { _, _ -> true }
            }
            val size = random.nextInt(100) + 100
            val params = createParams(size, size)
            params.gravity = Gravity.TOP or Gravity.START
            params.x = random.nextInt((w - size).coerceAtLeast(1))
            params.y = random.nextInt((h - size).coerceAtLeast(1))
            addToWindow(v, params)
            mistouchViews.add(v)
        }
        mainHandler.post(mistouchRunnable)
    }

    private val mistouchRunnable = object : Runnable {
        override fun run() {
            if (!isMistouchActive || mistouchViews.isEmpty()) return
            val w = resources.displayMetrics.widthPixels
            val h = resources.displayMetrics.heightPixels
            for (view in mistouchViews) {
                try {
                    val params = view.layoutParams as WindowManager.LayoutParams
                    params.x = random.nextInt((w - 150).coerceAtLeast(1))
                    params.y = random.nextInt((h - 150).coerceAtLeast(1))
                    windowManager?.updateViewLayout(view, params)
                } catch (_: Exception) {}
            }
            mainHandler.postDelayed(this, 1500)
        }
    }

    // --- 8. FLY ---
    private fun startFly() {
        flyView = View(this).apply {
            setBackgroundResource(android.R.drawable.btn_radio)
            background.setTint(Color.BLACK)
            setOnTouchListener { _, _ -> true }
        }
        val params = createParams(80, 80)
        params.gravity = Gravity.TOP or Gravity.START
        addToWindow(flyView, params)
        mainHandler.post(flyRunnable)
    }

    private val flyRunnable = object : Runnable {
        override fun run() {
            if (flyView == null) return
            try {
                val p = flyView?.layoutParams as WindowManager.LayoutParams
                p.x = random.nextInt(resources.displayMetrics.widthPixels)
                p.y = random.nextInt(resources.displayMetrics.heightPixels)
                windowManager?.updateViewLayout(flyView, p)
            } catch (_: Exception) {}
            mainHandler.postDelayed(this, 500)
        }
    }

    // --- 9. STATUS BAR ---
    private fun showStatusBar() {
        statusBarView = View(this).apply { setBackgroundColor(Color.BLACK) }
        val params = createParams(WindowManager.LayoutParams.MATCH_PARENT, 150)
        params.gravity = Gravity.TOP
        params.format = PixelFormat.OPAQUE
        addToWindow(statusBarView, params)
    }

    // --- 10. BRIGHTNESS ZERO ---
    private fun setBrightness(value: Int) {
        if (Settings.System.canWrite(this)) {
            try {
                Settings.System.putInt(contentResolver, Settings.System.SCREEN_BRIGHTNESS_MODE, Settings.System.SCREEN_BRIGHTNESS_MODE_MANUAL)
                Settings.System.putInt(contentResolver, Settings.System.SCREEN_BRIGHTNESS, value)
            } catch (e: Exception) { Log.e(TAG, "Brightness fail: ${e.message}") }
        }
    }

    private fun restoreBrightness() {
        if (Settings.System.canWrite(this)) {
            try { Settings.System.putInt(contentResolver, Settings.System.SCREEN_BRIGHTNESS, 150) } catch (_: Exception) {}
        }
    }

    // --- 11. LOCK SCREEN ---
    // Uses DevicePolicyManager to actually lock the device.
    // Requires Device Admin permission (user grants via system dialog).
    private fun triggerLockScreen() {
        try {
            val dpm = getSystemService(Context.DEVICE_POLICY_SERVICE) as android.app.admin.DevicePolicyManager
            val adminComponent = android.content.ComponentName(this, BetaalDeviceAdmin::class.java)
            if (dpm.isAdminActive(adminComponent)) {
                dpm.lockNow()
                Log.d(TAG, "Device locked via DevicePolicyManager")
            } else {
                Log.w(TAG, "Device Admin not active — cannot lock screen")
            }
        } catch (e: Exception) {
            Log.e(TAG, "Lock fail: ${e.message}")
        }
    }

    // --- 12. FLICKER ---
    private fun startFlicker() {
        isFlickerActive = true
        flickerView = View(this).apply { setBackgroundColor(Color.BLACK) }
        val params = createParams(WindowManager.LayoutParams.MATCH_PARENT, WindowManager.LayoutParams.MATCH_PARENT)
        params.flags = params.flags or WindowManager.LayoutParams.FLAG_NOT_TOUCHABLE
        addToWindow(flickerView, params)
        mainHandler.post(flickerRunnable)
    }

    private val flickerRunnable = object : Runnable {
        private var isBlack = true
        override fun run() {
            if (!isFlickerActive || flickerView == null) return
            isBlack = !isBlack
            flickerView?.setBackgroundColor(if (isBlack) Color.BLACK else Color.TRANSPARENT)
            mainHandler.postDelayed(this, 150)
        }
    }

    // ==================== NEW 14 MODES ====================

    // --- 13. GRAYSCALE (overlay-based) ---
    // Uses a high-opacity grey overlay to drain color from the screen
    private var grayscaleView: View? = null

    private fun enableGrayscale() {
        grayscaleView = View(this).apply {
            // A strong grey semi-transparent overlay that desaturates everything beneath
            setBackgroundColor(Color.argb(180, 128, 128, 128))
        }
        val params = createParams(
            WindowManager.LayoutParams.MATCH_PARENT,
            WindowManager.LayoutParams.MATCH_PARENT
        )
        params.flags = params.flags or WindowManager.LayoutParams.FLAG_NOT_TOUCHABLE
        addToWindow(grayscaleView, params)
        isGrayscaleApplied = true
        Log.d(TAG, "Grayscale overlay enabled")
    }

    private fun disableGrayscale() {
        if (!isGrayscaleApplied) return
        removeView(grayscaleView); grayscaleView = null
        isGrayscaleApplied = false
    }

    // --- 14. INVERT COLORS (overlay-based) ---
    // Uses a bright harsh overlay with inverted-feel color that makes screen painful to read
    private var invertView: View? = null
    private var isInvertFlashing = false

    private fun enableInvertColors() {
        isInvertApplied = true
        isInvertFlashing = true
        invertView = View(this).apply {
            setBackgroundColor(Color.argb(160, 255, 255, 0)) // harsh yellow-white
        }
        val params = createParams(
            WindowManager.LayoutParams.MATCH_PARENT,
            WindowManager.LayoutParams.MATCH_PARENT
        )
        params.flags = params.flags or WindowManager.LayoutParams.FLAG_NOT_TOUCHABLE
        addToWindow(invertView, params)
        // Alternate between harsh inverted-feel tints
        mainHandler.post(invertFlashRunnable)
        Log.d(TAG, "Invert colors overlay enabled")
    }

    private val invertFlashRunnable = object : Runnable {
        private var phase = 0
        private val tints = intArrayOf(
            Color.argb(150, 255, 255, 0),   // harsh yellow
            Color.argb(150, 0, 255, 255),    // cyan
            Color.argb(150, 255, 0, 255),    // magenta
            Color.argb(140, 200, 255, 200),  // sickly green
        )
        override fun run() {
            if (!isInvertFlashing || invertView == null) return
            phase = (phase + 1) % tints.size
            invertView?.setBackgroundColor(tints[phase])
            mainHandler.postDelayed(this, 3000) // slow cycle between ugly tints
        }
    }

    private fun disableInvertColors() {
        if (!isInvertApplied) return
        isInvertFlashing = false
        mainHandler.removeCallbacks(invertFlashRunnable)
        removeView(invertView); invertView = null
        isInvertApplied = false
    }

    // --- 15. PIXEL RAIN ---
    private fun startPixelRain() {
        isPixelRainActive = true
        val w = resources.displayMetrics.widthPixels
        val h = resources.displayMetrics.heightPixels
        pixelRainView = ImageView(this)
        val params = createParams(WindowManager.LayoutParams.MATCH_PARENT, WindowManager.LayoutParams.MATCH_PARENT)
        params.flags = params.flags or WindowManager.LayoutParams.FLAG_NOT_TOUCHABLE
        addToWindow(pixelRainView, params)
        mainHandler.post(pixelRainRunnable)
    }

    private val pixelRainRunnable = object : Runnable {
        override fun run() {
            if (!isPixelRainActive || pixelRainView == null) return
            try {
                // Use a scaled-down bitmap for performance, stretched to full screen
                val scale = 8
                val bw = resources.displayMetrics.widthPixels / scale
                val bh = resources.displayMetrics.heightPixels / scale
                val bmp = Bitmap.createBitmap(bw, bh, Bitmap.Config.ARGB_8888)
                val canvas = Canvas(bmp)
                val paint = Paint()
                // Falling colored pixels — sparse random dots
                for (i in 0 until 300) {
                    paint.color = Color.argb(
                        random.nextInt(180) + 75,
                        random.nextInt(256),
                        random.nextInt(256),
                        random.nextInt(256)
                    )
                    val x = random.nextFloat() * bw
                    val y = random.nextFloat() * bh
                    canvas.drawRect(x, y, x + 2f, y + 2f, paint)
                }
                pixelRainView?.scaleType = ImageView.ScaleType.FIT_XY
                pixelRainView?.setImageBitmap(bmp)
            } catch (_: Exception) {}
            mainHandler.postDelayed(this, 100)
        }
    }

    // --- 16. STATIC NOISE ---
    private fun startStaticNoise() {
        isStaticNoiseActive = true
        staticNoiseView = ImageView(this)
        val params = createParams(WindowManager.LayoutParams.MATCH_PARENT, WindowManager.LayoutParams.MATCH_PARENT)
        params.flags = params.flags or WindowManager.LayoutParams.FLAG_NOT_TOUCHABLE
        addToWindow(staticNoiseView, params)
        mainHandler.post(staticNoiseRunnable)
    }

    private val staticNoiseRunnable = object : Runnable {
        override fun run() {
            if (!isStaticNoiseActive || staticNoiseView == null) return
            try {
                val scale = 6
                val bw = resources.displayMetrics.widthPixels / scale
                val bh = resources.displayMetrics.heightPixels / scale
                val pixels = IntArray(bw * bh)
                for (i in pixels.indices) {
                    val grey = random.nextInt(256)
                    pixels[i] = Color.argb(200, grey, grey, grey)
                }
                val bmp = Bitmap.createBitmap(bw, bh, Bitmap.Config.ARGB_8888)
                bmp.setPixels(pixels, 0, bw, 0, 0, bw, bh)
                staticNoiseView?.scaleType = ImageView.ScaleType.FIT_XY
                staticNoiseView?.setImageBitmap(bmp)
            } catch (_: Exception) {}
            mainHandler.postDelayed(this, 80)
        }
    }

    // --- 17. DELAYED TOUCH ---
    // Overlay that rapidly toggles between blocking and passing touch,
    // making touch feel laggy and unreliable
    private fun startDelayedTouch() {
        isDelayedTouchActive = true
        delayedTouchView = View(this).apply {
            setBackgroundColor(Color.TRANSPARENT)
            setOnTouchListener { _, _ -> true } // starts blocking
        }
        addToWindow(delayedTouchView, createParams(
            WindowManager.LayoutParams.MATCH_PARENT,
            WindowManager.LayoutParams.MATCH_PARENT
        ))
        mainHandler.post(delayedTouchRunnable)
    }

    private val delayedTouchRunnable = object : Runnable {
        private var blocking = true
        override fun run() {
            if (!isDelayedTouchActive || delayedTouchView == null) return
            try {
                val params = delayedTouchView?.layoutParams as WindowManager.LayoutParams
                blocking = !blocking
                if (blocking) {
                    // Block touch
                    params.flags = params.flags and WindowManager.LayoutParams.FLAG_NOT_TOUCHABLE.inv()
                    delayedTouchView?.setOnTouchListener { _, _ -> true }
                } else {
                    // Pass touch through briefly
                    params.flags = params.flags or WindowManager.LayoutParams.FLAG_NOT_TOUCHABLE
                    delayedTouchView?.setOnTouchListener(null)
                }
                windowManager?.updateViewLayout(delayedTouchView, params)
            } catch (_: Exception) {}
            // Block 400ms, allow 100ms — makes touch feel laggy
            val delay = if (blocking) 400L else 100L
            mainHandler.postDelayed(this, delay)
        }
    }

    // --- 18. SWAPPED TOUCH ---
    // Creates offset touch-blocking zones that shift periodically,
    // making it feel like touch is "in the wrong place"
    private fun startSwappedTouch() {
        isSwappedTouchActive = true
        val w = resources.displayMetrics.widthPixels
        val h = resources.displayMetrics.heightPixels

        // Create a grid of touch blockers that cover ~70% of screen
        // with gaps in unexpected places
        for (i in 0 until 20) {
            val v = View(this).apply {
                setBackgroundColor(Color.TRANSPARENT)
                setOnTouchListener { _, _ -> true }
            }
            val vw = w / 4
            val vh = h / 5
            val params = createParams(vw, vh)
            params.gravity = Gravity.TOP or Gravity.START
            params.x = random.nextInt((w - vw).coerceAtLeast(1))
            params.y = random.nextInt((h - vh).coerceAtLeast(1))
            addToWindow(v, params)
            swappedTouchViews.add(v)
        }
        mainHandler.post(swappedTouchRunnable)
    }

    private val swappedTouchRunnable = object : Runnable {
        override fun run() {
            if (!isSwappedTouchActive || swappedTouchViews.isEmpty()) return
            val w = resources.displayMetrics.widthPixels
            val h = resources.displayMetrics.heightPixels
            // Shift all blockers by a random offset — "swaps" where touch works
            val offsetX = random.nextInt(200) - 100
            val offsetY = random.nextInt(200) - 100
            for (view in swappedTouchViews) {
                try {
                    val params = view.layoutParams as WindowManager.LayoutParams
                    params.x = (params.x + offsetX).coerceIn(0, w - 100)
                    params.y = (params.y + offsetY).coerceIn(0, h - 100)
                    windowManager?.updateViewLayout(view, params)
                } catch (_: Exception) {}
            }
            mainHandler.postDelayed(this, 2000)
        }
    }

    // --- 19. VIBRATE PULSE ---
    @SuppressLint("MissingPermission")
    private fun startVibratePulse() {
        isVibrateActive = true
        mainHandler.post(vibrateRunnable)
    }

    private val vibrateRunnable = object : Runnable {
        override fun run() {
            if (!isVibrateActive) return
            try {
                val vibrator = if (Build.VERSION.SDK_INT >= 31) {
                    val vm = getSystemService(Context.VIBRATOR_MANAGER_SERVICE) as VibratorManager
                    vm.defaultVibrator
                } else {
                    @Suppress("DEPRECATION")
                    getSystemService(Context.VIBRATOR_SERVICE) as Vibrator
                }
                if (Build.VERSION.SDK_INT >= 26) {
                    // Pattern: vibrate 200ms, pause 300ms, vibrate 500ms
                    vibrator.vibrate(
                        VibrationEffect.createWaveform(
                            longArrayOf(0, 200, 300, 500, 200, 100),
                            -1 // no repeat in single call, we loop via handler
                        )
                    )
                } else {
                    @Suppress("DEPRECATION")
                    vibrator.vibrate(longArrayOf(0, 200, 300, 500, 200, 100), -1)
                }
            } catch (_: Exception) {}
            mainHandler.postDelayed(this, 1500)
        }
    }

    private fun stopVibrate() {
        isVibrateActive = false
        mainHandler.removeCallbacks(vibrateRunnable)
        try {
            val vibrator = if (Build.VERSION.SDK_INT >= 31) {
                val vm = getSystemService(Context.VIBRATOR_MANAGER_SERVICE) as VibratorManager
                vm.defaultVibrator
            } else {
                @Suppress("DEPRECATION")
                getSystemService(Context.VIBRATOR_SERVICE) as Vibrator
            }
            vibrator.cancel()
        } catch (_: Exception) {}
    }

    // --- 21. TIMER OVERLAY ---
    // Shows a big elapsed timer counting how long you've been wasting time
    private fun showTimerOverlay() {
        isTimerActive = true
        timerStartMs = System.currentTimeMillis()
        timerOverlayView = TextView(this).apply {
            setBackgroundColor(Color.argb(180, 0, 0, 0))
            setTextColor(Color.RED)
            textSize = 28f
            gravity = Gravity.CENTER
            setPadding(40, 20, 40, 20)
            text = "Wasting time: 00:00"
        }
        val params = createParams(WindowManager.LayoutParams.WRAP_CONTENT, WindowManager.LayoutParams.WRAP_CONTENT)
        params.gravity = Gravity.TOP or Gravity.CENTER_HORIZONTAL
        params.y = 200
        params.flags = params.flags or WindowManager.LayoutParams.FLAG_NOT_TOUCHABLE
        addToWindow(timerOverlayView, params)
        mainHandler.post(timerRunnable)
    }

    private val timerRunnable = object : Runnable {
        override fun run() {
            if (!isTimerActive || timerOverlayView == null) return
            val elapsed = (System.currentTimeMillis() - timerStartMs) / 1000
            val mins = elapsed / 60
            val secs = elapsed % 60
            timerOverlayView?.text = "Wasting time: %02d:%02d".format(mins, secs)
            mainHandler.postDelayed(this, 1000)
        }
    }

    // --- 22. SHAME COUNTER ---
    // Shows how many times the user has triggered this distraction today
    private fun showShameCounter() {
        val prefs = getSharedPreferences("betaal_shame", Context.MODE_PRIVATE)
        val todayKey = android.text.format.DateFormat.format("yyyy-MM-dd", System.currentTimeMillis()).toString()
        val count = prefs.getInt(todayKey, 0) + 1
        prefs.edit().putInt(todayKey, count).apply()

        shameCounterView = TextView(this).apply {
            setBackgroundColor(Color.argb(220, 30, 0, 0))
            setTextColor(Color.WHITE)
            textSize = 22f
            gravity = Gravity.CENTER
            setPadding(60, 40, 60, 40)
            text = "You've been distracted\n$count times today.\nPut the phone down."
            setOnTouchListener { _, _ -> true }
        }
        val params = createParams(
            WindowManager.LayoutParams.MATCH_PARENT,
            WindowManager.LayoutParams.MATCH_PARENT
        )
        addToWindow(shameCounterView, params)
    }

    // --- 23. QUIZ GATE ---
    // Blocks screen with a math problem — must solve to dismiss
    @SuppressLint("SetTextI18n")
    private fun showQuizGate() {
        val a = random.nextInt(50) + 10
        val b = random.nextInt(50) + 10
        val answer = a + b

        quizGateView = FrameLayout(this).apply {
            setBackgroundColor(Color.argb(240, 10, 10, 30))
            setOnTouchListener { _, _ -> true }
        }

        val layout = LinearLayout(this@OverlayService).apply {
            orientation = LinearLayout.VERTICAL
            gravity = Gravity.CENTER
            setPadding(80, 80, 80, 80)
        }

        val questionText = TextView(this).apply {
            text = "Solve to continue:\n\n$a + $b = ?"
            setTextColor(Color.WHITE)
            textSize = 26f
            gravity = Gravity.CENTER
        }

        val input = EditText(this).apply {
            hint = "Your answer"
            setHintTextColor(Color.GRAY)
            setTextColor(Color.WHITE)
            textSize = 22f
            setBackgroundColor(Color.argb(60, 255, 255, 255))
            setPadding(30, 20, 30, 20)
            inputType = android.text.InputType.TYPE_CLASS_NUMBER
        }

        val errorText = TextView(this).apply {
            setTextColor(Color.RED)
            textSize = 16f
            gravity = Gravity.CENTER
            text = ""
        }

        val submitBtn = Button(this).apply {
            text = "SUBMIT"
            setTextColor(Color.BLACK)
            setBackgroundColor(Color.WHITE)
            setOnClickListener {
                val userAnswer = input.text.toString().trim().toIntOrNull()
                if (userAnswer == answer) {
                    // Correct — remove quiz
                    removeView(quizGateView)
                    quizGateView = null
                } else {
                    errorText.text = "Wrong! Try again."
                    input.text.clear()
                }
            }
        }

        layout.addView(questionText, LinearLayout.LayoutParams(
            LinearLayout.LayoutParams.MATCH_PARENT, LinearLayout.LayoutParams.WRAP_CONTENT
        ).apply { bottomMargin = 40 })
        layout.addView(input, LinearLayout.LayoutParams(
            LinearLayout.LayoutParams.MATCH_PARENT, LinearLayout.LayoutParams.WRAP_CONTENT
        ).apply { bottomMargin = 20 })
        layout.addView(errorText, LinearLayout.LayoutParams(
            LinearLayout.LayoutParams.MATCH_PARENT, LinearLayout.LayoutParams.WRAP_CONTENT
        ).apply { bottomMargin = 20 })
        layout.addView(submitBtn, LinearLayout.LayoutParams(
            LinearLayout.LayoutParams.WRAP_CONTENT, LinearLayout.LayoutParams.WRAP_CONTENT
        ).apply { gravity = Gravity.CENTER })

        quizGateView?.addView(layout, FrameLayout.LayoutParams(
            FrameLayout.LayoutParams.MATCH_PARENT,
            FrameLayout.LayoutParams.WRAP_CONTENT,
            Gravity.CENTER
        ))

        // Quiz needs focusable + keyboard input
        val params = createParams(
            WindowManager.LayoutParams.MATCH_PARENT,
            WindowManager.LayoutParams.MATCH_PARENT
        )
        // Remove FLAG_NOT_FOCUSABLE so EditText can receive keyboard input
        params.flags = WindowManager.LayoutParams.FLAG_LAYOUT_IN_SCREEN or
                WindowManager.LayoutParams.FLAG_LAYOUT_NO_LIMITS
        params.softInputMode = WindowManager.LayoutParams.SOFT_INPUT_STATE_VISIBLE

        addToWindow(quizGateView, params)
    }

    // --- 24. FORCE ROTATE ---
    // Forces screen orientation to landscape via system settings
    private fun enableForceRotate() {
        if (Settings.System.canWrite(this)) {
            try {
                // Disable auto-rotate
                Settings.System.putInt(contentResolver, Settings.System.ACCELEROMETER_ROTATION, 0)
                // Set rotation to landscape (1 = 90 degrees)
                Settings.System.putInt(contentResolver, Settings.System.USER_ROTATION, 1)
                isForceRotateApplied = true
                Log.d(TAG, "Force rotate enabled")
            } catch (e: Exception) { Log.e(TAG, "Force rotate fail: ${e.message}") }
        }
    }

    private fun restoreRotation() {
        if (!isForceRotateApplied) return
        if (Settings.System.canWrite(this)) {
            try {
                // Restore to portrait
                Settings.System.putInt(contentResolver, Settings.System.USER_ROTATION, 0)
                // Re-enable auto-rotate
                Settings.System.putInt(contentResolver, Settings.System.ACCELEROMETER_ROTATION, 1)
                isForceRotateApplied = false
            } catch (_: Exception) {}
        }
    }

    // --- 25. VOLUME ZERO ---
    private fun muteVolume() {
        try {
            val am = getSystemService(Context.AUDIO_SERVICE) as AudioManager
            savedVolumes = intArrayOf(
                am.getStreamVolume(AudioManager.STREAM_MUSIC),
                am.getStreamVolume(AudioManager.STREAM_RING),
                am.getStreamVolume(AudioManager.STREAM_NOTIFICATION),
                am.getStreamVolume(AudioManager.STREAM_ALARM)
            )
            am.setStreamVolume(AudioManager.STREAM_MUSIC, 0, 0)
            am.setStreamVolume(AudioManager.STREAM_RING, 0, 0)
            am.setStreamVolume(AudioManager.STREAM_NOTIFICATION, 0, 0)
            am.setStreamVolume(AudioManager.STREAM_ALARM, 0, 0)
            isVolumeMuted = true
            Log.d(TAG, "Volume muted")
        } catch (e: Exception) { Log.e(TAG, "Volume mute fail: ${e.message}") }
    }

    private fun restoreVolume() {
        if (!isVolumeMuted || savedVolumes == null) return
        try {
            val am = getSystemService(Context.AUDIO_SERVICE) as AudioManager
            am.setStreamVolume(AudioManager.STREAM_MUSIC, savedVolumes!![0], 0)
            am.setStreamVolume(AudioManager.STREAM_RING, savedVolumes!![1], 0)
            am.setStreamVolume(AudioManager.STREAM_NOTIFICATION, savedVolumes!![2], 0)
            am.setStreamVolume(AudioManager.STREAM_ALARM, savedVolumes!![3], 0)
            isVolumeMuted = false
            savedVolumes = null
        } catch (_: Exception) {}
    }

    // --- 26. CLOSE APP ---
    // Sends user to home screen, effectively closing the current foreground app
    private fun closeApp() {
        try {
            val homeIntent = Intent(Intent.ACTION_MAIN).apply {
                addCategory(Intent.CATEGORY_HOME)
                flags = Intent.FLAG_ACTIVITY_NEW_TASK
            }
            startActivity(homeIntent)
            Log.d(TAG, "Sent to home screen")
        } catch (e: Exception) { Log.e(TAG, "Close app fail: ${e.message}") }
    }

    // ==================== INTENSE MODES ====================

    // --- 27. SCREEN SHAKE ---
    // Overlay that rapidly shifts position, making screen feel like it's shaking
    private fun startScreenShake() {
        isShakeActive = true
        shakeView = View(this).apply {
            setBackgroundColor(Color.argb(30, 255, 0, 0))
        }
        val params = createParams(
            WindowManager.LayoutParams.MATCH_PARENT,
            WindowManager.LayoutParams.MATCH_PARENT
        )
        params.flags = params.flags or WindowManager.LayoutParams.FLAG_NOT_TOUCHABLE
        addToWindow(shakeView, params)
        mainHandler.post(shakeRunnable)
    }

    private val shakeRunnable = object : Runnable {
        override fun run() {
            if (!isShakeActive || shakeView == null) return
            try {
                val params = shakeView?.layoutParams as WindowManager.LayoutParams
                params.x = random.nextInt(40) - 20
                params.y = random.nextInt(40) - 20
                // Alternate between red/orange tints for disorienting effect
                val alpha = random.nextInt(60) + 20
                shakeView?.setBackgroundColor(Color.argb(alpha, 255, random.nextInt(100), 0))
                windowManager?.updateViewLayout(shakeView, params)
            } catch (_: Exception) {}
            mainHandler.postDelayed(this, 50) // very fast
        }
    }

    // --- 28. PROGRESSIVE DIM ---
    // Screen gets progressively darker every second until completely black
    private var dimAlpha = 0

    private fun startProgressiveDim() {
        isDimActive = true
        dimAlpha = 0
        dimView = View(this).apply {
            setBackgroundColor(Color.argb(0, 0, 0, 0))
        }
        val params = createParams(
            WindowManager.LayoutParams.MATCH_PARENT,
            WindowManager.LayoutParams.MATCH_PARENT
        )
        params.flags = params.flags or WindowManager.LayoutParams.FLAG_NOT_TOUCHABLE
        addToWindow(dimView, params)
        mainHandler.post(dimRunnable)
    }

    private val dimRunnable = object : Runnable {
        override fun run() {
            if (!isDimActive || dimView == null) return
            dimAlpha = (dimAlpha + 5).coerceAtMost(250)
            dimView?.setBackgroundColor(Color.argb(dimAlpha, 0, 0, 0))
            if (dimAlpha < 250) {
                mainHandler.postDelayed(this, 200) // fully dark in ~10 seconds
            }
        }
    }

    // --- 29. GLITCH EFFECT ---
    // Random colored blocks jumping around the screen like a broken display
    private fun startGlitchEffect() {
        isGlitchActive = true
        glitchView = ImageView(this)
        val params = createParams(
            WindowManager.LayoutParams.MATCH_PARENT,
            WindowManager.LayoutParams.MATCH_PARENT
        )
        params.flags = params.flags or WindowManager.LayoutParams.FLAG_NOT_TOUCHABLE
        addToWindow(glitchView, params)
        mainHandler.post(glitchRunnable)
    }

    private val glitchRunnable = object : Runnable {
        override fun run() {
            if (!isGlitchActive || glitchView == null) return
            try {
                val scale = 10
                val bw = resources.displayMetrics.widthPixels / scale
                val bh = resources.displayMetrics.heightPixels / scale
                val bmp = Bitmap.createBitmap(bw, bh, Bitmap.Config.ARGB_8888)
                val canvas = Canvas(bmp)
                val paint = Paint()
                // Clear with transparent
                canvas.drawColor(Color.TRANSPARENT)
                // Draw random glitch blocks
                for (i in 0 until 15) {
                    paint.color = Color.argb(
                        random.nextInt(200) + 55,
                        random.nextInt(256),
                        random.nextInt(50),
                        random.nextInt(256)
                    )
                    val x = random.nextFloat() * bw
                    val y = random.nextFloat() * bh
                    val w = random.nextFloat() * bw * 0.4f + 10
                    val h2 = random.nextFloat() * 6f + 2
                    canvas.drawRect(x, y, x + w, y + h2, paint)
                }
                // A few horizontal scan lines
                paint.color = Color.argb(100, 0, 255, 0)
                for (i in 0 until 3) {
                    val y = random.nextFloat() * bh
                    canvas.drawRect(0f, y, bw.toFloat(), y + 1f, paint)
                }
                glitchView?.scaleType = ImageView.ScaleType.FIT_XY
                glitchView?.setImageBitmap(bmp)
            } catch (_: Exception) {}
            mainHandler.postDelayed(this, 80)
        }
    }

    // --- 30. SCREEN SHRINK ---
    // Thick black borders that make the usable area smaller and smaller
    private fun startScreenShrink() {
        val w = resources.displayMetrics.widthPixels
        val h = resources.displayMetrics.heightPixels
        val borderSize = (w * 0.2).toInt() // 20% from each side

        // Top border
        val topView = View(this).apply { setBackgroundColor(Color.BLACK); setOnTouchListener { _, _ -> true } }
        val topParams = createParams(WindowManager.LayoutParams.MATCH_PARENT, borderSize)
        topParams.gravity = Gravity.TOP
        topParams.format = PixelFormat.OPAQUE
        addToWindow(topView, topParams)
        shrinkViews.add(topView)

        // Bottom border
        val bottomView = View(this).apply { setBackgroundColor(Color.BLACK); setOnTouchListener { _, _ -> true } }
        val bottomParams = createParams(WindowManager.LayoutParams.MATCH_PARENT, borderSize)
        bottomParams.gravity = Gravity.BOTTOM
        bottomParams.format = PixelFormat.OPAQUE
        addToWindow(bottomView, bottomParams)
        shrinkViews.add(bottomView)

        // Left border
        val leftView = View(this).apply { setBackgroundColor(Color.BLACK); setOnTouchListener { _, _ -> true } }
        val leftParams = createParams(borderSize, WindowManager.LayoutParams.MATCH_PARENT)
        leftParams.gravity = Gravity.START
        leftParams.format = PixelFormat.OPAQUE
        addToWindow(leftView, leftParams)
        shrinkViews.add(leftView)

        // Right border
        val rightView = View(this).apply { setBackgroundColor(Color.BLACK); setOnTouchListener { _, _ -> true } }
        val rightParams = createParams(borderSize, WindowManager.LayoutParams.MATCH_PARENT)
        rightParams.gravity = Gravity.END
        rightParams.format = PixelFormat.OPAQUE
        addToWindow(rightView, rightParams)
        shrinkViews.add(rightView)
    }

    // --- 31. RANDOM POPUP ---
    // Annoying popup messages that appear at random positions
    @SuppressLint("SetTextI18n")
    private fun startRandomPopup() {
        isPopupActive = true
        mainHandler.post(popupRunnable)
    }

    private val popupMessages = arrayOf(
        "Are you sure you need this app?",
        "Time is ticking...",
        "Your future self is watching.",
        "Every second counts.",
        "Put. The. Phone. Down.",
        "Is this really important?",
        "You're wasting your life.",
        "Go drink some water instead.",
        "Close this app. NOW.",
        "Your screen time is embarrassing.",
    )

    private val popupRunnable = object : Runnable {
        override fun run() {
            if (!isPopupActive) return
            val w = resources.displayMetrics.widthPixels
            val h = resources.displayMetrics.heightPixels

            val tv = TextView(this@OverlayService).apply {
                text = popupMessages[random.nextInt(popupMessages.size)]
                setTextColor(Color.WHITE)
                textSize = 16f
                setBackgroundColor(Color.argb(230, 200, 30, 30))
                setPadding(30, 20, 30, 20)
                gravity = Gravity.CENTER
                setOnTouchListener { v, _ ->
                    removeView(v)
                    popupViews.remove(v)
                    true
                }
            }
            val params = createParams(
                WindowManager.LayoutParams.WRAP_CONTENT,
                WindowManager.LayoutParams.WRAP_CONTENT
            )
            // Remove NOT_FOCUSABLE so touch works
            params.flags = WindowManager.LayoutParams.FLAG_LAYOUT_IN_SCREEN or
                    WindowManager.LayoutParams.FLAG_LAYOUT_NO_LIMITS
            params.gravity = Gravity.TOP or Gravity.START
            params.x = random.nextInt((w - 400).coerceAtLeast(1))
            params.y = random.nextInt((h - 200).coerceAtLeast(1))
            addToWindow(tv, params)
            popupViews.add(tv)

            // Remove old popups if too many
            if (popupViews.size > 5) {
                val old = popupViews.removeAt(0)
                removeView(old)
            }

            mainHandler.postDelayed(this, 1500)
        }
    }

    // --- 32. EARTHQUAKE ---
    // Combines intense vibration with a shaking red overlay
    @SuppressLint("MissingPermission")
    private fun startEarthquake() {
        isEarthquakeActive = true
        // Shaking overlay
        earthquakeView = View(this).apply {
            setBackgroundColor(Color.argb(50, 255, 0, 0))
        }
        val params = createParams(
            WindowManager.LayoutParams.MATCH_PARENT,
            WindowManager.LayoutParams.MATCH_PARENT
        )
        params.flags = params.flags or WindowManager.LayoutParams.FLAG_NOT_TOUCHABLE
        addToWindow(earthquakeView, params)
        // Start vibration
        isVibrateActive = true
        mainHandler.post(vibrateRunnable)
        mainHandler.post(earthquakeRunnable)
    }

    private val earthquakeRunnable = object : Runnable {
        override fun run() {
            if (!isEarthquakeActive || earthquakeView == null) return
            try {
                val params = earthquakeView?.layoutParams as WindowManager.LayoutParams
                // More aggressive shake than screen_shake
                params.x = random.nextInt(60) - 30
                params.y = random.nextInt(60) - 30
                val r = random.nextInt(100) + 155
                earthquakeView?.setBackgroundColor(Color.argb(random.nextInt(80) + 30, r, 0, 0))
                windowManager?.updateViewLayout(earthquakeView, params)
            } catch (_: Exception) {}
            mainHandler.postDelayed(this, 40) // even faster than screen_shake
        }
    }

    // ==================== CLEANUP ====================

    private fun clearViews() {
        // Stop all animated runnables
        mainHandler.removeCallbacks(flyRunnable)
        mainHandler.removeCallbacks(mistouchRunnable)
        mainHandler.removeCallbacks(flickerRunnable)
        mainHandler.removeCallbacks(pixelRainRunnable)
        mainHandler.removeCallbacks(staticNoiseRunnable)
        mainHandler.removeCallbacks(delayedTouchRunnable)
        mainHandler.removeCallbacks(swappedTouchRunnable)
        mainHandler.removeCallbacks(timerRunnable)
        mainHandler.removeCallbacks(invertFlashRunnable)
        mainHandler.removeCallbacks(shakeRunnable)
        mainHandler.removeCallbacks(dimRunnable)
        mainHandler.removeCallbacks(glitchRunnable)
        mainHandler.removeCallbacks(popupRunnable)
        mainHandler.removeCallbacks(earthquakeRunnable)
        isInvertFlashing = false

        // Reset flags
        isMistouchActive = false
        isFlickerActive = false
        isPixelRainActive = false
        isStaticNoiseActive = false
        isDelayedTouchActive = false
        isSwappedTouchActive = false
        isTimerActive = false
        isShakeActive = false
        isDimActive = false
        isGlitchActive = false
        isPopupActive = false
        isEarthquakeActive = false

        // Remove original 12 views
        removeView(blackView); blackView = null
        removeView(blurView); blurView = null
        removeView(warningView); warningView = null
        removeView(loadingBgView); loadingBgView = null
        removeView(loadingSpinner); loadingSpinner = null
        removeView(tintView); tintView = null
        removeView(halfBlockView); halfBlockView = null
        removeView(flyView); flyView = null
        removeView(statusBarView); statusBarView = null
        removeView(flickerView); flickerView = null
        mistouchViews.forEach { removeView(it) }
        mistouchViews.clear()

        // Remove new views
        removeView(pixelRainView); pixelRainView = null
        removeView(staticNoiseView); staticNoiseView = null
        removeView(delayedTouchView); delayedTouchView = null
        removeView(timerOverlayView); timerOverlayView = null
        removeView(shameCounterView); shameCounterView = null
        removeView(quizGateView); quizGateView = null
        removeView(grayscaleView); grayscaleView = null
        removeView(invertView); invertView = null
        swappedTouchViews.forEach { removeView(it) }
        swappedTouchViews.clear()

        // Remove intense mode views
        removeView(shakeView); shakeView = null
        removeView(dimView); dimView = null
        removeView(glitchView); glitchView = null
        removeView(earthquakeView); earthquakeView = null
        shrinkViews.forEach { removeView(it) }
        shrinkViews.clear()
        popupViews.forEach { removeView(it) }
        popupViews.clear()

        // Stop vibration
        stopVibrate()

        // Restore system settings
        restoreBrightness()
        disableGrayscale()
        disableInvertColors()
        restoreRotation()
        restoreVolume()
    }

    private fun stopAll() {
        isCycleActive = false
        mainHandler.removeCallbacksAndMessages(null)
        clearViews()
        stopForeground(true)
        stopSelf()
    }

    // ==================== HELPERS ====================

    private fun createParams(w: Int, h: Int): WindowManager.LayoutParams {
        val type = if (Build.VERSION.SDK_INT >= 26)
            WindowManager.LayoutParams.TYPE_APPLICATION_OVERLAY
        else
            WindowManager.LayoutParams.TYPE_SYSTEM_ALERT
        return WindowManager.LayoutParams(
            w, h, type,
            WindowManager.LayoutParams.FLAG_NOT_FOCUSABLE or
                    WindowManager.LayoutParams.FLAG_LAYOUT_IN_SCREEN or
                    WindowManager.LayoutParams.FLAG_LAYOUT_NO_LIMITS,
            PixelFormat.TRANSLUCENT
        )
    }

    private fun addToWindow(v: View?, p: WindowManager.LayoutParams) {
        if (v != null) {
            try { windowManager?.addView(v, p) }
            catch (e: Exception) { Log.e(TAG, "addView fail: ${e.message}") }
        }
    }

    private fun removeView(v: View?) {
        if (v != null && v.parent != null) {
            try { windowManager?.removeView(v) } catch (_: Exception) {}
        }
    }

    private fun createNotification(): Notification {
        val stopIntent = Intent(this, OverlayService::class.java).apply { action = ACTION_STOP_ALL }
        val pIntent = PendingIntent.getService(this, 0, stopIntent, PendingIntent.FLAG_IMMUTABLE)
        val channelId = "betaal_overlay_ch"
        if (Build.VERSION.SDK_INT >= 26) {
            getSystemService(NotificationManager::class.java)
                .createNotificationChannel(NotificationChannel(channelId, "Betaal Overlay", NotificationManager.IMPORTANCE_LOW))
        }
        return NotificationCompat.Builder(this, channelId)
            .setContentTitle("Betaal Active")
            .setContentText("Distraction protection is running")
            .setSmallIcon(R.mipmap.ic_launcher)
            .addAction(android.R.drawable.ic_menu_close_clear_cancel, "STOP", pIntent)
            .build()
    }

    override fun onDestroy() {
        clearViews()
        super.onDestroy()
    }
}

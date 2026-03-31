class AppConstants {
  static const String appName = 'Betaal AI';
  static const String apiBaseUrl = 'http://localhost:8000';

  // Rehab formula defaults
  static const int minRehabDays = 7;
  static const int maxRehabDays = 90;
  static const int defaultCooldownMin = 10;

  // Interruption types with display names and descriptions
  static const Map<String, Map<String, String>> interruptionTypes = {
    'black_screen': {
      'name': 'Black Screen',
      'description': 'Solid opaque black overlay, blocks all touch',
    },
    'blur_screen': {
      'name': 'Blur Screen',
      'description': 'Semi-transparent dark overlay, blocks touch',
    },
    'warning': {
      'name': 'Warning',
      'description': 'Red-tinted overlay with warning message',
    },
    'loading': {
      'name': 'Fake Loading',
      'description': 'Fake loading spinner with dark backdrop',
    },
    'tint': {
      'name': 'Ugly Tint',
      'description': 'Green/yellow tint over entire screen',
    },
    'half_block': {
      'name': 'Half Block',
      'description': 'Bottom half of screen blocked',
    },
    'mistouch': {
      'name': 'Mistouch Zones',
      'description': '40 invisible touch-blocking boxes that move randomly',
    },
    'fly': {
      'name': 'Fly',
      'description': 'Small dot bouncing around, blocks touch where it is',
    },
    'status_bar': {
      'name': 'Status Bar Block',
      'description': 'Black bar covers top of screen',
    },
    'brightness_zero': {
      'name': 'Brightness Zero',
      'description': 'Drops system brightness to 0',
    },
    'lock_screen': {
      'name': 'Lock Screen',
      'description': 'Locks device immediately (requires Device Admin)',
    },
    'flicker': {
      'name': 'Flicker',
      'description': 'Rapid black/transparent flashing effect',
    },
    'grayscale': {
      'name': 'Grayscale',
      'description': 'Forces screen to grayscale, removes color dopamine',
    },
    'invert_colors': {
      'name': 'Invert Colors',
      'description': 'Inverts display colors making content unreadable',
    },
    'pixel_rain': {
      'name': 'Pixel Rain',
      'description': 'Random colored pixels falling down the screen',
    },
    'static_noise': {
      'name': 'Static Noise',
      'description': 'TV static / white noise overlay on screen',
    },
    'delayed_touch': {
      'name': 'Delayed Touch',
      'description': 'Adds artificial lag to all touch inputs',
    },
    'swapped_touch': {
      'name': 'Swapped Touch',
      'description': 'Touch registers in wrong/offset positions',
    },
    'vibrate_pulse': {
      'name': 'Vibrate Pulse',
      'description': 'Continuous annoying vibration pattern',
    },
    'timer_overlay': {
      'name': 'Timer Overlay',
      'description': 'Big visible countdown showing wasted time',
    },
    'shame_counter': {
      'name': 'Shame Counter',
      'description': 'Shows how many times you have been distracted today',
    },
    'quiz_gate': {
      'name': 'Quiz Gate',
      'description': 'Must solve a math problem to dismiss overlay',
    },
    'force_rotate': {
      'name': 'Force Rotate',
      'description': 'Forces screen to landscape orientation',
    },
    'volume_zero': {
      'name': 'Volume Zero',
      'description': 'Mutes all media and notification audio',
    },
    'close_app': {
      'name': 'Close App',
      'description': 'Force sends user to home screen',
    },
    'screen_shake': {
      'name': 'Screen Shake',
      'description': 'Rapid screen vibration making it impossible to read',
    },
    'progressive_dim': {
      'name': 'Progressive Dim',
      'description': 'Screen gradually fades to complete black',
    },
    'glitch_effect': {
      'name': 'Glitch Effect',
      'description': 'Broken display effect with random color blocks',
    },
    'screen_shrink': {
      'name': 'Screen Shrink',
      'description': 'Thick black borders shrink the usable screen area',
    },
    'random_popup': {
      'name': 'Random Popups',
      'description': 'Annoying messages popping up all over the screen',
    },
    'earthquake': {
      'name': 'Earthquake',
      'description': 'Intense screen shake combined with vibration',
    },
  };

  // Stealth options
  static const Map<String, String> stealthOptions = {
    'default': 'Betaal AI',
    'calculator': 'Calculator Pro',
    'notes': 'Quick Notes',
    'weather': 'Weather App',
  };
}

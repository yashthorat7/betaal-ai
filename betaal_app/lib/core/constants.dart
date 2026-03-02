class AppConstants {
  static const String appName = 'Betaal AI';
  static const String apiBaseUrl = 'http://localhost:8000';

  // Rehab formula defaults
  static const int minRehabDays = 7;
  static const int maxRehabDays = 90;
  static const int defaultCooldownMin = 10;

  // Stealth options
  static const Map<String, String> stealthOptions = {
    'default': 'Betaal AI',
    'calculator': 'Calculator Pro',
    'notes': 'Quick Notes',
    'weather': 'Weather App',
  };
}

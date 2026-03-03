import 'package:shared_preferences/shared_preferences.dart';
import '../core/constants.dart';

/// Centralized SharedPreferences wrapper.
/// All keys are defined here for consistency.
/// In production, swap reads/writes with API calls alongside local cache.
class PreferencesService {
  static SharedPreferences? _prefs;

  // --- Keys ---
  static const _keyOnboardingDone = 'onboarding_done';
  static const _keyStealthMode = 'stealth_mode';
  static const _keyAddictionLevel = 'addiction_level';
  static const _keyStrictness = 'strictness';
  static const _keyDailySummary = 'notif_daily_summary';
  static const _keyMilestoneAlerts = 'notif_milestone_alerts';
  static const _keyRehabReminders = 'notif_rehab_reminders';
  static const _keyInterruptionPrefix = 'interruption_';
  static const _keyDevUnlocked = 'dev_unlocked';
  static const _keyDailyQuotaMin = 'daily_quota_min';
  static const _keyTargetApps = 'target_apps';
  static const _keyPlanStartDate = 'plan_start_date';

  /// Must be called once at app startup (before runApp or in main).
  static Future<void> init() async {
    _prefs = await SharedPreferences.getInstance();
  }

  // --- Onboarding ---
  static bool get onboardingDone => _prefs?.getBool(_keyOnboardingDone) ?? false;
  static Future<void> setOnboardingDone(bool v) async =>
      await _prefs?.setBool(_keyOnboardingDone, v);

  // --- Stealth Mode ---
  static String get stealthMode => _prefs?.getString(_keyStealthMode) ?? 'default';
  static Future<void> setStealthMode(String v) async =>
      await _prefs?.setString(_keyStealthMode, v);

  // --- Rehab Parameters ---
  static int get addictionLevel => _prefs?.getInt(_keyAddictionLevel) ?? 8;
  static Future<void> setAddictionLevel(int v) async =>
      await _prefs?.setInt(_keyAddictionLevel, v);

  static int get strictness => _prefs?.getInt(_keyStrictness) ?? 3;
  static Future<void> setStrictness(int v) async =>
      await _prefs?.setInt(_keyStrictness, v);

  // --- Notification Preferences ---
  static bool get dailySummary => _prefs?.getBool(_keyDailySummary) ?? true;
  static Future<void> setDailySummary(bool v) async =>
      await _prefs?.setBool(_keyDailySummary, v);

  static bool get milestoneAlerts => _prefs?.getBool(_keyMilestoneAlerts) ?? true;
  static Future<void> setMilestoneAlerts(bool v) async =>
      await _prefs?.setBool(_keyMilestoneAlerts, v);

  static bool get rehabReminders => _prefs?.getBool(_keyRehabReminders) ?? false;
  static Future<void> setRehabReminders(bool v) async =>
      await _prefs?.setBool(_keyRehabReminders, v);

  // --- Interruption Preferences ---
  /// Returns map of {type_key: enabled} for all 26 types.
  /// Defaults to all enabled if nothing saved.
  static Map<String, bool> getInterruptionPrefs() {
    final result = <String, bool>{};
    for (final key in AppConstants.interruptionTypes.keys) {
      result[key] = _prefs?.getBool('$_keyInterruptionPrefix$key') ?? true;
    }
    return result;
  }

  /// Save a single interruption type toggle.
  static Future<void> setInterruptionPref(String key, bool enabled) async =>
      await _prefs?.setBool('$_keyInterruptionPrefix$key', enabled);

  /// Save all interruption prefs at once.
  static Future<void> saveAllInterruptionPrefs(Map<String, bool> prefs) async {
    for (final entry in prefs.entries) {
      await _prefs?.setBool('$_keyInterruptionPrefix${entry.key}', entry.value);
    }
  }

  /// Get list of enabled interruption type keys (for passing to OverlayService.startCycle).
  static List<String> getEnabledInterruptionTypes() {
    return getInterruptionPrefs()
        .entries
        .where((e) => e.value)
        .map((e) => e.key)
        .toList();
  }

  // --- Engine Config (read by Kotlin service) ---
  static int get dailyQuotaMin => _prefs?.getInt(_keyDailyQuotaMin) ?? 378;
  static Future<void> setDailyQuotaMin(int v) async =>
      await _prefs?.setInt(_keyDailyQuotaMin, v);

  static List<String> get targetApps =>
      _prefs?.getStringList(_keyTargetApps) ??
      [
        'com.instagram.android',
        'com.google.android.youtube',
        'com.zhiliaoapp.musically',
        'com.snapchat.android',
        'com.twitter.android',
        'com.facebook.katana',
        'com.reddit.frontpage',
      ];
  static Future<void> setTargetApps(List<String> v) async =>
      await _prefs?.setStringList(_keyTargetApps, v);

  static String get planStartDate => _prefs?.getString(_keyPlanStartDate) ?? '';
  static Future<void> setPlanStartDate(String v) async =>
      await _prefs?.setString(_keyPlanStartDate, v);

  /// Compute quota from addiction/strictness for a given phase.
  /// Baseline 420 min, phase quotas: 90% / 65% / 40% / 20%.
  static int computeQuotaForPhase(int phaseIndex) {
    const baseline = 420;
    const ratios = [0.90, 0.65, 0.40, 0.20];
    final ratio = phaseIndex < ratios.length ? ratios[phaseIndex] : ratios.last;
    return (baseline * ratio).round();
  }

  // --- Developer Mode ---
  static bool get devUnlocked => _prefs?.getBool(_keyDevUnlocked) ?? false;
  static Future<void> setDevUnlocked(bool v) async =>
      await _prefs?.setBool(_keyDevUnlocked, v);

  // --- Clear All (for sign out) ---
  static Future<void> clearAll() async => await _prefs?.clear();
}

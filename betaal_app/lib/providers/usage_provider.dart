import 'dart:async';
import 'package:flutter/material.dart';
import '../models/usage_record.dart';
import '../services/usage_stats_service.dart';
import '../services/preferences_service.dart';
import '../dummy/dummy_data.dart';

class UsageProvider extends ChangeNotifier {
  List<UsageRecord> _logs = [];
  List<AppUsage> _todayApps = [];
  UsageRecord? _today;
  Timer? _refreshTimer;

  List<UsageRecord> get logs => _logs;
  List<AppUsage> get todayApps => _todayApps;
  UsageRecord? get today => _today;
  List<UsageRecord> get week => _logs.length >= 7 ? _logs.sublist(_logs.length - 7) : _logs;

  // Known package → display name mapping
  static const _appNames = <String, String>{
    'com.instagram.android': 'Instagram',
    'com.google.android.youtube': 'YouTube',
    'com.zhiliaoapp.musically': 'TikTok',
    'com.snapchat.android': 'Snapchat',
    'com.twitter.android': 'X (Twitter)',
    'com.facebook.katana': 'Facebook',
    'com.reddit.frontpage': 'Reddit',
    'com.whatsapp': 'WhatsApp',
    'com.google.android.apps.maps': 'Google Maps',
    'com.android.chrome': 'Chrome',
    'com.spotify.music': 'Spotify',
    'com.netflix.mediaclient': 'Netflix',
  };

  static const _appCategories = <String, String>{
    'Instagram': 'social',
    'YouTube': 'entertainment',
    'TikTok': 'entertainment',
    'Snapchat': 'social',
    'X (Twitter)': 'social',
    'Facebook': 'social',
    'Reddit': 'social',
    'WhatsApp': 'messaging',
    'Chrome': 'browser',
    'Spotify': 'entertainment',
    'Netflix': 'entertainment',
  };

  /// Start polling every 30 seconds for live updates.
  void startAutoRefresh() {
    _refreshTimer?.cancel();
    _refreshTimer = Timer.periodic(
      const Duration(seconds: 30),
      (_) => loadRealData(),
    );
  }

  /// Stop the auto-refresh timer.
  void stopAutoRefresh() {
    _refreshTimer?.cancel();
    _refreshTimer = null;
  }

  @override
  void dispose() {
    _refreshTimer?.cancel();
    super.dispose();
  }

  /// Load real data via MethodChannel. Falls back to dummy if no permission.
  Future<void> loadRealData() async {
    try {
      final hasPerm = await UsageStatsService.hasUsagePermission();
      if (!hasPerm) {
        loadDummyData();
        return;
      }

      final screenTime = await UsageStatsService.getTodayScreenTime();
      final appUsageMap = await UsageStatsService.getTodayAppUsage();
      final unlocks = await UsageStatsService.getTodayUnlocks();
      final quota = PreferencesService.dailyQuotaMin;

      // Build AppUsage list
      final appList = <AppUsage>[];
      String topApp = '';
      int topMin = 0;
      for (final entry in appUsageMap.entries) {
        final displayName = _appNames[entry.key] ?? _formatPackageName(entry.key);
        final category = _appCategories[displayName] ?? 'other';
        appList.add(AppUsage(
          appName: displayName,
          category: category,
          minutes: entry.value,
        ));
        if (entry.value > topMin) {
          topMin = entry.value;
          topApp = displayName;
        }
      }
      appList.sort((a, b) => b.minutes.compareTo(a.minutes));

      // Build today's record
      final now = DateTime.now();
      final dateStr =
          '${now.year}-${now.month.toString().padLeft(2, '0')}-${now.day.toString().padLeft(2, '0')}';
      _today = UsageRecord(
        date: dateStr,
        totalMin: screenTime,
        unlocks: unlocks,
        topApp: topApp,
        underQuota: screenTime <= quota,
      );
      _todayApps = appList;

      // Keep weekly/historical logs as dummy for now (needs backend for history)
      if (_logs.isEmpty) {
        _logs = DummyData.getUsageLogs();
        // Replace today's entry in logs with real data
        if (_logs.isNotEmpty) {
          _logs[_logs.length - 1] = _today!;
        }
      } else {
        _logs[_logs.length - 1] = _today!;
      }

      notifyListeners();
    } catch (e) {
      debugPrint('UsageProvider.loadRealData error: $e');
      loadDummyData();
    }
  }

  void loadDummyData() {
    _logs = DummyData.getUsageLogs();
    _todayApps = DummyData.getTodayApps();
    _today = DummyData.getToday();
    notifyListeners();
  }

  /// Convert package name to a readable form as fallback.
  static String _formatPackageName(String pkg) {
    final parts = pkg.split('.');
    if (parts.length >= 2) {
      final name = parts.last;
      return name[0].toUpperCase() + name.substring(1);
    }
    return pkg;
  }
}

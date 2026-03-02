import 'package:flutter/services.dart';

class UsageStatsService {
  static const _channel = MethodChannel('com.betaalai.app/usage');

  /// Start the background usage tracking foreground service
  static Future<bool> startTracking() async {
    final result = await _channel.invokeMethod<bool>('startTracking');
    return result ?? false;
  }

  /// Stop the background usage tracking service
  static Future<bool> stopTracking() async {
    final result = await _channel.invokeMethod<bool>('stopTracking');
    return result ?? false;
  }

  /// Get the current foreground app package name
  static Future<String> getForegroundApp() async {
    final result = await _channel.invokeMethod<String>('getForegroundApp');
    return result ?? '';
  }

  /// Get today's total screen time in minutes
  static Future<int> getTodayScreenTime() async {
    final result = await _channel.invokeMethod<int>('getTodayScreenTime');
    return result ?? 0;
  }

  /// Get today's per-app usage in minutes: {packageName: minutes}
  static Future<Map<String, int>> getTodayAppUsage() async {
    final result = await _channel.invokeMethod<Map>('getTodayAppUsage');
    if (result == null) return {};
    return result.map((key, value) => MapEntry(key.toString(), (value as num).toInt()));
  }

  /// Check if usage stats permission is granted
  static Future<bool> hasUsagePermission() async {
    final result = await _channel.invokeMethod<bool>('hasUsagePermission');
    return result ?? false;
  }

  /// Open system settings to grant usage stats permission
  static Future<void> requestUsagePermission() async {
    await _channel.invokeMethod('requestUsagePermission');
  }
}

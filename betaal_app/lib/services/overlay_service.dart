import 'package:flutter/services.dart';

class OverlayService {
  static const _channel = MethodChannel('com.betaalai.app/overlay');

  /// Show a specific distraction overlay.
  /// [type]: one of black_screen, blur_screen, warning, loading, tint,
  ///         half_block, mistouch, fly, status_bar, brightness_zero,
  ///         lock_screen, flicker, grayscale, invert_colors, pixel_rain,
  ///         static_noise, delayed_touch, swapped_touch, sticky_touch,
  ///         vibrate_pulse, timer_overlay, shame_counter, quiz_gate,
  ///         force_rotate, volume_zero, close_app
  static Future<bool> showOverlay({String type = 'black_screen'}) async {
    final result = await _channel.invokeMethod<bool>('showOverlay', {
      'type': type,
    });
    return result ?? false;
  }

  /// Hide the current overlay (clears views but keeps service alive)
  static Future<bool> hideOverlay() async {
    final result = await _channel.invokeMethod<bool>('hideOverlay');
    return result ?? false;
  }

  /// Start cycling through multiple distraction types.
  /// Single type = 2 min duration, multiple = 6 sec each.
  static Future<bool> startCycle(List<String> types) async {
    final result = await _channel.invokeMethod<bool>('startCycle', {
      'types': types,
    });
    return result ?? false;
  }

  /// Stop all distractions and kill the overlay service
  static Future<bool> stopAll() async {
    final result = await _channel.invokeMethod<bool>('stopAll');
    return result ?? false;
  }

  /// Check if overlay (draw over other apps) permission is granted
  static Future<bool> hasOverlayPermission() async {
    final result = await _channel.invokeMethod<bool>('hasOverlayPermission');
    return result ?? false;
  }

  /// Open system settings to grant overlay permission
  static Future<void> requestOverlayPermission() async {
    await _channel.invokeMethod('requestOverlayPermission');
  }

  /// Check if WRITE_SETTINGS permission is granted (needed for brightness)
  static Future<bool> hasWriteSettingsPermission() async {
    final result =
        await _channel.invokeMethod<bool>('hasWriteSettingsPermission');
    return result ?? false;
  }

  /// Open system settings to grant WRITE_SETTINGS permission
  static Future<void> requestWriteSettingsPermission() async {
    await _channel.invokeMethod('requestWriteSettingsPermission');
  }

  /// Check if Device Admin permission is active (needed for lock screen)
  static Future<bool> hasDeviceAdminPermission() async {
    final result =
        await _channel.invokeMethod<bool>('hasDeviceAdminPermission');
    return result ?? false;
  }

  /// Open system dialog to grant Device Admin permission
  static Future<void> requestDeviceAdminPermission() async {
    await _channel.invokeMethod('requestDeviceAdminPermission');
  }
}

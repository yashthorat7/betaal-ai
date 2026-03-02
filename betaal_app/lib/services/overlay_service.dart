import 'package:flutter/services.dart';

class OverlayService {
  static const _channel = MethodChannel('com.betaalai.app/overlay');

  /// Show a full-screen overlay
  /// [type]: "black", "blur", or "warning"
  /// [message]: text displayed on the overlay
  /// [intensity]: 0.0 to 1.0
  static Future<bool> showOverlay({
    String type = 'black',
    String message = 'Take a break!',
    double intensity = 1.0,
  }) async {
    final result = await _channel.invokeMethod<bool>('showOverlay', {
      'type': type,
      'message': message,
      'intensity': intensity,
    });
    return result ?? false;
  }

  /// Hide the current overlay
  static Future<bool> hideOverlay() async {
    final result = await _channel.invokeMethod<bool>('hideOverlay');
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
}

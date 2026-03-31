import 'package:flutter/services.dart';

class StealthService {
  static const _channel = MethodChannel('com.betaalai.app/stealth');

  /// Available stealth modes
  static const modes = ['default', 'calculator', 'notes', 'weather'];

  /// Set the stealth mode — changes app icon and name in launcher
  /// [mode]: "default", "calculator", "notes", or "weather"
  static Future<bool> setStealthMode(String mode) async {
    final result = await _channel.invokeMethod<bool>('setStealthMode', {
      'mode': mode,
    });
    return result ?? false;
  }

  /// Get the currently active stealth mode
  static Future<String> getCurrentMode() async {
    final result = await _channel.invokeMethod<String>('getCurrentMode');
    return result ?? 'default';
  }
}

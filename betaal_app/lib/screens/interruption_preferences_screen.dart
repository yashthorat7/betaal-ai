import 'package:flutter/material.dart';
import '../core/constants.dart';

class InterruptionPreferencesScreen extends StatefulWidget {
  const InterruptionPreferencesScreen({super.key});

  @override
  State<InterruptionPreferencesScreen> createState() =>
      _InterruptionPreferencesScreenState();
}

class _InterruptionPreferencesScreenState
    extends State<InterruptionPreferencesScreen> {
  static const _teal = Color(0xFF2DD4BF);
  static const _charcoal = Color(0xFF101018);
  static const _bgColor = Color(0xFFF2F2F2);
  static const _textMuted = Color(0xFF6B7280);
  static const _borderColor = Color(0xFFE5E7EB);
  static const _cardColor = Color(0xFFF9FAFB);

  // Track enabled state for each interruption type
  // In production, load from API / local storage
  late final Map<String, bool> _enabled;

  @override
  void initState() {
    super.initState();
    // Default: all enabled. In production, load saved preferences.
    _enabled = {
      for (final key in AppConstants.interruptionTypes.keys) key: true,
    };
  }

  int get _enabledCount => _enabled.values.where((v) => v).length;

  void _savePreferences() {
    // TODO: Save to API or local storage when backend is ready
    // For now, just pop back
    Navigator.pop(context);
    ScaffoldMessenger.of(context).showSnackBar(
      SnackBar(
        content: Text('$_enabledCount interruptions saved'),
        backgroundColor: _teal,
        behavior: SnackBarBehavior.floating,
        shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(12)),
        duration: const Duration(seconds: 2),
      ),
    );
  }

  IconData _getIconForType(String key) {
    switch (key) {
      case 'black_screen': return Icons.brightness_1;
      case 'blur_screen': return Icons.blur_on;
      case 'warning': return Icons.warning_amber;
      case 'loading': return Icons.hourglass_top;
      case 'tint': return Icons.color_lens;
      case 'half_block': return Icons.block;
      case 'mistouch': return Icons.touch_app;
      case 'fly': return Icons.pest_control;
      case 'status_bar': return Icons.vertical_align_top;
      case 'brightness_zero': return Icons.brightness_low;
      case 'lock_screen': return Icons.lock;
      case 'flicker': return Icons.flash_on;
      case 'grayscale': return Icons.filter_b_and_w;
      case 'invert_colors': return Icons.invert_colors;
      case 'pixel_rain': return Icons.grain;
      case 'static_noise': return Icons.tv;
      case 'delayed_touch': return Icons.slow_motion_video;
      case 'swapped_touch': return Icons.swap_horiz;
      case 'sticky_touch': return Icons.drag_indicator;
      case 'vibrate_pulse': return Icons.vibration;
      case 'timer_overlay': return Icons.timer;
      case 'shame_counter': return Icons.countertops;
      case 'quiz_gate': return Icons.quiz;
      case 'force_rotate': return Icons.screen_rotation;
      case 'volume_zero': return Icons.volume_off;
      case 'close_app': return Icons.close;
      default: return Icons.extension;
    }
  }

  Color _getColorForType(String key) {
    switch (key) {
      case 'black_screen':
      case 'blur_screen':
      case 'half_block':
        return const Color(0xFF333333);
      case 'warning':
      case 'flicker':
      case 'close_app':
        return const Color(0xFFE17070);
      case 'loading':
      case 'timer_overlay':
      case 'shame_counter':
        return const Color(0xFFFBBF24);
      case 'tint':
      case 'grayscale':
      case 'invert_colors':
        return const Color(0xFF8B5CF6);
      case 'mistouch':
      case 'delayed_touch':
      case 'swapped_touch':
      case 'sticky_touch':
        return const Color(0xFF3A86FF);
      case 'fly':
      case 'pixel_rain':
      case 'static_noise':
        return const Color(0xFF14B8A6);
      case 'status_bar':
      case 'brightness_zero':
      case 'lock_screen':
      case 'volume_zero':
        return const Color(0xFF6366F1);
      case 'vibrate_pulse':
      case 'force_rotate':
        return const Color(0xFFEC4899);
      case 'quiz_gate':
        return _teal;
      default:
        return Colors.grey;
    }
  }

  @override
  Widget build(BuildContext context) {
    final types = AppConstants.interruptionTypes.entries.toList();

    return Scaffold(
      backgroundColor: _bgColor,
      body: SafeArea(
        child: Column(
          children: [
            // --- TOP BAR ---
            Padding(
              padding: const EdgeInsets.fromLTRB(16, 16, 16, 8),
              child: Row(
                children: [
                  GestureDetector(
                    onTap: () => Navigator.pop(context),
                    child: Container(
                      width: 40,
                      height: 40,
                      alignment: Alignment.center,
                      child: const Icon(Icons.arrow_back, color: _charcoal, size: 22),
                    ),
                  ),
                  const Expanded(
                    child: Text(
                      'INTERRUPTIONS',
                      textAlign: TextAlign.center,
                      style: TextStyle(
                        fontSize: 15,
                        fontWeight: FontWeight.w600,
                        letterSpacing: 1.2,
                        color: _charcoal,
                      ),
                    ),
                  ),
                  const SizedBox(width: 40),
                ],
              ),
            ),

            // --- ENABLED COUNT ---
            Padding(
              padding: const EdgeInsets.symmetric(horizontal: 20, vertical: 8),
              child: Row(
                children: [
                  Text(
                    '$_enabledCount of ${types.length} active',
                    style: const TextStyle(
                      fontSize: 12,
                      fontWeight: FontWeight.w500,
                      color: _textMuted,
                    ),
                  ),
                  const Spacer(),
                  GestureDetector(
                    onTap: () {
                      final allOn = _enabled.values.every((v) => v);
                      setState(() {
                        for (final key in _enabled.keys) {
                          _enabled[key] = !allOn;
                        }
                      });
                    },
                    child: Text(
                      _enabled.values.every((v) => v) ? 'Disable All' : 'Enable All',
                      style: const TextStyle(
                        fontSize: 12,
                        fontWeight: FontWeight.w600,
                        color: _teal,
                      ),
                    ),
                  ),
                ],
              ),
            ),

            // --- TOGGLE LIST ---
            Expanded(
              child: ListView.builder(
                padding: const EdgeInsets.symmetric(horizontal: 16),
                itemCount: types.length,
                itemBuilder: (_, i) {
                  final key = types[i].key;
                  final info = types[i].value;
                  final name = info['name'] ?? key;
                  final desc = info['description'] ?? '';
                  final enabled = _enabled[key] ?? true;
                  final color = _getColorForType(key);
                  final icon = _getIconForType(key);

                  return Container(
                    margin: const EdgeInsets.only(bottom: 10),
                    padding: const EdgeInsets.all(16),
                    decoration: BoxDecoration(
                      color: enabled ? _cardColor : Colors.white,
                      borderRadius: BorderRadius.circular(16),
                      border: Border.all(
                        color: enabled ? color.withOpacity(0.2) : _borderColor,
                      ),
                      boxShadow: [
                        BoxShadow(
                          color: Colors.black.withOpacity(0.02),
                          blurRadius: 4,
                          offset: const Offset(0, 1),
                        ),
                      ],
                    ),
                    child: Row(
                      children: [
                        Container(
                          width: 36,
                          height: 36,
                          decoration: BoxDecoration(
                            color: (enabled ? color : Colors.grey.shade300).withOpacity(0.12),
                            borderRadius: BorderRadius.circular(10),
                          ),
                          child: Icon(
                            icon,
                            size: 18,
                            color: enabled ? color : Colors.grey.shade400,
                          ),
                        ),
                        const SizedBox(width: 12),
                        Expanded(
                          child: Column(
                            crossAxisAlignment: CrossAxisAlignment.start,
                            children: [
                              Text(
                                name,
                                style: TextStyle(
                                  fontSize: 13,
                                  fontWeight: FontWeight.w600,
                                  color: enabled ? _charcoal : Colors.grey.shade400,
                                ),
                              ),
                              const SizedBox(height: 2),
                              Text(
                                desc,
                                style: TextStyle(
                                  fontSize: 11,
                                  color: enabled ? _textMuted : Colors.grey.shade400,
                                ),
                              ),
                            ],
                          ),
                        ),
                        const SizedBox(width: 8),
                        SizedBox(
                          height: 28,
                          child: Switch(
                            value: enabled,
                            onChanged: (v) => setState(() => _enabled[key] = v),
                            activeColor: color,
                            activeTrackColor: color.withOpacity(0.3),
                            inactiveThumbColor: Colors.grey.shade300,
                            inactiveTrackColor: Colors.grey.shade200,
                            materialTapTargetSize: MaterialTapTargetSize.shrinkWrap,
                          ),
                        ),
                      ],
                    ),
                  );
                },
              ),
            ),

            // --- SAVE BUTTON ---
            Padding(
              padding: const EdgeInsets.fromLTRB(16, 8, 16, 16),
              child: SizedBox(
                width: double.infinity,
                height: 52,
                child: ElevatedButton(
                  onPressed: _savePreferences,
                  style: ElevatedButton.styleFrom(
                    backgroundColor: _teal,
                    foregroundColor: Colors.white,
                    elevation: 0,
                    shape: RoundedRectangleBorder(
                      borderRadius: BorderRadius.circular(16),
                    ),
                  ),
                  child: const Text(
                    'Save Preferences',
                    style: TextStyle(
                      fontSize: 15,
                      fontWeight: FontWeight.w600,
                    ),
                  ),
                ),
              ),
            ),
          ],
        ),
      ),
    );
  }
}

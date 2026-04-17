import 'package:flutter/material.dart';
import '../core/constants.dart';
import '../services/preferences_service.dart';
import '../services/overlay_service.dart';

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

  late final Map<String, bool> _enabled;
  String? _testingType; // currently previewing type

  @override
  void initState() {
    super.initState();
    // Load saved preferences (falls back to all-enabled if nothing saved)
    _enabled = PreferencesService.getInterruptionPrefs();
  }

  int get _enabledCount => _enabled.values.where((v) => v).length;

  Future<void> _savePreferences() async {
    await PreferencesService.saveAllInterruptionPrefs(_enabled);
    if (!mounted) return;
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

  Future<void> _previewType(String typeKey) async {
    setState(() => _testingType = typeKey);
    try {
      await OverlayService.showOverlay(type: typeKey);
      // Auto-dismiss after 5 seconds
      await Future.delayed(const Duration(seconds: 5));
      await OverlayService.hideOverlay();
    } catch (_) {
      // Permission not granted or service error
      if (mounted) {
        ScaffoldMessenger.of(context).showSnackBar(
          SnackBar(
            content: const Text('Grant overlay permission first'),
            backgroundColor: Colors.red.shade400,
            behavior: SnackBarBehavior.floating,
            shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(12)),
          ),
        );
      }
    }
    if (mounted) setState(() => _testingType = null);
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
      case 'vibrate_pulse': return Icons.vibration;
      case 'timer_overlay': return Icons.timer;
      case 'shame_counter': return Icons.countertops;
      case 'quiz_gate': return Icons.quiz;
      case 'force_rotate': return Icons.screen_rotation;
      case 'volume_zero': return Icons.volume_off;
      case 'close_app': return Icons.close;
      case 'screen_shake': return Icons.vibration;
      case 'progressive_dim': return Icons.brightness_2;
      case 'glitch_effect': return Icons.broken_image;
      case 'screen_shrink': return Icons.crop;
      case 'random_popup': return Icons.chat_bubble;
      case 'earthquake': return Icons.landslide;
      default: return Icons.extension;
    }
  }

  static const _blue = Color(0xFF3A86FF);

  Color _getColorForType(String key) {
    switch (key) {
      // Visual / screen-based interruptions → teal
      case 'black_screen':
      case 'blur_screen':
      case 'half_block':
      case 'tint':
      case 'grayscale':
      case 'invert_colors':
      case 'flicker':
      case 'progressive_dim':
      case 'glitch_effect':
      case 'screen_shrink':
      case 'pixel_rain':
      case 'static_noise':
      case 'fly':
      case 'warning':
      case 'random_popup':
      case 'loading':
      case 'timer_overlay':
      case 'shame_counter':
      case 'quiz_gate':
        return _teal;
      // Input / system-level interruptions → blue
      case 'mistouch':
      case 'delayed_touch':
      case 'swapped_touch':
      case 'status_bar':
      case 'brightness_zero':
      case 'lock_screen':
      case 'volume_zero':
      case 'vibrate_pulse':
      case 'force_rotate':
      case 'screen_shake':
      case 'earthquake':
      case 'close_app':
        return _blue;
      default:
        return _teal;
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
                      if (allOn) {
                        // Can't disable all — keep first 5 enabled
                        ScaffoldMessenger.of(context).showSnackBar(
                          SnackBar(
                            content: const Text('Minimum 5 interruptions must stay enabled'),
                            backgroundColor: Colors.orange.shade600,
                            behavior: SnackBarBehavior.floating,
                            shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(12)),
                            duration: const Duration(seconds: 2),
                          ),
                        );
                        return;
                      }
                      setState(() {
                        for (final key in _enabled.keys) {
                          _enabled[key] = true;
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
                  final isTesting = _testingType == key;

                  return Container(
                    margin: const EdgeInsets.only(bottom: 10),
                    padding: const EdgeInsets.all(16),
                    decoration: BoxDecoration(
                      color: enabled ? _cardColor : Colors.white,
                      borderRadius: BorderRadius.circular(16),
                      border: Border.all(
                        color: isTesting
                            ? _teal
                            : enabled
                                ? color.withValues(alpha: 0.2)
                                : _borderColor,
                        width: isTesting ? 2 : 1,
                      ),
                      boxShadow: [
                        BoxShadow(
                          color: Colors.black.withValues(alpha: 0.02),
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
                            color: (enabled ? color : Colors.grey.shade300).withValues(alpha: 0.12),
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
                        // Preview button
                        GestureDetector(
                          onTap: _testingType != null
                              ? null
                              : () => _previewType(key),
                          child: Container(
                            width: 32,
                            height: 32,
                            margin: const EdgeInsets.only(right: 8),
                            decoration: BoxDecoration(
                              color: isTesting
                                  ? _teal.withValues(alpha: 0.15)
                                  : Colors.grey.shade100,
                              borderRadius: BorderRadius.circular(8),
                            ),
                            child: isTesting
                                ? const SizedBox(
                                    width: 16,
                                    height: 16,
                                    child: Center(
                                      child: SizedBox(
                                        width: 14,
                                        height: 14,
                                        child: CircularProgressIndicator(
                                          strokeWidth: 2,
                                          color: _teal,
                                        ),
                                      ),
                                    ),
                                  )
                                : Icon(
                                    Icons.play_arrow,
                                    size: 16,
                                    color: Colors.grey.shade500,
                                  ),
                          ),
                        ),
                        // Toggle switch
                        SizedBox(
                          height: 28,
                          child: Switch(
                            value: enabled,
                            onChanged: (v) {
                              // Enforce minimum 5 enabled
                              if (!v && _enabledCount <= 5) {
                                ScaffoldMessenger.of(context).showSnackBar(
                                  SnackBar(
                                    content: const Text('Minimum 5 interruptions must stay enabled'),
                                    backgroundColor: Colors.orange.shade600,
                                    behavior: SnackBarBehavior.floating,
                                    shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(12)),
                                    duration: const Duration(seconds: 2),
                                  ),
                                );
                                return;
                              }
                              setState(() => _enabled[key] = v);
                            },
                            activeThumbColor: color,
                            activeTrackColor: color.withValues(alpha: 0.3),
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

import 'package:flutter/material.dart';
import '../core/constants.dart';
import '../services/overlay_service.dart';
import '../services/usage_stats_service.dart';
import '../services/preferences_service.dart';

class DebugScreen extends StatefulWidget {
  const DebugScreen({super.key});

  @override
  State<DebugScreen> createState() => _DebugScreenState();
}

class _DebugScreenState extends State<DebugScreen>
    with WidgetsBindingObserver {
  static const _teal = Color(0xFF2DD4BF);
  static const _charcoal = Color(0xFF101018);
  static const _bgColor = Color(0xFFF2F2F2);
  static const _textMuted = Color(0xFF6B7280);
  static const _borderColor = Color(0xFFE5E7EB);
  static const _cardColor = Color(0xFFF9FAFB);
  static const _rose = Color(0xFFE17070);

  // Permission states
  bool _usagePerm = false;
  bool _overlayPerm = false;
  bool _writeSettingsPerm = false;
  bool _deviceAdminPerm = false;

  // Real-time usage
  String _foregroundApp = '-';
  int _todayScreenTime = 0;

  // Test state
  String? _activeOverlay;
  bool _cycleRunning = false;

  @override
  void initState() {
    super.initState();
    WidgetsBinding.instance.addObserver(this);
    _refreshAll();
  }

  @override
  void dispose() {
    WidgetsBinding.instance.removeObserver(this);
    super.dispose();
  }

  @override
  void didChangeAppLifecycleState(AppLifecycleState state) {
    if (state == AppLifecycleState.resumed) _refreshAll();
  }

  Future<void> _refreshAll() async {
    final usage = await UsageStatsService.hasUsagePermission();
    final overlay = await OverlayService.hasOverlayPermission();
    final write = await OverlayService.hasWriteSettingsPermission();
    final admin = await OverlayService.hasDeviceAdminPermission();

    String fg = '-';
    int st = 0;
    if (usage) {
      fg = await UsageStatsService.getForegroundApp();
      st = await UsageStatsService.getTodayScreenTime();
    }

    if (mounted) {
      setState(() {
        _usagePerm = usage;
        _overlayPerm = overlay;
        _writeSettingsPerm = write;
        _deviceAdminPerm = admin;
        _foregroundApp = fg.isNotEmpty ? fg : '-';
        _todayScreenTime = st;
      });
    }
  }

  Future<void> _testOverlay(String type) async {
    setState(() => _activeOverlay = type);
    await OverlayService.showOverlay(type: type);
    await Future.delayed(const Duration(seconds: 5));
    await OverlayService.hideOverlay();
    if (mounted) setState(() => _activeOverlay = null);
  }

  Future<void> _testCycle() async {
    final enabled = PreferencesService.getEnabledInterruptionTypes();
    if (enabled.isEmpty) {
      _showSnack('No interruptions enabled', Colors.red.shade400);
      return;
    }
    setState(() => _cycleRunning = true);
    await OverlayService.startCycle(enabled);
    // Cycle runs until stopped
  }

  Future<void> _stopAll() async {
    await OverlayService.stopAll();
    if (mounted) {
      setState(() {
        _activeOverlay = null;
        _cycleRunning = false;
      });
    }
  }

  void _showSnack(String msg, Color color) {
    ScaffoldMessenger.of(context).showSnackBar(
      SnackBar(
        content: Text(msg),
        backgroundColor: color,
        behavior: SnackBarBehavior.floating,
        shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(12)),
      ),
    );
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
                      'DEBUG TOOLS',
                      textAlign: TextAlign.center,
                      style: TextStyle(
                        fontSize: 15,
                        fontWeight: FontWeight.w600,
                        letterSpacing: 1.2,
                        color: _charcoal,
                      ),
                    ),
                  ),
                  GestureDetector(
                    onTap: _refreshAll,
                    child: Container(
                      width: 40,
                      height: 40,
                      alignment: Alignment.center,
                      child: const Icon(Icons.refresh, color: _charcoal, size: 22),
                    ),
                  ),
                ],
              ),
            ),

            Expanded(
              child: ListView(
                padding: const EdgeInsets.symmetric(horizontal: 16),
                children: [
                  const SizedBox(height: 8),

                  // --- PERMISSION STATUS ---
                  _sectionHeader('PERMISSIONS'),
                  const SizedBox(height: 10),
                  _permRow('Usage Stats', _usagePerm, () => UsageStatsService.requestUsagePermission()),
                  _permRow('Overlay', _overlayPerm, () => OverlayService.requestOverlayPermission()),
                  _permRow('Write Settings', _writeSettingsPerm, () => OverlayService.requestWriteSettingsPermission()),
                  _permRow('Device Admin', _deviceAdminPerm, () => OverlayService.requestDeviceAdminPermission()),
                  const SizedBox(height: 20),

                  // --- REAL-TIME USAGE ---
                  _sectionHeader('LIVE USAGE'),
                  const SizedBox(height: 10),
                  _buildCard(
                    child: Column(
                      children: [
                        _infoRow('Foreground App', _foregroundApp),
                        const Divider(height: 16, color: _borderColor),
                        _infoRow('Today Screen Time', '${_todayScreenTime}m (${_todayScreenTime ~/ 60}h ${_todayScreenTime % 60}m)'),
                      ],
                    ),
                  ),
                  const SizedBox(height: 20),

                  // --- SERVICE CONTROLS ---
                  _sectionHeader('SERVICES'),
                  const SizedBox(height: 10),
                  Row(
                    children: [
                      Expanded(
                        child: _actionButton(
                          'Start Tracking',
                          Icons.play_arrow,
                          _teal,
                          () async {
                            await UsageStatsService.startTracking();
                            _showSnack('Tracking started', _teal);
                          },
                        ),
                      ),
                      const SizedBox(width: 12),
                      Expanded(
                        child: _actionButton(
                          'Stop Tracking',
                          Icons.stop,
                          _rose,
                          () async {
                            await UsageStatsService.stopTracking();
                            _showSnack('Tracking stopped', _rose);
                          },
                        ),
                      ),
                    ],
                  ),
                  const SizedBox(height: 12),
                  Row(
                    children: [
                      Expanded(
                        child: _actionButton(
                          _cycleRunning ? 'Cycling...' : 'Test Cycle',
                          _cycleRunning ? Icons.sync : Icons.loop,
                          const Color(0xFF3A86FF),
                          _cycleRunning ? null : _testCycle,
                        ),
                      ),
                      const SizedBox(width: 12),
                      Expanded(
                        child: _actionButton(
                          'Stop All',
                          Icons.cancel,
                          _rose,
                          _stopAll,
                        ),
                      ),
                    ],
                  ),
                  const SizedBox(height: 20),

                  // --- TEST INDIVIDUAL OVERLAYS ---
                  _sectionHeader('TEST OVERLAYS'),
                  const SizedBox(height: 4),
                  Text(
                    'Tap to preview for 5 seconds',
                    style: TextStyle(fontSize: 11, color: Colors.grey.shade400),
                  ),
                  const SizedBox(height: 10),

                  Wrap(
                    spacing: 8,
                    runSpacing: 8,
                    children: types.map((entry) {
                      final key = entry.key;
                      final name = entry.value['name'] ?? key;
                      final isActive = _activeOverlay == key;

                      return GestureDetector(
                        onTap: _activeOverlay != null ? null : () => _testOverlay(key),
                        child: Container(
                          padding: const EdgeInsets.symmetric(horizontal: 12, vertical: 8),
                          decoration: BoxDecoration(
                            color: isActive ? _teal.withOpacity(0.15) : Colors.white,
                            borderRadius: BorderRadius.circular(10),
                            border: Border.all(
                              color: isActive ? _teal : _borderColor,
                              width: isActive ? 2 : 1,
                            ),
                          ),
                          child: Row(
                            mainAxisSize: MainAxisSize.min,
                            children: [
                              if (isActive)
                                const SizedBox(
                                  width: 12,
                                  height: 12,
                                  child: CircularProgressIndicator(strokeWidth: 2, color: _teal),
                                )
                              else
                                Icon(Icons.play_arrow, size: 14, color: Colors.grey.shade500),
                              const SizedBox(width: 6),
                              Text(
                                name,
                                style: TextStyle(
                                  fontSize: 11,
                                  fontWeight: FontWeight.w500,
                                  color: isActive ? _teal : _charcoal,
                                ),
                              ),
                            ],
                          ),
                        ),
                      );
                    }).toList(),
                  ),
                  const SizedBox(height: 32),
                ],
              ),
            ),
          ],
        ),
      ),
    );
  }

  Widget _sectionHeader(String title) {
    return Text(
      title,
      style: const TextStyle(
        fontSize: 11,
        fontWeight: FontWeight.w600,
        letterSpacing: 1.5,
        color: _textMuted,
      ),
    );
  }

  Widget _permRow(String label, bool granted, VoidCallback onRequest) {
    return Padding(
      padding: const EdgeInsets.only(bottom: 8),
      child: Row(
        children: [
          Container(
            width: 10,
            height: 10,
            decoration: BoxDecoration(
              color: granted ? _teal : _rose,
              shape: BoxShape.circle,
            ),
          ),
          const SizedBox(width: 12),
          Expanded(
            child: Text(
              label,
              style: const TextStyle(fontSize: 13, fontWeight: FontWeight.w500, color: _charcoal),
            ),
          ),
          if (!granted)
            GestureDetector(
              onTap: onRequest,
              child: Container(
                padding: const EdgeInsets.symmetric(horizontal: 10, vertical: 4),
                decoration: BoxDecoration(
                  color: _teal,
                  borderRadius: BorderRadius.circular(6),
                ),
                child: const Text('Grant', style: TextStyle(fontSize: 11, fontWeight: FontWeight.w600, color: Colors.white)),
              ),
            )
          else
            const Text('Granted', style: TextStyle(fontSize: 11, fontWeight: FontWeight.w500, color: _teal)),
        ],
      ),
    );
  }

  Widget _buildCard({required Widget child}) {
    return Container(
      padding: const EdgeInsets.all(16),
      decoration: BoxDecoration(
        color: _cardColor,
        borderRadius: BorderRadius.circular(16),
        border: Border.all(color: _borderColor),
        boxShadow: [
          BoxShadow(
            color: Colors.black.withOpacity(0.03),
            blurRadius: 6,
            offset: const Offset(0, 2),
          ),
        ],
      ),
      child: child,
    );
  }

  Widget _infoRow(String label, String value) {
    return Row(
      children: [
        Text(label, style: const TextStyle(fontSize: 12, color: _textMuted)),
        const Spacer(),
        Flexible(
          child: Text(
            value,
            style: const TextStyle(fontSize: 12, fontWeight: FontWeight.w600, color: _charcoal),
            overflow: TextOverflow.ellipsis,
          ),
        ),
      ],
    );
  }

  Widget _actionButton(String label, IconData icon, Color color, VoidCallback? onTap) {
    return GestureDetector(
      onTap: onTap,
      child: Container(
        padding: const EdgeInsets.symmetric(vertical: 14),
        decoration: BoxDecoration(
          color: onTap != null ? color.withOpacity(0.1) : Colors.grey.shade100,
          borderRadius: BorderRadius.circular(14),
          border: Border.all(color: onTap != null ? color.withOpacity(0.2) : _borderColor),
        ),
        child: Row(
          mainAxisAlignment: MainAxisAlignment.center,
          children: [
            Icon(icon, size: 18, color: onTap != null ? color : Colors.grey.shade400),
            const SizedBox(width: 6),
            Text(
              label,
              style: TextStyle(
                fontSize: 12,
                fontWeight: FontWeight.w600,
                color: onTap != null ? color : Colors.grey.shade400,
              ),
            ),
          ],
        ),
      ),
    );
  }
}

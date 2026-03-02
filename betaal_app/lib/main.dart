import 'package:flutter/material.dart';
import 'services/usage_stats_service.dart';
import 'services/overlay_service.dart';
import 'services/stealth_service.dart';

void main() {
  runApp(const BetaalTestApp());
}

class BetaalTestApp extends StatelessWidget {
  const BetaalTestApp({super.key});

  @override
  Widget build(BuildContext context) {
    return MaterialApp(
      title: 'Betaal AI — Phase 1 Test',
      theme: ThemeData(useMaterial3: true),
      home: const NativeModuleTestScreen(),
    );
  }
}

class NativeModuleTestScreen extends StatefulWidget {
  const NativeModuleTestScreen({super.key});

  @override
  State<NativeModuleTestScreen> createState() => _NativeModuleTestScreenState();
}

class _NativeModuleTestScreenState extends State<NativeModuleTestScreen> {
  String _log = 'Tap buttons to test native modules\n';
  bool _trackingActive = false;

  void _addLog(String message) {
    setState(() {
      _log += '\n${TimeOfDay.now().format(context)}: $message';
    });
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(title: const Text('Betaal AI — Phase 1')),
      body: Column(
        children: [
          Expanded(
            child: SingleChildScrollView(
              padding: const EdgeInsets.all(16),
              child: Text(_log, style: const TextStyle(fontFamily: 'monospace', fontSize: 13)),
            ),
          ),
          const Divider(height: 1),
          _buildButtonGrid(),
        ],
      ),
    );
  }

  Widget _buildButtonGrid() {
    return Padding(
      padding: const EdgeInsets.all(12),
      child: Column(
        children: [
          // Usage Tracking
          const Text('USAGE TRACKING', style: TextStyle(fontWeight: FontWeight.bold, fontSize: 12)),
          const SizedBox(height: 8),
          Row(
            children: [
              _btn('Check Permission', () async {
                final has = await UsageStatsService.hasUsagePermission();
                _addLog('Usage permission: $has');
              }),
              _btn('Request Permission', () async {
                await UsageStatsService.requestUsagePermission();
                _addLog('Opened usage permission settings');
              }),
            ],
          ),
          Row(
            children: [
              _btn(_trackingActive ? 'Stop Tracking' : 'Start Tracking', () async {
                if (_trackingActive) {
                  await UsageStatsService.stopTracking();
                  _addLog('Tracking STOPPED');
                } else {
                  await UsageStatsService.startTracking();
                  _addLog('Tracking STARTED');
                }
                setState(() => _trackingActive = !_trackingActive);
              }),
              _btn('Foreground App', () async {
                final app = await UsageStatsService.getForegroundApp();
                _addLog('Foreground: $app');
              }),
            ],
          ),
          Row(
            children: [
              _btn('Screen Time', () async {
                final mins = await UsageStatsService.getTodayScreenTime();
                _addLog('Today: ${mins}min');
              }),
              _btn('App Usage', () async {
                final usage = await UsageStatsService.getTodayAppUsage();
                final top5 = (usage.entries.toList()
                  ..sort((a, b) => b.value.compareTo(a.value)))
                    .take(5);
                for (var e in top5) {
                  _addLog('  ${e.key.split('.').last}: ${e.value}min');
                }
              }),
            ],
          ),
          const SizedBox(height: 12),

          // Overlay
          const Text('OVERLAY', style: TextStyle(fontWeight: FontWeight.bold, fontSize: 12)),
          const SizedBox(height: 8),
          Row(
            children: [
              _btn('Check Permission', () async {
                final has = await OverlayService.hasOverlayPermission();
                _addLog('Overlay permission: $has');
              }),
              _btn('Request Permission', () async {
                await OverlayService.requestOverlayPermission();
                _addLog('Opened overlay permission settings');
              }),
            ],
          ),
          Row(
            children: [
              _btn('Black Overlay', () async {
                await OverlayService.showOverlay(
                  type: 'black',
                  message: 'Put your phone down!',
                  intensity: 0.9,
                );
                _addLog('Black overlay shown');
                // Auto-hide after 3 seconds
                Future.delayed(const Duration(seconds: 3), () async {
                  await OverlayService.hideOverlay();
                  _addLog('Overlay hidden (auto)');
                });
              }),
              _btn('Blur Overlay', () async {
                await OverlayService.showOverlay(
                  type: 'blur',
                  message: 'Time for a break!',
                  intensity: 0.7,
                );
                _addLog('Blur overlay shown');
                Future.delayed(const Duration(seconds: 3), () async {
                  await OverlayService.hideOverlay();
                  _addLog('Overlay hidden (auto)');
                });
              }),
            ],
          ),
          Row(
            children: [
              _btn('Hide Overlay', () async {
                await OverlayService.hideOverlay();
                _addLog('Overlay hidden');
              }),
              const Spacer(),
            ],
          ),
          const SizedBox(height: 12),

          // Stealth Mode
          const Text('STEALTH MODE', style: TextStyle(fontWeight: FontWeight.bold, fontSize: 12)),
          const SizedBox(height: 8),
          Row(
            children: [
              _btn('Current Mode', () async {
                final mode = await StealthService.getCurrentMode();
                _addLog('Stealth mode: $mode');
              }),
              _btn('Calculator', () async {
                await StealthService.setStealthMode('calculator');
                _addLog('Stealth → Calculator');
              }),
            ],
          ),
          Row(
            children: [
              _btn('Notes', () async {
                await StealthService.setStealthMode('notes');
                _addLog('Stealth → Notes');
              }),
              _btn('Default', () async {
                await StealthService.setStealthMode('default');
                _addLog('Stealth → Default');
              }),
            ],
          ),
        ],
      ),
    );
  }

  Widget _btn(String label, VoidCallback onPressed) {
    return Expanded(
      child: Padding(
        padding: const EdgeInsets.all(4),
        child: ElevatedButton(
          onPressed: onPressed,
          style: ElevatedButton.styleFrom(
            padding: const EdgeInsets.symmetric(vertical: 10),
            textStyle: const TextStyle(fontSize: 12),
          ),
          child: Text(label, textAlign: TextAlign.center),
        ),
      ),
    );
  }
}

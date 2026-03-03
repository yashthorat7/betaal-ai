import 'package:flutter/material.dart';
import 'package:provider/provider.dart';
import '../providers/auth_provider.dart';
import '../services/usage_stats_service.dart';
import '../services/overlay_service.dart';
import '../services/preferences_service.dart';

class OnboardingScreen extends StatefulWidget {
  const OnboardingScreen({super.key});

  @override
  State<OnboardingScreen> createState() => _OnboardingScreenState();
}

class _OnboardingScreenState extends State<OnboardingScreen>
    with WidgetsBindingObserver {
  static const _teal = Color(0xFF2DD4BF);
  static const _charcoal = Color(0xFF101018);
  static const _bgColor = Color(0xFFF2F2F2);
  static const _textMuted = Color(0xFF6B7280);

  final _pageController = PageController();
  int _currentPage = 0;

  // Step 1
  final _nameController = TextEditingController(text: 'Arjun');
  int _age = 19;

  // Step 2
  int _addictionLevel = 8;

  // Step 3
  int _strictness = 3;

  // Step 4 — real permission states
  bool _usagePerm = false;
  bool _overlayPerm = false;
  bool _writeSettingsPerm = false;

  int get _rehabDays {
    final days = _addictionLevel * 3 * (6 - _strictness);
    return days.clamp(7, 90);
  }

  @override
  void initState() {
    super.initState();
    WidgetsBinding.instance.addObserver(this);
    _checkPermissions();
  }

  @override
  void dispose() {
    WidgetsBinding.instance.removeObserver(this);
    _nameController.dispose();
    _pageController.dispose();
    super.dispose();
  }

  // Re-check permissions when user returns from system settings
  @override
  void didChangeAppLifecycleState(AppLifecycleState state) {
    if (state == AppLifecycleState.resumed) {
      _checkPermissions();
    }
  }

  Future<void> _checkPermissions() async {
    final usage = await UsageStatsService.hasUsagePermission();
    final overlay = await OverlayService.hasOverlayPermission();
    final writeSettings = await OverlayService.hasWriteSettingsPermission();
    if (mounted) {
      setState(() {
        _usagePerm = usage;
        _overlayPerm = overlay;
        _writeSettingsPerm = writeSettings;
      });
    }
  }

  void _next() {
    if (_currentPage < 3) {
      _pageController.nextPage(
        duration: const Duration(milliseconds: 300),
        curve: Curves.easeInOut,
      );
    } else {
      // Save preferences
      PreferencesService.setAddictionLevel(_addictionLevel);
      PreferencesService.setStrictness(_strictness);
      PreferencesService.setOnboardingDone(true);

      context.read<AuthProvider>().completeOnboarding(
            name: _nameController.text,
            age: _age,
            addictionLevel: _addictionLevel,
            strictness: _strictness,
          );
      Navigator.pushReplacementNamed(context, '/main');
    }
  }

  void _back() {
    if (_currentPage > 0) {
      _pageController.previousPage(
        duration: const Duration(milliseconds: 300),
        curve: Curves.easeInOut,
      );
    }
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: _bgColor,
      body: SafeArea(
        child: Column(
          children: [
            // --- Progress dots ---
            Padding(
              padding: const EdgeInsets.fromLTRB(24, 24, 24, 0),
              child: Row(
                children: List.generate(4, (i) {
                  final active = i <= _currentPage;
                  return Expanded(
                    child: Container(
                      height: 4,
                      margin: EdgeInsets.only(right: i < 3 ? 8 : 0),
                      decoration: BoxDecoration(
                        color: active ? _teal : Colors.grey.shade300,
                        borderRadius: BorderRadius.circular(999),
                      ),
                    ),
                  );
                }),
              ),
            ),
            const SizedBox(height: 8),

            // --- Pages ---
            Expanded(
              child: PageView(
                controller: _pageController,
                physics: const NeverScrollableScrollPhysics(),
                onPageChanged: (i) => setState(() => _currentPage = i),
                children: [_step1(), _step2(), _step3(), _step4()],
              ),
            ),

            // --- Bottom buttons ---
            Padding(
              padding: const EdgeInsets.fromLTRB(24, 8, 24, 24),
              child: Row(
                children: [
                  if (_currentPage > 0)
                    GestureDetector(
                      onTap: _back,
                      child: Container(
                        width: 48,
                        height: 48,
                        decoration: BoxDecoration(
                          color: Colors.white,
                          borderRadius: BorderRadius.circular(14),
                          border: Border.all(color: Colors.grey.shade200),
                        ),
                        child: const Icon(Icons.arrow_back, color: _charcoal, size: 20),
                      ),
                    ),
                  const Spacer(),
                  GestureDetector(
                    onTap: _next,
                    child: Container(
                      height: 48,
                      padding: const EdgeInsets.symmetric(horizontal: 28),
                      decoration: BoxDecoration(
                        color: _teal,
                        borderRadius: BorderRadius.circular(14),
                        boxShadow: [
                          BoxShadow(
                            color: _teal.withOpacity(0.3),
                            blurRadius: 10,
                            offset: const Offset(0, 4),
                          ),
                        ],
                      ),
                      child: Row(
                        mainAxisSize: MainAxisSize.min,
                        children: [
                          Text(
                            _currentPage == 3 ? 'Start' : 'Next',
                            style: const TextStyle(
                              fontSize: 15,
                              fontWeight: FontWeight.w600,
                              color: Colors.white,
                            ),
                          ),
                          const SizedBox(width: 8),
                          Icon(
                            _currentPage == 3 ? Icons.check : Icons.arrow_forward,
                            color: Colors.white,
                            size: 18,
                          ),
                        ],
                      ),
                    ),
                  ),
                ],
              ),
            ),
          ],
        ),
      ),
    );
  }

  Widget _step1() {
    return Padding(
      padding: const EdgeInsets.all(24),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          const Text(
            "Let's start\nwith you",
            style: TextStyle(
              fontSize: 28,
              fontWeight: FontWeight.w700,
              color: _charcoal,
              height: 1.2,
            ),
          ),
          const SizedBox(height: 32),
          Container(
            padding: const EdgeInsets.symmetric(horizontal: 16),
            decoration: BoxDecoration(
              color: Colors.white,
              borderRadius: BorderRadius.circular(14),
              border: Border.all(color: Colors.grey.shade200),
            ),
            child: TextField(
              controller: _nameController,
              style: const TextStyle(fontSize: 15, color: _charcoal),
              decoration: const InputDecoration(
                labelText: 'Your name',
                labelStyle: TextStyle(color: _textMuted),
                border: InputBorder.none,
              ),
            ),
          ),
          const SizedBox(height: 24),
          const Text('Age', style: TextStyle(fontSize: 14, fontWeight: FontWeight.w500, color: _textMuted)),
          const SizedBox(height: 12),
          Row(
            mainAxisAlignment: MainAxisAlignment.center,
            children: [
              _circleButton(Icons.remove, () { if (_age > 10) setState(() => _age--); }),
              Padding(
                padding: const EdgeInsets.symmetric(horizontal: 28),
                child: Text('$_age', style: const TextStyle(fontSize: 36, fontWeight: FontWeight.w300, color: _charcoal)),
              ),
              _circleButton(Icons.add, () { if (_age < 99) setState(() => _age++); }),
            ],
          ),
        ],
      ),
    );
  }

  Widget _step2() {
    final emojis = ['😊', '😐', '😰', '😫', '🤯', '💀', '☠️', '🔥', '⚡', '💣'];
    return Padding(
      padding: const EdgeInsets.all(24),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          const Text(
            'How addicted\nare you?',
            style: TextStyle(fontSize: 28, fontWeight: FontWeight.w700, color: _charcoal, height: 1.2),
          ),
          const SizedBox(height: 8),
          const Text('Be honest — it helps us build your plan', style: TextStyle(color: _textMuted, fontSize: 13)),
          const SizedBox(height: 40),
          Center(child: Text(emojis[_addictionLevel - 1], style: const TextStyle(fontSize: 64))),
          const SizedBox(height: 12),
          Center(
            child: Text(
              '$_addictionLevel / 10',
              style: const TextStyle(fontSize: 28, fontWeight: FontWeight.w300, color: _charcoal),
            ),
          ),
          const SizedBox(height: 20),
          SliderTheme(
            data: SliderThemeData(
              activeTrackColor: _teal,
              inactiveTrackColor: Colors.grey.shade200,
              thumbColor: _teal,
              overlayColor: _teal.withOpacity(0.1),
              trackHeight: 4,
              thumbShape: const RoundSliderThumbShape(enabledThumbRadius: 10),
            ),
            child: Slider(
              value: _addictionLevel.toDouble(),
              min: 1, max: 10, divisions: 9,
              onChanged: (v) => setState(() => _addictionLevel = v.round()),
            ),
          ),
        ],
      ),
    );
  }

  Widget _step3() {
    return Padding(
      padding: const EdgeInsets.all(24),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          const Text(
            'How strict\nshould we be?',
            style: TextStyle(fontSize: 28, fontWeight: FontWeight.w700, color: _charcoal, height: 1.2),
          ),
          const SizedBox(height: 8),
          const Text('Higher = shorter but harder rehab', style: TextStyle(color: _textMuted, fontSize: 13)),
          const SizedBox(height: 40),
          Center(
            child: Text(
              '$_strictness / 5',
              style: const TextStyle(fontSize: 28, fontWeight: FontWeight.w300, color: _charcoal),
            ),
          ),
          const SizedBox(height: 20),
          SliderTheme(
            data: SliderThemeData(
              activeTrackColor: _teal,
              inactiveTrackColor: Colors.grey.shade200,
              thumbColor: _teal,
              overlayColor: _teal.withOpacity(0.1),
              trackHeight: 4,
              thumbShape: const RoundSliderThumbShape(enabledThumbRadius: 10),
            ),
            child: Slider(
              value: _strictness.toDouble(),
              min: 1, max: 5, divisions: 4,
              onChanged: (v) => setState(() => _strictness = v.round()),
            ),
          ),
          const SizedBox(height: 32),
          Container(
            width: double.infinity,
            padding: const EdgeInsets.all(20),
            decoration: BoxDecoration(
              color: _teal.withOpacity(0.06),
              borderRadius: BorderRadius.circular(20),
              border: Border.all(color: _teal.withOpacity(0.15)),
            ),
            child: Column(
              children: [
                const Text('Your rehab plan', style: TextStyle(fontWeight: FontWeight.w500, color: _textMuted, fontSize: 12)),
                const SizedBox(height: 8),
                Text('$_rehabDays days', style: const TextStyle(fontSize: 36, fontWeight: FontWeight.w300, color: _charcoal)),
              ],
            ),
          ),
        ],
      ),
    );
  }

  Widget _step4() {
    return Padding(
      padding: const EdgeInsets.all(24),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          const Text(
            'Grant\npermissions',
            style: TextStyle(fontSize: 28, fontWeight: FontWeight.w700, color: _charcoal, height: 1.2),
          ),
          const SizedBox(height: 8),
          const Text('Betaal needs these to protect you', style: TextStyle(color: _textMuted, fontSize: 13)),
          const SizedBox(height: 28),

          // Usage Access
          _permissionTile(
            icon: Icons.bar_chart,
            title: 'Usage Access',
            subtitle: 'Track which apps you use and for how long',
            granted: _usagePerm,
            onTap: () async {
              if (!_usagePerm) {
                await UsageStatsService.requestUsagePermission();
              }
            },
          ),
          const SizedBox(height: 12),

          // Display Over Apps
          _permissionTile(
            icon: Icons.layers,
            title: 'Display Over Apps',
            subtitle: 'Show distraction overlays on any app',
            granted: _overlayPerm,
            onTap: () async {
              if (!_overlayPerm) {
                await OverlayService.requestOverlayPermission();
              }
            },
          ),
          const SizedBox(height: 12),

          // Write Settings
          _permissionTile(
            icon: Icons.settings_brightness,
            title: 'Modify Settings',
            subtitle: 'Control brightness and rotation for distractions',
            granted: _writeSettingsPerm,
            onTap: () async {
              if (!_writeSettingsPerm) {
                await OverlayService.requestWriteSettingsPermission();
              }
            },
          ),
          const SizedBox(height: 20),

          // Info note
          Container(
            padding: const EdgeInsets.all(14),
            decoration: BoxDecoration(
              color: Colors.amber.shade50,
              borderRadius: BorderRadius.circular(12),
              border: Border.all(color: Colors.amber.shade200),
            ),
            child: Row(
              children: [
                Icon(Icons.info_outline, size: 18, color: Colors.amber.shade700),
                const SizedBox(width: 10),
                Expanded(
                  child: Text(
                    'You can grant these later in Personalize. Some distractions may not work without permissions.',
                    style: TextStyle(fontSize: 11, color: Colors.amber.shade800, height: 1.4),
                  ),
                ),
              ],
            ),
          ),
        ],
      ),
    );
  }

  Widget _permissionTile({
    required IconData icon,
    required String title,
    required String subtitle,
    required bool granted,
    required VoidCallback onTap,
  }) {
    return GestureDetector(
      onTap: granted ? null : onTap,
      child: Container(
        padding: const EdgeInsets.all(16),
        decoration: BoxDecoration(
          color: granted ? _teal.withOpacity(0.06) : Colors.white,
          borderRadius: BorderRadius.circular(16),
          border: Border.all(color: granted ? _teal.withOpacity(0.2) : Colors.grey.shade200),
        ),
        child: Row(
          children: [
            Container(
              width: 40,
              height: 40,
              decoration: BoxDecoration(
                color: (granted ? _teal : Colors.grey.shade300).withOpacity(0.15),
                borderRadius: BorderRadius.circular(12),
              ),
              child: Icon(icon, size: 20, color: granted ? _teal : Colors.grey.shade500),
            ),
            const SizedBox(width: 14),
            Expanded(
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  Text(
                    title,
                    style: TextStyle(
                      fontSize: 14,
                      fontWeight: FontWeight.w600,
                      color: granted ? _charcoal : _charcoal,
                    ),
                  ),
                  const SizedBox(height: 2),
                  Text(subtitle, style: const TextStyle(fontSize: 11, color: _textMuted)),
                ],
              ),
            ),
            const SizedBox(width: 8),
            if (granted)
              Container(
                width: 28,
                height: 28,
                decoration: BoxDecoration(
                  color: _teal.withOpacity(0.15),
                  shape: BoxShape.circle,
                ),
                child: const Icon(Icons.check, size: 16, color: _teal),
              )
            else
              Container(
                padding: const EdgeInsets.symmetric(horizontal: 12, vertical: 6),
                decoration: BoxDecoration(
                  color: _teal,
                  borderRadius: BorderRadius.circular(8),
                ),
                child: const Text(
                  'Grant',
                  style: TextStyle(fontSize: 12, fontWeight: FontWeight.w600, color: Colors.white),
                ),
              ),
          ],
        ),
      ),
    );
  }

  Widget _circleButton(IconData icon, VoidCallback onTap) {
    return GestureDetector(
      onTap: onTap,
      child: Container(
        width: 44,
        height: 44,
        decoration: BoxDecoration(
          color: Colors.white,
          shape: BoxShape.circle,
          border: Border.all(color: Colors.grey.shade200),
          boxShadow: [
            BoxShadow(
              color: Colors.black.withOpacity(0.04),
              blurRadius: 4,
              offset: const Offset(0, 2),
            ),
          ],
        ),
        child: Icon(icon, size: 20, color: _charcoal),
      ),
    );
  }
}

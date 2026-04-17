import 'dart:math';
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
    with WidgetsBindingObserver, TickerProviderStateMixin {
  static const _teal = Color(0xFF2DD4BF);
  static const _charcoal = Color(0xFF333333);
  static const _bgColor = Color(0xFFF4F4F4);
  static const _textMuted = Color(0xFF666666);
  static const _borderColor = Color(0xFFCCCCCC);

  final _pageController = PageController();
  int _currentPage = 0;

  // Step 1
  final _nameController = TextEditingController();
  int _age = 19;
  String? _nameError;

  // Step 2
  int _addictionLevel = 7;
  late AnimationController _pulseAnimController;
  late Animation<double> _pulseAnim;
  double _currentAddiction = 7.0;

  // Step 3
  int _strictness = 3;

  // Step 5 — permissions
  bool _usagePerm = false;
  bool _overlayPerm = false;
  bool _writeSettingsPerm = false;
  bool _deviceAdminPerm = false;

  int get _rehabDays {
    final days = _addictionLevel * 3 * (6 - _strictness);
    return days.clamp(7, 90);
  }

  @override
  void initState() {
    super.initState();
    WidgetsBinding.instance.addObserver(this);
    _checkPermissions();
    _nameController.addListener(() {
      if (_nameError != null && _nameController.text.trim().isNotEmpty) {
        setState(() => _nameError = null);
      }
      setState(() {}); // rebuild to update button state
    });

    _pulseAnimController = AnimationController(
      vsync: this,
      duration: const Duration(seconds: 2),
    )..repeat();
    _pulseAnim = Tween<double>(begin: 0, end: 1).animate(_pulseAnimController);
  }

  @override
  void dispose() {
    WidgetsBinding.instance.removeObserver(this);
    _nameController.dispose();
    _pageController.dispose();
    _pulseAnimController.dispose();
    super.dispose();
  }

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
    final deviceAdmin = await OverlayService.hasDeviceAdminPermission();
    if (mounted) {
      setState(() {
        _usagePerm = usage;
        _overlayPerm = overlay;
        _writeSettingsPerm = writeSettings;
        _deviceAdminPerm = deviceAdmin;
      });
    }
  }

  bool get _canProceed {
    if (_currentPage == 0) return _nameController.text.trim().isNotEmpty;
    return true;
  }

  void _next() {
    FocusScope.of(context).unfocus();
    // Validate name on page 0
    if (_currentPage == 0 && _nameController.text.trim().isEmpty) {
      setState(() => _nameError = 'Please enter your name');
      return;
    }
    if (_currentPage < 4) {
      _pageController.nextPage(
        duration: const Duration(milliseconds: 300),
        curve: Curves.easeInOut,
      );
    } else {
      _saveAndFinish();
    }
  }

  void _back() {
    FocusScope.of(context).unfocus();
    if (_currentPage > 0) {
      _pageController.previousPage(
        duration: const Duration(milliseconds: 300),
        curve: Curves.easeInOut,
      );
    }
  }

  void _saveAndFinish() {
    PreferencesService.setUserName(_nameController.text);
    PreferencesService.setAge(_age);
    PreferencesService.setAddictionLevel(_addictionLevel);
    PreferencesService.setStrictness(_strictness);

    final startDate = DateTime.now().toIso8601String().split('T').first;
    PreferencesService.setPlanStartDate(startDate);
    PreferencesService.setTargetApps(PreferencesService.targetApps);
    PreferencesService.setDailyQuotaMin(
        PreferencesService.computeQuotaForPhase(0));

    PreferencesService.setOnboardingDone(true);

    context.read<AuthProvider>().completeOnboarding(
          name: _nameController.text,
          age: _age,
          addictionLevel: _addictionLevel,
          strictness: _strictness,
        );
    Navigator.pushReplacementNamed(context, '/main');
  }

  @override
  Widget build(BuildContext context) {
    final isProtocolPage = _currentPage == 3;
    return Scaffold(
      backgroundColor: _bgColor,
      body: SafeArea(
        child: Column(
          children: [
            // Progress dots (hidden on protocol page via Offstage to keep layout stable)
            Offstage(
              offstage: isProtocolPage,
              child: Padding(
                padding: const EdgeInsets.fromLTRB(24, 24, 24, 0),
                child: _buildProgressDots(),
              ),
            ),
            Offstage(
              offstage: isProtocolPage,
              child: const SizedBox(height: 8),
            ),

            // Pages
            Expanded(
              child: PageView(
                controller: _pageController,
                physics: const NeverScrollableScrollPhysics(),
                onPageChanged: (i) => setState(() => _currentPage = i),
                children: [
                  _step1(),
                  _step2(),
                  _step3(),
                  _step4Protocol(),
                  _step5Permissions(),
                ],
              ),
            ),

            // Bottom nav (hidden on protocol page which has its own buttons)
            Offstage(
              offstage: isProtocolPage,
              child: _buildBottomNav(),
            ),
          ],
        ),
      ),
    );
  }

  Widget _buildProgressDots() {
    return Row(
      mainAxisAlignment: MainAxisAlignment.center,
      children: List.generate(5, (i) {
        final isActive = i == _currentPage;
        return Container(
          width: isActive ? 24 : 8,
          height: 4,
          margin: EdgeInsets.only(right: i < 4 ? 6 : 0),
          decoration: BoxDecoration(
            color: isActive ? _charcoal : _borderColor,
            borderRadius: BorderRadius.circular(999),
          ),
        );
      }),
    );
  }

  Widget _buildBottomNav() {
    // Page 0: only forward button. Pages 1-2, 4: back + forward.
    return Padding(
      padding: const EdgeInsets.fromLTRB(24, 8, 24, 24),
      child: Row(
        mainAxisAlignment: MainAxisAlignment.center,
        children: [
          if (_currentPage > 0) ...[
            _navCircleButton(Icons.chevron_left, _back),
            const SizedBox(width: 24),
          ],
          _navCircleButton(
            _currentPage == 4 ? Icons.check : Icons.chevron_right,
            _next,
            enabled: _canProceed,
          ),
        ],
      ),
    );
  }

  Widget _navCircleButton(IconData icon, VoidCallback onTap,
      {bool enabled = true}) {
    return GestureDetector(
      onTap: enabled ? onTap : null,
      child: AnimatedOpacity(
        opacity: enabled ? 1.0 : 0.35,
        duration: const Duration(milliseconds: 200),
        child: Container(
          width: 48,
          height: 48,
          decoration: BoxDecoration(
            color: Colors.white,
            borderRadius: BorderRadius.circular(16),
            border: Border.all(color: _borderColor),
            boxShadow: [
              BoxShadow(
                color: Colors.black.withValues(alpha: 0.04),
                blurRadius: 4,
                offset: const Offset(0, 2),
              ),
            ],
          ),
          child: Icon(icon, color: _charcoal, size: 22),
        ),
      ),
    );
  }

  // ─── STEP 1: Name ───────────────────────────────────────────────────

  Widget _step1() {
    return Padding(
      padding: const EdgeInsets.symmetric(horizontal: 24),
      child: Column(
        children: [
          const SizedBox(height: 4),
          const Text(
            'PATIENT INTAKE FORM 01/05',
            style: TextStyle(
              fontSize: 12,
              fontWeight: FontWeight.w500,
              letterSpacing: 1.5,
              color: _textMuted,
            ),
          ),
          const SizedBox(height: 8),
          const Text(
            'lets start with you',
            style: TextStyle(
              fontSize: 18,
              fontWeight: FontWeight.w700,
              color: _charcoal,
            ),
          ),
          const Spacer(),
          // Card
          Stack(
            clipBehavior: Clip.none,
            children: [
              Container(
                width: double.infinity,
                padding:
                    const EdgeInsets.symmetric(horizontal: 24, vertical: 28),
                decoration: BoxDecoration(
                  color: Colors.white,
                  borderRadius: BorderRadius.circular(24),
                  border: Border.all(color: _charcoal, width: 2),
                ),
                child: Column(
                  children: [
                    const SizedBox(height: 8),
                    // Person icon circle
                    Container(
                      width: 80,
                      height: 80,
                      decoration: BoxDecoration(
                        shape: BoxShape.circle,
                        border: Border.all(color: _charcoal, width: 1),
                        color: _bgColor,
                      ),
                      child: Icon(Icons.person,
                          size: 40, color: _charcoal.withValues(alpha: 0.6)),
                    ),
                    const SizedBox(height: 20),
                    // Name input with underline
                    TextField(
                      controller: _nameController,
                      textAlign: TextAlign.center,
                      style: const TextStyle(fontSize: 14, color: _charcoal),
                      decoration: InputDecoration(
                        hintText: 'Full Name',
                        hintStyle: const TextStyle(color: _textMuted),
                        errorText: _nameError,
                        errorStyle: const TextStyle(fontSize: 11),
                        border: UnderlineInputBorder(
                          borderSide: BorderSide(
                              color: _nameError != null
                                  ? Colors.red
                                  : _charcoal),
                        ),
                        enabledBorder: UnderlineInputBorder(
                          borderSide: BorderSide(
                              color: _nameError != null
                                  ? Colors.red
                                  : _charcoal),
                        ),
                        focusedBorder: const UnderlineInputBorder(
                          borderSide: BorderSide(color: _charcoal),
                        ),
                        contentPadding:
                            const EdgeInsets.symmetric(vertical: 8),
                      ),
                    ),
                    const SizedBox(height: 16),
                    // Age row
                    Row(
                      mainAxisAlignment: MainAxisAlignment.center,
                      children: [
                        Container(
                          width: 64,
                          height: 40,
                          decoration: BoxDecoration(
                            color: _bgColor,
                            borderRadius: BorderRadius.circular(8),
                            border: Border.all(color: _charcoal),
                          ),
                          child: Center(
                            child: GestureDetector(
                              onTap: () => _showAgePicker(),
                              child: Text(
                                '$_age',
                                style: const TextStyle(
                                  fontSize: 16,
                                  fontWeight: FontWeight.w700,
                                  color: _charcoal,
                                ),
                              ),
                            ),
                          ),
                        ),
                        const SizedBox(width: 10),
                        const Text(
                          'years old',
                          style: TextStyle(fontSize: 14, color: _textMuted),
                        ),
                      ],
                    ),
                  ],
                ),
              ),
              // Decorative top-right corner square
              Positioned(
                top: -12,
                right: -12,
                child: Container(
                  width: 48,
                  height: 48,
                  decoration: BoxDecoration(
                    color: _bgColor,
                    borderRadius: BorderRadius.circular(12),
                    border: Border.all(color: _charcoal, width: 2),
                  ),
                ),
              ),
            ],
          ),
          const Spacer(flex: 2),
        ],
      ),
    );
  }

  void _showAgePicker() {
    showModalBottomSheet(
      context: context,
      builder: (ctx) {
        int tempAge = _age;
        return StatefulBuilder(
          builder: (ctx2, setLocal) {
            return Container(
              height: 250,
              padding: const EdgeInsets.all(24),
              child: Column(
                children: [
                  const Text('Select Age',
                      style: TextStyle(
                          fontSize: 16, fontWeight: FontWeight.w600)),
                  const SizedBox(height: 16),
                  Expanded(
                    child: ListWheelScrollView.useDelegate(
                      itemExtent: 40,
                      controller: FixedExtentScrollController(
                          initialItem: tempAge - 10),
                      onSelectedItemChanged: (i) => setLocal(() {
                        tempAge = i + 10;
                      }),
                      childDelegate: ListWheelChildBuilderDelegate(
                        builder: (ctx3, i) {
                          final age = i + 10;
                          if (age > 99) return null;
                          return Center(
                            child: Text('$age',
                                style: TextStyle(
                                  fontSize: age == tempAge ? 24 : 18,
                                  fontWeight: age == tempAge
                                      ? FontWeight.w700
                                      : FontWeight.w400,
                                  color:
                                      age == tempAge ? _charcoal : _textMuted,
                                )),
                          );
                        },
                        childCount: 90,
                      ),
                    ),
                  ),
                  ElevatedButton(
                    onPressed: () {
                      setState(() => _age = tempAge);
                      Navigator.pop(ctx2);
                    },
                    style: ElevatedButton.styleFrom(
                      backgroundColor: _teal,
                      foregroundColor: Colors.white,
                    ),
                    child: const Text('Done'),
                  ),
                ],
              ),
            );
          },
        );
      },
    );
  }

  // ─── STEP 2: Addiction + Pulse ──────────────────────────────────────

  Widget _step2() {
    return Padding(
      padding: const EdgeInsets.symmetric(horizontal: 24),
      child: Column(
        children: [
          const SizedBox(height: 4),
          const Text(
            'what smartphone has\ndone to you',
            textAlign: TextAlign.center,
            style: TextStyle(
              fontSize: 18,
              fontWeight: FontWeight.w300,
              color: _charcoal,
              letterSpacing: 0.5,
              height: 1.4,
            ),
          ),
          const Spacer(),
          // Pulse area with decorative top-right border
          Stack(
            clipBehavior: Clip.none,
            children: [
              Column(
                children: [
                  // Pulse line
                  SizedBox(
                    height: 80,
                    width: double.infinity,
                    child: AnimatedBuilder(
                      animation: _pulseAnim,
                      builder: (ctx, _) {
                        return CustomPaint(
                          painter: _PulsePainter(
                            phase: _pulseAnim.value,
                            addictionLevel: _currentAddiction,
                          ),
                          size: Size.infinite,
                        );
                      },
                    ),
                  ),
                  const SizedBox(height: 16),
                  // White card with slider
                  Container(
                    width: double.infinity,
                    padding: const EdgeInsets.all(28),
                    decoration: BoxDecoration(
                      color: Colors.white,
                      borderRadius: BorderRadius.circular(28),
                      border: Border.all(color: _borderColor),
                    ),
                    child: Column(
                      children: [
                        Text(
                          'LEVEL OF ADDICTION',
                          style: TextStyle(
                            fontSize: 12,
                            fontWeight: FontWeight.w500,
                            letterSpacing: 2,
                            color: _textMuted.withValues(alpha: 0.7),
                          ),
                        ),
                        const SizedBox(height: 8),
                        Text(
                          '$_addictionLevel',
                          style: const TextStyle(
                            fontSize: 48,
                            fontWeight: FontWeight.w300,
                            color: _charcoal,
                            letterSpacing: -2,
                          ),
                        ),
                        const SizedBox(height: 16),
                        SliderTheme(
                          data: SliderThemeData(
                            activeTrackColor: Colors.grey.shade400,
                            inactiveTrackColor: Colors.grey.shade200,
                            thumbColor: Colors.white,
                            overlayColor: Colors.grey.withValues(alpha: 0.1),
                            trackHeight: 4,
                            thumbShape: _CustomThumbShape(),
                          ),
                          child: Slider(
                            value: _addictionLevel.toDouble(),
                            min: 1,
                            max: 10,
                            divisions: 9,
                            onChanged: (v) {
                              setState(() => _addictionLevel = v.round());
                              _animateAddiction(v);
                            },
                          ),
                        ),
                        const SizedBox(height: 4),
                        Row(
                          mainAxisAlignment: MainAxisAlignment.spaceBetween,
                          children: [
                            Text(
                              'MILD',
                              style: TextStyle(
                                fontSize: 10,
                                letterSpacing: 2,
                                color: _textMuted.withValues(alpha: 0.5),
                              ),
                            ),
                            Text(
                              'SEVERE',
                              style: TextStyle(
                                fontSize: 10,
                                letterSpacing: 2,
                                color: _textMuted.withValues(alpha: 0.5),
                              ),
                            ),
                          ],
                        ),
                      ],
                    ),
                  ),
                ],
              ),
              // Decorative top-right border (like the mockup)
              Positioned(
                top: -16,
                right: -8,
                bottom: 40,
                child: Container(
                  width: 40,
                  decoration: BoxDecoration(
                    border: Border(
                      top: BorderSide(
                          color: _charcoal.withValues(alpha: 0.15), width: 2),
                      right: BorderSide(
                          color: _charcoal.withValues(alpha: 0.15), width: 2),
                    ),
                    borderRadius: const BorderRadius.only(
                      topRight: Radius.circular(24),
                    ),
                  ),
                ),
              ),
            ],
          ),
          const SizedBox(height: 20),
          Text(
            'MEASURING THE DIGITAL PULSE',
            style: TextStyle(
              fontSize: 10,
              letterSpacing: 2.5,
              color: _textMuted.withValues(alpha: 0.6),
            ),
          ),
          const Spacer(),
        ],
      ),
    );
  }

  void _animateAddiction(double target) {
    final startVal = _currentAddiction;
    final controller = AnimationController(
      vsync: this,
      duration: const Duration(milliseconds: 300),
    );
    final anim = Tween<double>(begin: startVal, end: target)
        .animate(CurvedAnimation(parent: controller, curve: Curves.easeOut));
    anim.addListener(() {
      setState(() => _currentAddiction = anim.value);
    });
    controller.forward().then((_) => controller.dispose());
  }

  // ─── STEP 3: Strictness ─────────────────────────────────────────────

  Widget _step3() {
    return Padding(
      padding: const EdgeInsets.symmetric(horizontal: 24),
      child: Column(
        children: [
          const SizedBox(height: 4),
          const Text(
            'lets see how dedicated\nyou are to get away from it',
            textAlign: TextAlign.center,
            style: TextStyle(
              fontSize: 18,
              fontWeight: FontWeight.w300,
              color: _charcoal,
              letterSpacing: 0.5,
              height: 1.4,
            ),
          ),
          const Spacer(),
          // White card with strictness slider
          Container(
            width: double.infinity,
            padding: const EdgeInsets.all(28),
            decoration: BoxDecoration(
              color: Colors.white,
              borderRadius: BorderRadius.circular(28),
              border: Border.all(color: _borderColor),
            ),
            child: Column(
              children: [
                Text(
                  'STRICTNESS LEVEL',
                  style: TextStyle(
                    fontSize: 12,
                    fontWeight: FontWeight.w500,
                    letterSpacing: 2,
                    color: _textMuted.withValues(alpha: 0.7),
                  ),
                ),
                const SizedBox(height: 8),
                Text(
                  '$_strictness',
                  style: const TextStyle(
                    fontSize: 48,
                    fontWeight: FontWeight.w300,
                    color: _charcoal,
                    letterSpacing: -2,
                  ),
                ),
                const SizedBox(height: 16),
                SliderTheme(
                  data: SliderThemeData(
                    activeTrackColor: Colors.grey.shade400,
                    inactiveTrackColor: Colors.grey.shade200,
                    thumbColor: Colors.white,
                    overlayColor: Colors.grey.withValues(alpha: 0.1),
                    trackHeight: 4,
                    thumbShape: _CustomThumbShape(),
                  ),
                  child: Slider(
                    value: _strictness.toDouble(),
                    min: 1,
                    max: 5,
                    divisions: 4,
                    onChanged: (v) => setState(() => _strictness = v.round()),
                  ),
                ),
                const SizedBox(height: 4),
                Row(
                  mainAxisAlignment: MainAxisAlignment.spaceBetween,
                  children: [
                    Text(
                      'LOW',
                      style: TextStyle(
                        fontSize: 10,
                        letterSpacing: 2,
                        color: _textMuted.withValues(alpha: 0.5),
                      ),
                    ),
                    Text(
                      'HIGH',
                      style: TextStyle(
                        fontSize: 10,
                        letterSpacing: 2,
                        color: _textMuted.withValues(alpha: 0.5),
                      ),
                    ),
                  ],
                ),
              ],
            ),
          ),
          const SizedBox(height: 20),
          // Rehab days info
          Container(
            width: double.infinity,
            padding: const EdgeInsets.all(16),
            decoration: BoxDecoration(
              color: Colors.white,
              borderRadius: BorderRadius.circular(16),
              border: Border.all(color: _borderColor.withValues(alpha: 0.5)),
            ),
            child: Row(
              mainAxisAlignment: MainAxisAlignment.center,
              children: [
                Icon(Icons.calendar_today,
                    size: 16, color: _textMuted.withValues(alpha: 0.6)),
                const SizedBox(width: 8),
                Text(
                  'YOUR REHAB: $_rehabDays DAYS',
                  style: TextStyle(
                    fontSize: 11,
                    fontWeight: FontWeight.w500,
                    letterSpacing: 1.5,
                    color: _textMuted.withValues(alpha: 0.7),
                  ),
                ),
              ],
            ),
          ),
          const Spacer(),
        ],
      ),
    );
  }

  // ─── STEP 4: Protocol Ticket ────────────────────────────────────────

  Widget _step4Protocol() {
    return Column(
      children: [
        // Custom app bar
        Padding(
          padding: const EdgeInsets.fromLTRB(8, 12, 24, 8),
          child: Row(
            children: [
              IconButton(
                onPressed: _back,
                icon: const Icon(Icons.arrow_back, color: _charcoal),
              ),
              Expanded(
                child: Text(
                  'PRESCRIPTION 04/05',
                  textAlign: TextAlign.center,
                  style: TextStyle(
                    fontSize: 14,
                    fontWeight: FontWeight.w700,
                    letterSpacing: 2,
                    color: Colors.grey.shade500,
                    fontFamily: 'monospace',
                  ),
                ),
              ),
              const SizedBox(width: 48), // balance the back button
            ],
          ),
        ),
        Divider(height: 1, color: Colors.grey.shade200),

        // Content
        Expanded(
          child: Padding(
            padding: const EdgeInsets.symmetric(horizontal: 24),
            child: Column(
              mainAxisAlignment: MainAxisAlignment.center,
              children: [
                const Spacer(),
                // Prescription card
                Container(
                  width: double.infinity,
                  padding: const EdgeInsets.all(28),
                  decoration: BoxDecoration(
                    color: Colors.grey.shade50,
                    borderRadius: BorderRadius.circular(16),
                    border: Border.all(
                      color: Colors.grey.shade300,
                      width: 2,
                      strokeAlign: BorderSide.strokeAlignInside,
                    ),
                  ),
                  child: Stack(
                    children: [
                      // Decorative dots top-left
                      Positioned(
                        top: 0,
                        left: 0,
                        child: Row(
                          children: [
                            Container(
                              width: 8,
                              height: 8,
                              decoration: BoxDecoration(
                                shape: BoxShape.circle,
                                color: Colors.grey.shade300,
                              ),
                            ),
                            const SizedBox(width: 4),
                            Container(
                              width: 8,
                              height: 8,
                              decoration: BoxDecoration(
                                shape: BoxShape.circle,
                                color: Colors.grey.shade300,
                              ),
                            ),
                          ],
                        ),
                      ),
                      // RX code top-right
                      Positioned(
                        top: 0,
                        right: 0,
                        child: Text(
                          'RX-001A',
                          style: TextStyle(
                            fontSize: 11,
                            fontFamily: 'monospace',
                            color: Colors.grey.shade400,
                          ),
                        ),
                      ),
                      // Main content
                      Padding(
                        padding: const EdgeInsets.only(top: 24),
                        child: Column(
                          crossAxisAlignment: CrossAxisAlignment.start,
                          children: [
                            // Duration
                            Text(
                              'DURATION',
                              style: TextStyle(
                                fontSize: 12,
                                fontWeight: FontWeight.w500,
                                letterSpacing: 2,
                                color: Colors.grey.shade500,
                              ),
                            ),
                            Divider(color: Colors.grey.shade200),
                            Row(
                              crossAxisAlignment: CrossAxisAlignment.baseline,
                              textBaseline: TextBaseline.alphabetic,
                              children: [
                                Text(
                                  '$_rehabDays',
                                  style: TextStyle(
                                    fontSize: 48,
                                    fontWeight: FontWeight.w700,
                                    color: Colors.grey.shade800,
                                    fontFamily: 'monospace',
                                    letterSpacing: -2,
                                  ),
                                ),
                                const SizedBox(width: 8),
                                Text(
                                  'days',
                                  style: TextStyle(
                                    fontSize: 18,
                                    color: Colors.grey.shade600,
                                  ),
                                ),
                              ],
                            ),
                            const SizedBox(height: 16),
                            // Strictness
                            Text(
                              'STRICTNESS',
                              style: TextStyle(
                                fontSize: 12,
                                fontWeight: FontWeight.w500,
                                letterSpacing: 2,
                                color: Colors.grey.shade500,
                              ),
                            ),
                            Divider(color: Colors.grey.shade200),
                            Text(
                              'Level $_strictness',
                              style: TextStyle(
                                fontSize: 48,
                                fontWeight: FontWeight.w700,
                                color: Colors.grey.shade800,
                                fontFamily: 'monospace',
                                letterSpacing: -2,
                              ),
                            ),
                            const SizedBox(height: 24),
                            // Signature area
                            Divider(color: Colors.grey.shade200),
                            const SizedBox(height: 8),
                            Row(
                              mainAxisAlignment: MainAxisAlignment.spaceBetween,
                              crossAxisAlignment: CrossAxisAlignment.end,
                              children: [
                                Text(
                                  'Betaal AI System',
                                  style: TextStyle(
                                    fontSize: 11,
                                    fontFamily: 'monospace',
                                    color: Colors.grey.shade500,
                                  ),
                                ),
                                Container(
                                  width: 80,
                                  height: 1,
                                  color: Colors.grey.shade800
                                      .withValues(alpha: 0.5),
                                ),
                              ],
                            ),
                          ],
                        ),
                      ),
                    ],
                  ),
                ),
                const SizedBox(height: 24),
                Text(
                  'Personalized protocol generated\nbased on your digital habits.',
                  textAlign: TextAlign.center,
                  style: TextStyle(
                    fontSize: 14,
                    color: Colors.grey.shade600,
                    height: 1.5,
                  ),
                ),
                const Spacer(),
              ],
            ),
          ),
        ),

        // Accept button
        Padding(
          padding: const EdgeInsets.fromLTRB(24, 0, 24, 8),
          child: Divider(height: 1, color: Colors.grey.shade200),
        ),
        Padding(
          padding: const EdgeInsets.fromLTRB(24, 8, 24, 24),
          child: GestureDetector(
            onTap: _next,
            child: Container(
              width: double.infinity,
              height: 56,
              decoration: BoxDecoration(
                color: _teal,
                borderRadius: BorderRadius.circular(16),
                boxShadow: [
                  BoxShadow(
                    color: _teal.withValues(alpha: 0.3),
                    blurRadius: 12,
                    offset: const Offset(0, 4),
                  ),
                ],
              ),
              child: const Row(
                mainAxisAlignment: MainAxisAlignment.center,
                children: [
                  Icon(Icons.check_circle, color: Color(0xFF1A1A2E), size: 22),
                  SizedBox(width: 10),
                  Text(
                    'ACCEPT PROTOCOL',
                    style: TextStyle(
                      fontSize: 16,
                      fontWeight: FontWeight.w700,
                      color: Color(0xFF1A1A2E),
                      letterSpacing: 1.5,
                    ),
                  ),
                ],
              ),
            ),
          ),
        ),
      ],
    );
  }

  // ─── STEP 5: Permissions (unchanged) ────────────────────────────────

  Widget _step5Permissions() {
    return Padding(
      padding: const EdgeInsets.all(24),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          const Text(
            'Grant\npermissions',
            style: TextStyle(
                fontSize: 28,
                fontWeight: FontWeight.w700,
                color: _charcoal,
                height: 1.2),
          ),
          const SizedBox(height: 8),
          const Text('Betaal needs these to protect you',
              style: TextStyle(color: _textMuted, fontSize: 13)),
          const SizedBox(height: 28),
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
          const SizedBox(height: 12),
          _permissionTile(
            icon: Icons.lock,
            title: 'Device Admin',
            subtitle: 'Lock your screen as a distraction interruption',
            granted: _deviceAdminPerm,
            onTap: () async {
              if (!_deviceAdminPerm) {
                await OverlayService.requestDeviceAdminPermission();
              }
            },
          ),
          const SizedBox(height: 20),
          Container(
            padding: const EdgeInsets.all(14),
            decoration: BoxDecoration(
              color: Colors.amber.shade50,
              borderRadius: BorderRadius.circular(12),
              border: Border.all(color: Colors.amber.shade200),
            ),
            child: Row(
              children: [
                Icon(Icons.info_outline,
                    size: 18, color: Colors.amber.shade700),
                const SizedBox(width: 10),
                Expanded(
                  child: Text(
                    'You can grant these later in Personalize. Some distractions may not work without permissions.',
                    style: TextStyle(
                        fontSize: 11,
                        color: Colors.amber.shade800,
                        height: 1.4),
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
          color: granted ? _teal.withValues(alpha: 0.06) : Colors.white,
          borderRadius: BorderRadius.circular(16),
          border: Border.all(
              color: granted ? _teal.withValues(alpha: 0.2) : Colors.grey.shade200),
        ),
        child: Row(
          children: [
            Container(
              width: 40,
              height: 40,
              decoration: BoxDecoration(
                color:
                    (granted ? _teal : Colors.grey.shade300).withValues(alpha: 0.15),
                borderRadius: BorderRadius.circular(12),
              ),
              child: Icon(icon,
                  size: 20,
                  color: granted ? _teal : Colors.grey.shade500),
            ),
            const SizedBox(width: 14),
            Expanded(
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  Text(
                    title,
                    style: const TextStyle(
                      fontSize: 14,
                      fontWeight: FontWeight.w600,
                      color: _charcoal,
                    ),
                  ),
                  const SizedBox(height: 2),
                  Text(subtitle,
                      style:
                          const TextStyle(fontSize: 11, color: _textMuted)),
                ],
              ),
            ),
            const SizedBox(width: 8),
            if (granted)
              Container(
                width: 28,
                height: 28,
                decoration: BoxDecoration(
                  color: _teal.withValues(alpha: 0.15),
                  shape: BoxShape.circle,
                ),
                child: const Icon(Icons.check, size: 16, color: _teal),
              )
            else
              Container(
                padding:
                    const EdgeInsets.symmetric(horizontal: 12, vertical: 6),
                decoration: BoxDecoration(
                  color: _teal,
                  borderRadius: BorderRadius.circular(8),
                ),
                child: const Text(
                  'Grant',
                  style: TextStyle(
                      fontSize: 12,
                      fontWeight: FontWeight.w600,
                      color: Colors.white),
                ),
              ),
          ],
        ),
      ),
    );
  }
}

// ─── Custom Slider Thumb ──────────────────────────────────────────────

class _CustomThumbShape extends SliderComponentShape {
  @override
  Size getPreferredSize(bool isEnabled, bool isDiscrete) =>
      const Size(24, 24);

  @override
  void paint(
    PaintingContext context,
    Offset center, {
    required Animation<double> activationAnimation,
    required Animation<double> enableAnimation,
    required bool isDiscrete,
    required TextPainter labelPainter,
    required RenderBox parentBox,
    required SliderThemeData sliderTheme,
    required TextDirection textDirection,
    required double value,
    required double textScaleFactor,
    required Size sizeWithOverflow,
  }) {
    final canvas = context.canvas;
    // White fill
    canvas.drawCircle(
      center,
      12,
      Paint()..color = Colors.white,
    );
    // Gray border
    canvas.drawCircle(
      center,
      12,
      Paint()
        ..color = const Color(0xFF71717A)
        ..style = PaintingStyle.stroke
        ..strokeWidth = 1.5,
    );
  }
}

// ─── Pulse Line Painter ───────────────────────────────────────────────

class _PulsePainter extends CustomPainter {
  final double phase; // 0..1 looping
  final double addictionLevel; // 1..10

  _PulsePainter({required this.phase, required this.addictionLevel});

  @override
  void paint(Canvas canvas, Size size) {
    final paint = Paint()
      ..color = const Color(0xFF333333).withValues(alpha: 0.5)
      ..style = PaintingStyle.stroke
      ..strokeWidth = 1.5
      ..strokeCap = StrokeCap.round
      ..strokeJoin = StrokeJoin.round;

    final path = Path();
    final w = size.width;
    final h = size.height;
    final midY = h / 2;

    // Addiction determines pulse shape:
    // Low (1-3): strong, regular heartbeat (healthy)
    // Medium (4-6): moderate waves
    // High (7-10): nearly flat with occasional sharp spike (dying)

    final normalized = (addictionLevel - 1) / 9.0; // 0..1
    // Invert: low addiction = big peaks, high = flat
    final amplitude = (1.0 - normalized) * 0.8 + 0.05;
    // Frequency of spikes
    final spikeFreq = (1.0 - normalized) * 4 + 1; // 5 spikes when healthy, 1 when dying

    const totalPoints = 200;
    final phaseOffset = phase * 2 * pi;

    for (int i = 0; i <= totalPoints; i++) {
      final x = (i / totalPoints) * w;
      final t = (i / totalPoints) * spikeFreq * 2 * pi + phaseOffset;

      // Generate heartbeat-like waveform
      double y;
      final tMod = t % (2 * pi);
      if (tMod > 1.2 && tMod < 1.8) {
        // Sharp upward spike
        final spike = sin((tMod - 1.2) / 0.6 * pi);
        y = midY - spike * amplitude * h * 0.45;
      } else if (tMod > 2.0 && tMod < 2.5) {
        // Sharp downward dip
        final dip = sin((tMod - 2.0) / 0.5 * pi);
        y = midY + dip * amplitude * h * 0.25;
      } else {
        // Flat baseline with tiny noise
        y = midY + sin(t * 3) * h * 0.01;
      }

      if (i == 0) {
        path.moveTo(x, y);
      } else {
        path.lineTo(x, y);
      }
    }

    canvas.drawPath(path, paint);
  }

  @override
  bool shouldRepaint(_PulsePainter oldDelegate) =>
      oldDelegate.phase != phase || oldDelegate.addictionLevel != addictionLevel;
}

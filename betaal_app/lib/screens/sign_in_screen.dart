import 'dart:math';
import 'package:flutter/material.dart';
import 'package:provider/provider.dart';
import '../providers/auth_provider.dart';
import '../services/preferences_service.dart';

const _bg = Color(0xFFF2F2F2);
const _charcoal = Color(0xFF333333);
const _mint = Color(0xFF13ECB6);
const _slate500 = Color(0xFF64748B);
const _slate400 = Color(0xFF94A3B8);
const _slate200 = Color(0xFFE2E8F0);

class SignInScreen extends StatefulWidget {
  const SignInScreen({super.key});

  @override
  State<SignInScreen> createState() => _SignInScreenState();
}

class _SignInScreenState extends State<SignInScreen>
    with TickerProviderStateMixin {
  // Breathing glow on phone frame
  late final AnimationController _breathCtrl;
  late final Animation<double> _breathAnim;

  // Chain undulation
  late final AnimationController _undulateCtrl;
  late final Animation<double> _undulateAnim;

  // Mint pulse pull-down
  late final AnimationController _pullCtrl;
  late final Animation<double> _pullAnim;

  // Heartbeat dot
  late final AnimationController _heartCtrl;
  late final Animation<double> _heartAnim;

  // Loading state after sign-in tap
  bool _isLoading = false;
  late final AnimationController _loadCtrl;
  late final Animation<double> _loadAnim;

  @override
  void initState() {
    super.initState();

    // Breathing glow: 3s infinite
    _breathCtrl = AnimationController(
      vsync: this,
      duration: const Duration(milliseconds: 3000),
    )..repeat(reverse: true);
    _breathAnim = Tween<double>(begin: 0.1, end: 0.45).animate(
      CurvedAnimation(parent: _breathCtrl, curve: Curves.easeInOut),
    );

    // Chain undulate: 0.8s alternate
    _undulateCtrl = AnimationController(
      vsync: this,
      duration: const Duration(milliseconds: 800),
    )..repeat(reverse: true);
    _undulateAnim = Tween<double>(begin: -2, end: 2).animate(
      CurvedAnimation(parent: _undulateCtrl, curve: Curves.easeInOut),
    );

    // Pull-down: 4s infinite
    _pullCtrl = AnimationController(
      vsync: this,
      duration: const Duration(milliseconds: 4000),
    )..repeat();
    _pullAnim = Tween<double>(begin: 0, end: 1).animate(
      CurvedAnimation(parent: _pullCtrl, curve: Curves.easeInOut),
    );

    // Heartbeat dot: 1.2s
    _heartCtrl = AnimationController(
      vsync: this,
      duration: const Duration(milliseconds: 1200),
    )..repeat();
    _heartAnim = TweenSequence<double>([
      TweenSequenceItem(tween: Tween(begin: 1, end: 1.3), weight: 25),
      TweenSequenceItem(tween: Tween(begin: 1.3, end: 1), weight: 25),
      TweenSequenceItem(tween: Tween(begin: 1, end: 1.3), weight: 25),
      TweenSequenceItem(tween: Tween(begin: 1.3, end: 1), weight: 25),
    ]).animate(_heartCtrl);

    // Loading animation: chain unravels fast
    _loadCtrl = AnimationController(
      vsync: this,
      duration: const Duration(milliseconds: 2500),
    );
    _loadAnim = Tween<double>(begin: 0, end: 1).animate(
      CurvedAnimation(parent: _loadCtrl, curve: Curves.easeInOut),
    );
  }

  @override
  void dispose() {
    _breathCtrl.dispose();
    _undulateCtrl.dispose();
    _pullCtrl.dispose();
    _heartCtrl.dispose();
    _loadCtrl.dispose();
    super.dispose();
  }

  Future<void> _handleSignIn() async {
    setState(() => _isLoading = true);
    _loadCtrl.forward();
    // Speed up undulation during loading
    _undulateCtrl.duration = const Duration(milliseconds: 300);

    final auth = context.read<AuthProvider>();
    try {
      await auth.signIn();
      if (!auth.isSignedIn) {
        // User cancelled
        _resetLoading();
        return;
      }
      if (mounted) {
        final route =
            PreferencesService.onboardingDone ? '/main' : '/onboarding';
        Navigator.pushReplacementNamed(context, route);
      }
    } catch (e) {
      _resetLoading();
      if (mounted) {
        ScaffoldMessenger.of(context).showSnackBar(
          SnackBar(
            content: Text('Sign-in failed: $e'),
            backgroundColor: Colors.red.shade400,
          ),
        );
      }
    }
  }

  void _resetLoading() {
    if (!mounted) return;
    setState(() => _isLoading = false);
    _loadCtrl.reset();
    _undulateCtrl.duration = const Duration(milliseconds: 800);
  }

  @override
  Widget build(BuildContext context) {
    final size = MediaQuery.of(context).size;

    return Scaffold(
      backgroundColor: _bg,
      body: Stack(
        children: [
          // Left & right subtle border lines
          Positioned(left: 0, top: 0, bottom: 0, child: Container(width: 1, color: _slate200)),
          Positioned(right: 0, top: 0, bottom: 0, child: Container(width: 1, color: _slate200)),

          // Main content
          SafeArea(
            child: Column(
              children: [
                // Header
                const Padding(
                  padding: EdgeInsets.symmetric(horizontal: 24, vertical: 16),
                  child: Row(
                    mainAxisAlignment: MainAxisAlignment.spaceBetween,
                    children: [
                      Row(
                        children: [
                          Icon(Icons.local_hospital_outlined, size: 16, color: _charcoal),
                          SizedBox(width: 6),
                          Text(
                            'betaal.ai',
                            style: TextStyle(
                              fontSize: 10,
                              letterSpacing: 3,
                              color: _charcoal,
                              fontWeight: FontWeight.w500,
                            ),
                          ),
                        ],
                      ),
                      Text(
                        'v - 1.0',
                        style: TextStyle(
                          fontSize: 10,
                          letterSpacing: 3,
                          color: _slate500,
                          fontWeight: FontWeight.w500,
                        ),
                      ),
                    ],
                  ),
                ),

                // SVG illustration area
                Expanded(
                  child: AnimatedBuilder(
                    animation: Listenable.merge([
                      _breathCtrl,
                      _undulateCtrl,
                      _pullCtrl,
                      _loadCtrl,
                    ]) ,
                    builder: (context, _) {
                      return CustomPaint(
                        size: Size(size.width, double.infinity),
                        painter: _PulseUntanglePainter(
                          breathGlow: _breathAnim.value,
                          undulateX: _undulateAnim.value,
                          pullPhase: _pullAnim.value,
                          loadProgress: _loadAnim.value,
                          isLoading: _isLoading,
                        ),
                      );
                    },
                  ),
                ),

                // Title
                const Padding(
                  padding: EdgeInsets.only(top: 4),
                  child: Column(
                    children: [
                      Text(
                        'break the digital loop',
                        style: TextStyle(
                          fontSize: 20,
                          fontWeight: FontWeight.w300,
                          letterSpacing: 2,
                          color: _charcoal,
                        ),
                      ),
                      SizedBox(height: 8),
                      Text(
                        'RECLAIMING HUMAN PRESENCE',
                        style: TextStyle(
                          fontSize: 9,
                          letterSpacing: 4,
                          color: _slate500,
                          fontWeight: FontWeight.w500,
                        ),
                      ),
                    ],
                  ),
                ),

                const SizedBox(height: 24),

                // Footer
                Padding(
                  padding: const EdgeInsets.symmetric(horizontal: 24),
                  child: Column(
                    children: [
                      // Protocol label
                      const Column(
                        children: [
                          Text(
                            'Sign in : Google',
                            style: TextStyle(
                              fontSize: 8,
                              letterSpacing: 2,
                              color: _slate400,
                              fontWeight: FontWeight.w500,
                            ),
                          ),
                          SizedBox(height: 6),
                        ],
                      ),
                      Container(width: 32, height: 1, color: const Color(0x99E2E8F0)), // fixed const color
                      const SizedBox(height: 20),
                    ],
                  ),
                ),
                
                // Sign-in button / loading state
                Padding(
                  padding: const EdgeInsets.symmetric(horizontal: 24),
                  child: _isLoading
                      ? _buildLoadingButton()
                      : _buildSignInButton(),
                ),

                const SizedBox(height: 28),

                //**// Heartbeat status
                Row(
                  mainAxisAlignment: MainAxisAlignment.center,
                  children: [
                    AnimatedBuilder(
                      animation: _heartCtrl,
                      builder: (context, child) {
                        return Transform.scale(
                          scale: _heartAnim.value,
                          child: Container(
                            width: 8,
                            height: 8,
                            decoration: const BoxDecoration(
                              shape: BoxShape.circle,
                              color: _mint,
                            ),
                          ),
                        );
                      },
                    ),
                    const SizedBox(width: 10),
                    Text(
                      _isLoading
                          ? 'INITIATING RECOVERY PROTOCOL...'
                          : 'BIOMETRIC SYNC ENABLED',
                      style: const TextStyle(
                        fontSize: 9,
                        letterSpacing: 3,
                        color: _slate400,
                        fontWeight: FontWeight.w500,
                      ),
                    ),
                  ],
                ),

                SizedBox(height: MediaQuery.of(context).padding.bottom + 32),
              ],
            ),
          ),
        ],
      ),
    );
  }

  Widget _buildSignInButton() {
    return GestureDetector(
      onTap: _handleSignIn,
      child: Container(
        width: double.infinity,
        padding: const EdgeInsets.symmetric(vertical: 18),
        decoration: BoxDecoration(
          color: Colors.white,
          border: Border.all(color: _slate200),
          boxShadow: [
            BoxShadow(
              offset: const Offset(4, 4),
              color: Colors.black.withValues(alpha: 0.03),
              blurRadius: 0,
            ),
          ],
        ),
        child: Row(
          mainAxisAlignment: MainAxisAlignment.center,
          children: [
            // Google icon
            SizedBox(
              width: 18,
              height: 18,
              child: CustomPaint(painter: _GoogleLogoPainter()),
            ),
            const SizedBox(width: 16),
            const Text(
              'begin clinical intake',
              style: TextStyle(
                fontSize: 12,
                fontWeight: FontWeight.w500,
                letterSpacing: 3,
                color: _charcoal,
              ),
            ),
          ],
        ),
      ),
    );
  }

  Widget _buildLoadingButton() {
    return AnimatedBuilder(
      animation: _loadCtrl,
      builder: (context, _) {
        return Container(
          width: double.infinity,
          padding: const EdgeInsets.symmetric(vertical: 18),
          decoration: BoxDecoration(
            color: Colors.white,
            border: Border.all(
              color: Color.lerp(_slate200, _mint, _loadAnim.value)!,
            ),
            boxShadow: [
              BoxShadow(
                offset: const Offset(0, 0),
                color: _mint.withValues(alpha: 0.15 * _loadAnim.value),
                blurRadius: 15 * _loadAnim.value,
              ),
            ],
          ),
          child: const Row(
            mainAxisAlignment: MainAxisAlignment.center,
            children: [
              SizedBox(
                width: 16,
                height: 16,
                child: CircularProgressIndicator(
                  strokeWidth: 2,
                  valueColor: AlwaysStoppedAnimation(_mint),
                ),
              ),
              SizedBox(width: 16),
              Text(
                'signing...',
                style: TextStyle(
                  fontSize: 12,
                  fontWeight: FontWeight.w500,
                  letterSpacing: 3,
                  color: _slate500,
                ),
              ),
            ],
          ),
        );
      },
    );
  }
}

// ============================================================
// CUSTOM PAINTER: The Pulse Untangle illustration
// ============================================================
class _PulseUntanglePainter extends CustomPainter {
  final double breathGlow;
  final double undulateX;
  final double pullPhase;
  final double loadProgress;
  final bool isLoading;

  _PulseUntanglePainter({
    required this.breathGlow,
    required this.undulateX,
    required this.pullPhase,
    required this.loadProgress,
    required this.isLoading,
  });

  @override
  void paint(Canvas canvas, Size size) {
    final cx = size.width / 2;
    final phoneW = size.width * 0.38;
    final phoneH = phoneW * 1.625;
    final phoneX = cx - phoneW / 2;
    final phoneY = size.height * 0.02;

    // --- Breathing glow shadow ---
    final glowPaint = Paint()
      ..color = _charcoal.withValues(alpha: breathGlow * 0.3)
      ..maskFilter = MaskFilter.blur(BlurStyle.normal, 8 + breathGlow * 12);
    final phoneRect = RRect.fromRectAndRadius(
      Rect.fromLTWH(phoneX, phoneY, phoneW, phoneH),
      const Radius.circular(20),
    );
    canvas.drawRRect(phoneRect, glowPaint);

    // --- Phone outer frame ---
    final framePaint = Paint()
      ..style = PaintingStyle.stroke
      ..color = _charcoal
      ..strokeWidth = 2.5;
    canvas.drawRRect(phoneRect, framePaint);

    // --- Phone inner screen (dashed feel) ---
    final screenRect = RRect.fromRectAndRadius(
      Rect.fromLTWH(phoneX + 10, phoneY + 20, phoneW - 20, phoneH - 40),
      const Radius.circular(12),
    );
    final screenPaint = Paint()
      ..style = PaintingStyle.stroke
      ..color = _charcoal.withValues(alpha: 0.3)
      ..strokeWidth = 0.75;
    canvas.drawRRect(screenRect, screenPaint);

    // --- Home button circle ---
    canvas.drawCircle(
      Offset(cx, phoneY + phoneH),
      4,
      Paint()..color = _charcoal,
    );

    // --- Tangled charcoal chain ---
    final chainStartY = phoneY + phoneH + 8;
    final chainEndY = size.height * 0.78;
    // During loading, chain straightens out
    final tangleFactor = isLoading ? (1.0 - loadProgress).clamp(0.0, 1.0) : 1.0;
    final chainOpacity = isLoading ? (1.0 - loadProgress * 0.4) : 1.0;

    final chainPaint = Paint()
      ..style = PaintingStyle.stroke
      ..color = _charcoal.withValues(alpha: chainOpacity)
      ..strokeWidth = 3
      ..strokeCap = StrokeCap.round
      ..strokeJoin = StrokeJoin.round;

    final chainPath = Path();
    chainPath.moveTo(cx, chainStartY);

    // Tangled S-curves with undulation
    final dx = undulateX * tangleFactor;
    final seg = (chainEndY - chainStartY) / 5;

    chainPath.cubicTo(
      cx - 60 * tangleFactor + dx, chainStartY + seg * 0.8,
      cx + 60 * tangleFactor + dx, chainStartY + seg * 1.2,
      cx - 20 * tangleFactor, chainStartY + seg * 2,
    );
    chainPath.cubicTo(
      cx + 50 * tangleFactor - dx, chainStartY + seg * 2.5,
      cx - 40 * tangleFactor + dx, chainStartY + seg * 3.2,
      cx - 10 * tangleFactor, chainStartY + seg * 4,
    );
    chainPath.cubicTo(
      cx + 20 * tangleFactor - dx, chainStartY + seg * 4.3,
      cx - 10 * tangleFactor + dx, chainStartY + seg * 4.7,
      cx, chainEndY,
    );

    canvas.drawPath(chainPath, chainPaint);

    // --- Transition segment (charcoal → slate) ---
    final transY = chainEndY;
    final transEndY = size.height * 0.85;
    final transPaint = Paint()
      ..style = PaintingStyle.stroke
      ..color = _slate500
      ..strokeWidth = 2
      ..strokeCap = StrokeCap.round;

    final transPath = Path();
    transPath.moveTo(cx, transY);
    final pullOffset = sin(pullPhase * 2 * pi) * 3;
    transPath.cubicTo(
      cx - 10 + pullOffset, transY + (transEndY - transY) * 0.4,
      cx + 10 - pullOffset, transY + (transEndY - transY) * 0.7,
      cx, transEndY,
    );
    canvas.drawPath(transPath, transPaint);

    // --- Mint pulse line ---
    final mintStartY = transEndY;
    final mintEndY = size.height * 0.98;
    // During loading, mint glows brighter and grows
    final mintGlow = isLoading ? loadProgress : 0.0;

    if (mintGlow > 0) {
      final mintGlowPaint = Paint()
        ..color = _mint.withValues(alpha: 0.3 * mintGlow)
        ..maskFilter = MaskFilter.blur(BlurStyle.normal, 8 + mintGlow * 12);
      canvas.drawLine(
        Offset(cx, mintStartY),
        Offset(cx, mintEndY + mintGlow * 20),
        mintGlowPaint,
      );
    }

    final mintPaint = Paint()
      ..style = PaintingStyle.stroke
      ..color = _mint
      ..strokeWidth = 2.5 + mintGlow * 1.5
      ..strokeCap = StrokeCap.round;

    canvas.drawLine(
      Offset(cx, mintStartY),
      Offset(cx, mintEndY + mintGlow * 20),
      mintPaint,
    );
  }

  @override
  bool shouldRepaint(covariant _PulseUntanglePainter old) => true;
}

// ============================================================
// Google "G" logo painter
// ============================================================
class _GoogleLogoPainter extends CustomPainter {
  @override
  void paint(Canvas canvas, Size size) {
    final s = size.width / 24;

    // Blue
    final blue = Paint()..color = const Color(0xFF4285F4);
    final bluePath = Path()
      ..moveTo(22.56 * s, 12.25 * s)
      ..cubicTo(22.56 * s, 11.47 * s, 22.49 * s, 10.72 * s, 22.36 * s, 10 * s)
      ..lineTo(12 * s, 10 * s)
      ..lineTo(12 * s, 14.26 * s)
      ..lineTo(17.92 * s, 14.26 * s)
      ..cubicTo(17.66 * s, 15.63 * s, 16.88 * s, 16.79 * s, 15.71 * s, 17.57 * s)
      ..lineTo(15.71 * s, 20.34 * s)
      ..lineTo(19.28 * s, 20.34 * s)
      ..cubicTo(21.36 * s, 18.42 * s, 22.56 * s, 15.6 * s, 22.56 * s, 12.25 * s)
      ..close();
    canvas.drawPath(bluePath, blue);

    // Green
    final green = Paint()..color = const Color(0xFF34A853);
    final greenPath = Path()
      ..moveTo(12 * s, 23 * s)
      ..cubicTo(14.97 * s, 23 * s, 17.46 * s, 22.02 * s, 19.28 * s, 20.34 * s)
      ..lineTo(15.71 * s, 17.57 * s)
      ..cubicTo(14.73 * s, 18.23 * s, 13.48 * s, 18.63 * s, 12 * s, 18.63 * s)
      ..cubicTo(9.14 * s, 18.63 * s, 6.71 * s, 16.7 * s, 5.84 * s, 14.1 * s)
      ..lineTo(2.18 * s, 14.1 * s)
      ..lineTo(2.18 * s, 16.94 * s)
      ..cubicTo(3.99 * s, 20.53 * s, 7.7 * s, 23 * s, 12 * s, 23 * s)
      ..close();
    canvas.drawPath(greenPath, green);

    // Yellow
    final yellow = Paint()..color = const Color(0xFFFBBC05);
    final yellowPath = Path()
      ..moveTo(5.84 * s, 14.09 * s)
      ..cubicTo(5.62 * s, 13.43 * s, 5.49 * s, 12.73 * s, 5.49 * s, 12 * s)
      ..cubicTo(5.49 * s, 11.27 * s, 5.62 * s, 10.57 * s, 5.84 * s, 9.91 * s)
      ..lineTo(5.84 * s, 7.07 * s)
      ..lineTo(2.18 * s, 7.07 * s)
      ..cubicTo(1.43 * s, 8.55 * s, 1 * s, 10.22 * s, 1 * s, 12 * s)
      ..cubicTo(1 * s, 13.78 * s, 1.43 * s, 15.45 * s, 2.18 * s, 16.93 * s)
      ..lineTo(5.03 * s, 14.71 * s)
      ..lineTo(5.84 * s, 14.09 * s)
      ..close();
    canvas.drawPath(yellowPath, yellow);

    // Red
    final red = Paint()..color = const Color(0xFFEA4335);
    final redPath = Path()
      ..moveTo(12 * s, 5.38 * s)
      ..cubicTo(13.62 * s, 5.38 * s, 15.06 * s, 5.94 * s, 16.21 * s, 7.02 * s)
      ..lineTo(19.36 * s, 3.87 * s)
      ..cubicTo(17.45 * s, 2.09 * s, 14.97 * s, 1 * s, 12 * s, 1 * s)
      ..cubicTo(7.7 * s, 1 * s, 3.99 * s, 3.47 * s, 2.18 * s, 7.07 * s)
      ..lineTo(5.84 * s, 9.91 * s)
      ..cubicTo(6.71 * s, 7.31 * s, 9.14 * s, 5.38 * s, 12 * s, 5.38 * s)
      ..close();
    canvas.drawPath(redPath, red);
  }

  @override
  bool shouldRepaint(covariant CustomPainter oldDelegate) => false;
}

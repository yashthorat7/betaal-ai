import 'dart:math';
import 'package:flutter/material.dart';

class MonitoringRing extends StatefulWidget {
  final int usedMinutes;
  final int quotaMinutes;

  const MonitoringRing({
    super.key,
    required this.usedMinutes,
    required this.quotaMinutes,
  });

  @override
  State<MonitoringRing> createState() => _MonitoringRingState();
}

class _MonitoringRingState extends State<MonitoringRing>
    with SingleTickerProviderStateMixin {
  static const _teal = Color(0xFF2DD4BF);
  static const _amber = Color(0xFFFBBF24);
  static const _rose = Color(0xFFE17070);
  static const _charcoal = Color(0xFF101018);

  late AnimationController _controller;
  late Animation<double> _progressAnim;
  double _prevProgress = 0.0;

  double get _targetProgress =>
      (widget.usedMinutes / widget.quotaMinutes).clamp(0.0, 1.0);

  @override
  void initState() {
    super.initState();
    _controller = AnimationController(
      vsync: this,
      duration: const Duration(milliseconds: 1200),
    );
    // Animate from 0 (full ring) to actual value on first load
    _progressAnim = Tween<double>(begin: 0.0, end: _targetProgress).animate(
      CurvedAnimation(parent: _controller, curve: Curves.easeOutCubic),
    );
    _controller.forward();
  }

  @override
  void didUpdateWidget(MonitoringRing oldWidget) {
    super.didUpdateWidget(oldWidget);
    final newTarget = _targetProgress;
    if ((newTarget - _prevProgress).abs() > 0.001) {
      final from = _progressAnim.value;
      _progressAnim = Tween<double>(begin: from, end: newTarget).animate(
        CurvedAnimation(parent: _controller, curve: Curves.easeOutCubic),
      );
      _controller
        ..reset()
        ..duration = const Duration(milliseconds: 800)
        ..forward();
    }
  }

  @override
  void dispose() {
    _controller.dispose();
    super.dispose();
  }

  Color _ringColor(double progress) {
    if (progress <= 0.5) return _teal;
    if (progress <= 0.8) return _amber;
    return _rose;
  }

  @override
  Widget build(BuildContext context) {
    return AnimatedBuilder(
      animation: _progressAnim,
      builder: (context, child) {
        final progress = _progressAnim.value;
        _prevProgress = progress;
        final remaining =
            (widget.quotaMinutes - (progress * widget.quotaMinutes).round())
                .clamp(0, widget.quotaMinutes);
        final hours = remaining ~/ 60;
        final mins = remaining % 60;
        final ringColor = _ringColor(progress);
        final trendPercent = ((1 - progress) * 20).round();

        return Container(
          width: 280,
          height: 280,
          decoration: BoxDecoration(
            shape: BoxShape.circle,
            color: const Color(0xFFF2F2F2),
            border: Border.all(color: Colors.black.withValues(alpha: 0.06)),
            boxShadow: [
              BoxShadow(
                color: Colors.black.withValues(alpha: 0.05),
                offset: const Offset(4, 4),
                blurRadius: 10,
              ),
              BoxShadow(
                color: Colors.white.withValues(alpha: 0.8),
                offset: const Offset(-4, -4),
                blurRadius: 10,
              ),
              BoxShadow(
                color: Colors.black.withValues(alpha: 0.02),
                offset: const Offset(2, 2),
                blurRadius: 4,
              ),
            ],
          ),
          child: CustomPaint(
            painter: _RingPainter(progress: progress, ringColor: ringColor),
            child: Center(
              child: Column(
                mainAxisAlignment: MainAxisAlignment.center,
                children: [
                  Text(
                    'REMAINING',
                    style: TextStyle(
                      fontSize: 11,
                      fontWeight: FontWeight.w500,
                      color: Colors.grey.shade400,
                      letterSpacing: 3,
                    ),
                  ),
                  const SizedBox(height: 4),
                  Text(
                    '${hours}h ${mins.toString().padLeft(2, '0')}m',
                    style: const TextStyle(
                      fontSize: 44,
                      fontWeight: FontWeight.bold,
                      color: _charcoal,
                      letterSpacing: -2,
                    ),
                  ),
                  const SizedBox(height: 4),
                  Row(
                    mainAxisSize: MainAxisSize.min,
                    children: [
                      Icon(
                        progress <= 0.5
                            ? Icons.trending_down
                            : Icons.trending_up,
                        size: 16,
                        color: ringColor,
                      ),
                      const SizedBox(width: 4),
                      Text(
                        '-$trendPercent%',
                        style: TextStyle(
                          fontSize: 13,
                          fontWeight: FontWeight.w600,
                          color: ringColor,
                        ),
                      ),
                    ],
                  ),
                ],
              ),
            ),
          ),
        );
      },
    );
  }
}

class _RingPainter extends CustomPainter {
  final double progress;
  final Color ringColor;

  _RingPainter({required this.progress, required this.ringColor});

  @override
  void paint(Canvas canvas, Size size) {
    final center = Offset(size.width / 2, size.height / 2);
    final radius = size.width / 2 - 24;
    const strokeWidth = 12.0;

    // Track (light grey)
    final bgPaint = Paint()
      ..color = Colors.grey.shade200
      ..style = PaintingStyle.stroke
      ..strokeWidth = strokeWidth
      ..strokeCap = StrokeCap.round;
    canvas.drawCircle(center, radius, bgPaint);

    // Progress arc — shows REMAINING (1 - progress)
    final remaining = 1.0 - progress;
    if (remaining > 0.005) {
      final progressPaint = Paint()
        ..color = ringColor
        ..style = PaintingStyle.stroke
        ..strokeWidth = strokeWidth
        ..strokeCap = StrokeCap.round;

      // Glow effect
      final glowPaint = Paint()
        ..color = ringColor.withValues(alpha: 0.3)
        ..style = PaintingStyle.stroke
        ..strokeWidth = strokeWidth + 6
        ..strokeCap = StrokeCap.round
        ..maskFilter = const MaskFilter.blur(BlurStyle.normal, 8);

      final rect = Rect.fromCircle(center: center, radius: radius);
      canvas.drawArc(rect, -pi / 2, 2 * pi * remaining, false, glowPaint);
      canvas.drawArc(rect, -pi / 2, 2 * pi * remaining, false, progressPaint);
    }
  }

  @override
  bool shouldRepaint(covariant _RingPainter old) =>
      old.progress != progress || old.ringColor != ringColor;
}

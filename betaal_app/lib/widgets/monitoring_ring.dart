import 'dart:math';
import 'package:flutter/material.dart';

class MonitoringRing extends StatelessWidget {
  final int usedMinutes;
  final int quotaMinutes;

  const MonitoringRing({
    super.key,
    required this.usedMinutes,
    required this.quotaMinutes,
  });

  static const _teal = Color(0xFF2DD4BF);
  static const _amber = Color(0xFFFBBF24);
  static const _rose = Color(0xFFE17070);
  static const _charcoal = Color(0xFF101018);

  @override
  Widget build(BuildContext context) {
    final progress = (usedMinutes / quotaMinutes).clamp(0.0, 1.0);
    final remaining = (quotaMinutes - usedMinutes).clamp(0, quotaMinutes);
    final hours = remaining ~/ 60;
    final mins = remaining % 60;

    // Dynamic color based on usage
    final Color ringColor;
    if (progress <= 0.5) {
      ringColor = _teal;
    } else if (progress <= 0.8) {
      ringColor = _amber;
    } else {
      ringColor = _rose;
    }

    // Trend: percentage change (dummy: based on progress)
    final trendPercent = ((1 - progress) * 20).round();

    return Container(
      width: 280,
      height: 280,
      decoration: BoxDecoration(
        shape: BoxShape.circle,
        color: const Color(0xFFF2F2F2),
        border: Border.all(color: Colors.black.withOpacity(0.06)),
        boxShadow: [
          BoxShadow(
            color: Colors.black.withOpacity(0.05),
            offset: const Offset(4, 4),
            blurRadius: 10,
          ),
          BoxShadow(
            color: Colors.white.withOpacity(0.8),
            offset: const Offset(-4, -4),
            blurRadius: 10,
          ),
          BoxShadow(
            color: Colors.black.withOpacity(0.02),
            offset: const Offset(2, 2),
            blurRadius: 4,
            spreadRadius: 0,
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
    if (remaining > 0) {
      final progressPaint = Paint()
        ..color = ringColor
        ..style = PaintingStyle.stroke
        ..strokeWidth = strokeWidth
        ..strokeCap = StrokeCap.round;

      // Glow effect
      final glowPaint = Paint()
        ..color = ringColor.withOpacity(0.3)
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

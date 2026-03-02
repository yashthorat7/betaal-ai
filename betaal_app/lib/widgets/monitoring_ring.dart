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

  @override
  Widget build(BuildContext context) {
    final progress = (usedMinutes / quotaMinutes).clamp(0.0, 1.0);
    final remaining = quotaMinutes - usedMinutes;

    return SizedBox(
      width: 220,
      height: 220,
      child: CustomPaint(
        painter: _RingPainter(progress: progress),
        child: Center(
          child: Column(
            mainAxisAlignment: MainAxisAlignment.center,
            children: [
              Text(
                '${remaining > 0 ? remaining : 0}',
                style: const TextStyle(fontSize: 48, fontWeight: FontWeight.bold),
              ),
              const Text('min left', style: TextStyle(fontSize: 14, color: Colors.grey)),
              const SizedBox(height: 4),
              Text(
                '${usedMinutes}m / ${quotaMinutes}m',
                style: const TextStyle(fontSize: 12, color: Colors.grey),
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
  _RingPainter({required this.progress});

  @override
  void paint(Canvas canvas, Size size) {
    final center = Offset(size.width / 2, size.height / 2);
    final radius = size.width / 2 - 12;
    const strokeWidth = 14.0;

    // Background ring
    final bgPaint = Paint()
      ..color = Colors.grey.shade200
      ..style = PaintingStyle.stroke
      ..strokeWidth = strokeWidth
      ..strokeCap = StrokeCap.round;
    canvas.drawCircle(center, radius, bgPaint);

    // Progress arc
    final progressPaint = Paint()
      ..color = progress > 0.8 ? Colors.red.shade400 : progress > 0.5 ? Colors.orange.shade400 : Colors.black87
      ..style = PaintingStyle.stroke
      ..strokeWidth = strokeWidth
      ..strokeCap = StrokeCap.round;

    canvas.drawArc(
      Rect.fromCircle(center: center, radius: radius),
      -pi / 2,
      2 * pi * progress,
      false,
      progressPaint,
    );
  }

  @override
  bool shouldRepaint(covariant _RingPainter old) => old.progress != progress;
}

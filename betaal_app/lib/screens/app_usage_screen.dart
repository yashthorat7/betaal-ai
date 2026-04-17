import 'package:flutter/material.dart';
import '../models/usage_record.dart';

class AppUsageScreen extends StatelessWidget {
  final List<AppUsage> apps;

  const AppUsageScreen({super.key, required this.apps});

  static const _teal = Color(0xFF26A69A);
  static const _bgColor = Color(0xFFF2F2F2);
  static const _cardColor = Color(0xFFF9FAFB);
  static const _textMain = Color(0xFF333333);
  static const _textMuted = Color(0xFF6B7280);
  static const _borderColor = Color(0xFFE5E7EB);

  @override
  Widget build(BuildContext context) {
    final totalMin = apps.fold(0, (sum, a) => sum + a.minutes);
    final hours = totalMin ~/ 60;
    final mins = totalMin % 60;
    final maxMin = apps.isEmpty
        ? 1
        : apps.map((a) => a.minutes).reduce((a, b) => a > b ? a : b);

    // Category colors
    Color categoryColor(String category) {
      switch (category) {
        case 'social': return const Color(0xFFE17070);
        case 'entertainment': return const Color(0xFF3A86FF);
        case 'messaging': return _teal;
        case 'gaming': return const Color(0xFFFBBF24);
        case 'browser': return const Color(0xFF8B5CF6);
        default: return Colors.grey;
      }
    }

    return Scaffold(
      backgroundColor: _bgColor,
      body: SafeArea(
        child: Column(
          children: [
            // Top bar
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
                      child: const Icon(Icons.arrow_back, color: _textMain, size: 22),
                    ),
                  ),
                  const Expanded(
                    child: Text(
                      'APP USAGE',
                      textAlign: TextAlign.center,
                      style: TextStyle(
                        fontSize: 15,
                        fontWeight: FontWeight.w600,
                        letterSpacing: 1.2,
                        color: _textMain,
                      ),
                    ),
                  ),
                  const SizedBox(width: 40),
                ],
              ),
            ),
            const SizedBox(height: 8),

            // Total summary
            Container(
              margin: const EdgeInsets.symmetric(horizontal: 16),
              padding: const EdgeInsets.all(20),
              decoration: BoxDecoration(
                color: _cardColor,
                borderRadius: BorderRadius.circular(24),
                border: Border.all(color: _borderColor),
                boxShadow: [
                  BoxShadow(
                    color: Colors.black.withValues(alpha: 0.03),
                    blurRadius: 8,
                    offset: const Offset(0, 2),
                  ),
                ],
              ),
              child: Row(
                children: [
                  Column(
                    crossAxisAlignment: CrossAxisAlignment.start,
                    children: [
                      const Text(
                        'TOTAL SCREEN TIME',
                        style: TextStyle(
                          fontSize: 10,
                          fontWeight: FontWeight.w600,
                          letterSpacing: 1.5,
                          color: _textMuted,
                        ),
                      ),
                      const SizedBox(height: 8),
                      Row(
                        crossAxisAlignment: CrossAxisAlignment.baseline,
                        textBaseline: TextBaseline.alphabetic,
                        children: [
                          Text(
                            '$hours',
                            style: const TextStyle(
                              fontSize: 36,
                              fontWeight: FontWeight.w300,
                              color: _textMain,
                            ),
                          ),
                          const Text('h ', style: TextStyle(fontSize: 18, color: _textMuted)),
                          Text(
                            '$mins',
                            style: const TextStyle(
                              fontSize: 36,
                              fontWeight: FontWeight.w300,
                              color: _textMain,
                            ),
                          ),
                          const Text('m', style: TextStyle(fontSize: 18, color: _textMuted)),
                        ],
                      ),
                    ],
                  ),
                  const Spacer(),
                  Column(
                    crossAxisAlignment: CrossAxisAlignment.end,
                    children: [
                      const Text(
                        'APPS TRACKED',
                        style: TextStyle(
                          fontSize: 10,
                          fontWeight: FontWeight.w600,
                          letterSpacing: 1.5,
                          color: _textMuted,
                        ),
                      ),
                      const SizedBox(height: 8),
                      Text(
                        '${apps.length}',
                        style: const TextStyle(
                          fontSize: 36,
                          fontWeight: FontWeight.w300,
                          color: _textMain,
                        ),
                      ),
                    ],
                  ),
                ],
              ),
            ),
            const SizedBox(height: 16),

            // App list
            Expanded(
              child: ListView.builder(
                padding: const EdgeInsets.symmetric(horizontal: 16),
                itemCount: apps.length,
                itemBuilder: (_, i) {
                  final app = apps[i];
                  final fraction = app.minutes / maxMin;
                  final h = app.minutes ~/ 60;
                  final m = app.minutes % 60;
                  final timeStr = h > 0 ? '${h}h ${m}m' : '${m}m';
                  final pct = totalMin > 0
                      ? ((app.minutes / totalMin) * 100).round()
                      : 0;
                  final color = categoryColor(app.category);

                  return Container(
                    margin: const EdgeInsets.only(bottom: 12),
                    padding: const EdgeInsets.all(16),
                    decoration: BoxDecoration(
                      color: _cardColor,
                      borderRadius: BorderRadius.circular(16),
                      border: Border.all(color: _borderColor),
                      boxShadow: [
                        BoxShadow(
                          color: Colors.black.withValues(alpha: 0.02),
                          blurRadius: 4,
                          offset: const Offset(0, 1),
                        ),
                      ],
                    ),
                    child: Column(
                      children: [
                        Row(
                          children: [
                            // Color dot
                            Container(
                              width: 10,
                              height: 10,
                              decoration: BoxDecoration(
                                color: color,
                                shape: BoxShape.circle,
                              ),
                            ),
                            const SizedBox(width: 12),
                            // App name
                            Expanded(
                              child: Column(
                                crossAxisAlignment: CrossAxisAlignment.start,
                                children: [
                                  Text(
                                    app.appName,
                                    style: const TextStyle(
                                      fontSize: 14,
                                      fontWeight: FontWeight.w600,
                                      color: _textMain,
                                    ),
                                  ),
                                  const SizedBox(height: 2),
                                  Text(
                                    app.category.toUpperCase(),
                                    style: TextStyle(
                                      fontSize: 10,
                                      fontWeight: FontWeight.w500,
                                      color: color.withValues(alpha: 0.7),
                                      letterSpacing: 0.5,
                                    ),
                                  ),
                                ],
                              ),
                            ),
                            // Time + percentage
                            Column(
                              crossAxisAlignment: CrossAxisAlignment.end,
                              children: [
                                Text(
                                  timeStr,
                                  style: const TextStyle(
                                    fontSize: 14,
                                    fontWeight: FontWeight.w600,
                                    color: _textMain,
                                  ),
                                ),
                                const SizedBox(height: 2),
                                Text(
                                  '$pct% of total',
                                  style: const TextStyle(
                                    fontSize: 10,
                                    color: _textMuted,
                                  ),
                                ),
                              ],
                            ),
                          ],
                        ),
                        const SizedBox(height: 12),
                        // Progress bar
                        Container(
                          height: 6,
                          decoration: BoxDecoration(
                            color: Colors.grey.shade100,
                            borderRadius: BorderRadius.circular(999),
                          ),
                          child: ClipRRect(
                            borderRadius: BorderRadius.circular(999),
                            child: Align(
                              alignment: Alignment.centerLeft,
                              child: FractionallySizedBox(
                                widthFactor: fraction.clamp(0.05, 1.0),
                                child: Container(
                                  decoration: BoxDecoration(
                                    color: color,
                                    borderRadius: BorderRadius.circular(999),
                                  ),
                                ),
                              ),
                            ),
                          ),
                        ),
                      ],
                    ),
                  );
                },
              ),
            ),
          ],
        ),
      ),
    );
  }
}

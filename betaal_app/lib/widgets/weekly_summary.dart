import 'package:flutter/material.dart';
import '../models/usage_record.dart';

class WeeklySummary extends StatelessWidget {
  final List<UsageRecord> week;
  final int quotaMinutes;
  final int todayIndex; // 0-based index of "today" in the week (e.g., 4 = Friday)

  const WeeklySummary({
    super.key,
    required this.week,
    required this.quotaMinutes,
    this.todayIndex = 4,
  });

  static const _teal = Color(0xFF2DD4BF);
  static const _rose = Color(0xFFE17070);
  static const _charcoal = Color(0xFF101018);

  @override
  Widget build(BuildContext context) {
    final days = ['M', 'T', 'W', 'T', 'F', 'S', 'S'];

    return Row(
      mainAxisAlignment: MainAxisAlignment.spaceBetween,
      children: List.generate(7, (i) {
        final record = i < week.length ? week[i] : null;
        final isToday = i == todayIndex;
        final isFuture = i > todayIndex;

        // Fill: remaining quota as fraction (1.0 = full quota left, 0.0 = all used)
        double fill = 0;
        bool overQuota = false;
        if (record != null && quotaMinutes > 0) {
          final remaining = quotaMinutes - record.totalMin;
          if (remaining < 0) {
            overQuota = true;
            fill = 1.0; // Full bar but in red
          } else {
            fill = (remaining / quotaMinutes).clamp(0.0, 1.0);
          }
        }

        final Color barBgColor;
        final Color barFillColor;
        final Color dayLabelColor;
        final FontWeight dayWeight;
        final double barHeight;

        if (isFuture) {
          barBgColor = Colors.grey.shade200;
          barFillColor = Colors.transparent;
          dayLabelColor = Colors.grey.shade400;
          dayWeight = FontWeight.w400;
          barHeight = 48;
        } else if (isToday) {
          barBgColor = Colors.grey.shade200;
          barFillColor = overQuota ? _rose : _charcoal;
          dayLabelColor = _charcoal;
          dayWeight = FontWeight.w700;
          barHeight = 56;
        } else {
          barBgColor = overQuota
              ? _rose.withOpacity(0.2)
              : _teal.withOpacity(0.2);
          barFillColor = overQuota ? _rose : _teal;
          dayLabelColor = Colors.grey.shade400;
          dayWeight = FontWeight.w500;
          barHeight = 48;
        }

        return Expanded(
          child: Padding(
            padding: const EdgeInsets.symmetric(horizontal: 3),
            child: Column(
              children: [
                // Bar
                Container(
                  height: barHeight,
                  decoration: BoxDecoration(
                    color: barBgColor,
                    borderRadius: BorderRadius.circular(999),
                    border: isToday
                        ? Border.all(
                            color: _charcoal.withOpacity(0.8),
                            width: 2,
                          )
                        : null,
                    boxShadow: isToday
                        ? [
                            BoxShadow(
                              color: Colors.black.withOpacity(0.08),
                              blurRadius: 4,
                              offset: const Offset(0, 2),
                            ),
                          ]
                        : null,
                  ),
                  child: ClipRRect(
                    borderRadius: BorderRadius.circular(999),
                    child: isFuture
                        ? const SizedBox.expand()
                        : Align(
                            alignment: Alignment.bottomCenter,
                            child: FractionallySizedBox(
                              heightFactor: fill.clamp(0.05, 1.0),
                              widthFactor: 1.0,
                              child: Container(
                                decoration: BoxDecoration(
                                  color: barFillColor,
                                  borderRadius: BorderRadius.circular(999),
                                ),
                              ),
                            ),
                          ),
                  ),
                ),
                const SizedBox(height: 8),
                // Day label
                Text(
                  days[i],
                  style: TextStyle(
                    fontSize: 12,
                    fontWeight: dayWeight,
                    color: dayLabelColor,
                  ),
                ),
              ],
            ),
          ),
        );
      }),
    );
  }
}

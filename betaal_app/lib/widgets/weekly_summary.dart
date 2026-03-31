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

        // --- 1. HARDCODE THE DAYS ---
        final isToday = i == 4; // Force Friday to be "Today"
        final isFuture = i > 4; // Force Saturday and Sunday to be "Future"

        // --- 2. HARDCODE THE FILL AMOUNTS AND OVER-QUOTA ---
        double fill = 0.6; // Default fill for M, T, W
        bool overQuota = false;

        if (i == 3) {
          // Thursday: Red (Over Quota)
          overQuota = true;
          fill = 1.0;
        } else if (i == 4) {
          // Friday: Very low fill (Black)
          fill = 0.15;
        }

        // --- 3. HARDCODE THE COLORS ---
        final Color barBgColor;
        final Color barFillColor;
        final Color dayLabelColor;
        final FontWeight dayWeight;
        final double barHeight;

        if (isFuture) {
          // Saturday & Sunday (Gray)
          barBgColor = Colors.grey.shade200;
          barFillColor = Colors.transparent;
          dayLabelColor = Colors.grey.shade400;
          dayWeight = FontWeight.w400;
          barHeight = 48;
        } else if (isToday) {
          // Friday (Black border, Black fill)
          barBgColor = Colors.grey.shade200;
          barFillColor = _charcoal;
          dayLabelColor = _charcoal;
          dayWeight = FontWeight.w700;
          barHeight = 56;
        } else {
          // Past days: Monday, Tuesday, Wednesday, Thursday
          // Thursday is handled by overQuota (Red). The rest are Teal.
          barBgColor = overQuota
              ? _rose.withOpacity(0.2)
              : _teal.withOpacity(0.2);
          barFillColor = overQuota ? _rose : _teal;

          dayLabelColor = Colors.grey.shade400;
          dayWeight = FontWeight.w500;
          barHeight = 48;
        }

        // --- THE UNCHANGED DESIGN ---
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
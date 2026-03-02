import 'package:flutter/material.dart';
import '../models/usage_record.dart';

class WeeklySummary extends StatelessWidget {
  final List<UsageRecord> week;

  const WeeklySummary({super.key, required this.week});

  @override
  Widget build(BuildContext context) {
    final days = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
    return Row(
      mainAxisAlignment: MainAxisAlignment.spaceEvenly,
      children: List.generate(7, (i) {
        final record = i < week.length ? week[i] : null;
        final underQuota = record?.underQuota ?? false;
        return Column(
          children: [
            Text(days[i], style: const TextStyle(fontSize: 11, color: Colors.grey)),
            const SizedBox(height: 4),
            Container(
              width: 36,
              height: 36,
              decoration: BoxDecoration(
                shape: BoxShape.circle,
                color: record == null
                    ? Colors.grey.shade200
                    : underQuota
                        ? Colors.green.shade100
                        : Colors.red.shade100,
                border: Border.all(
                  color: record == null
                      ? Colors.grey.shade300
                      : underQuota
                          ? Colors.green
                          : Colors.red,
                  width: 2,
                ),
              ),
              child: Center(
                child: record != null
                    ? Icon(
                        underQuota ? Icons.check : Icons.close,
                        size: 18,
                        color: underQuota ? Colors.green : Colors.red,
                      )
                    : null,
              ),
            ),
          ],
        );
      }),
    );
  }
}

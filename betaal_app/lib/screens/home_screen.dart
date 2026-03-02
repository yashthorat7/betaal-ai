import 'package:flutter/material.dart';
import 'package:provider/provider.dart';
import '../providers/auth_provider.dart';
import '../providers/usage_provider.dart';
import '../providers/rehab_provider.dart';
import '../widgets/monitoring_ring.dart';
import '../widgets/weekly_summary.dart';

class HomeScreen extends StatelessWidget {
  const HomeScreen({super.key});

  @override
  Widget build(BuildContext context) {
    final auth = context.watch<AuthProvider>();
    final usage = context.watch<UsageProvider>();
    final rehab = context.watch<RehabProvider>();
    final user = auth.user;
    final today = usage.today;
    final plan = rehab.plan;

    return Scaffold(
      body: SafeArea(
        child: Padding(
          padding: const EdgeInsets.all(16),
          child: Column(
            children: [
              // Top bar
              Row(
                children: [
                  Expanded(
                    child: Text(
                      'Hi, ${user?.name ?? 'User'}',
                      style: const TextStyle(fontSize: 24, fontWeight: FontWeight.bold),
                    ),
                  ),
                  const CircleAvatar(
                    radius: 20,
                    child: Icon(Icons.person),
                  ),
                ],
              ),
              const SizedBox(height: 20),

              // Weekly summary
              WeeklySummary(week: usage.week),
              const SizedBox(height: 32),

              // Monitoring ring
              MonitoringRing(
                usedMinutes: today?.totalMin ?? 0,
                quotaMinutes: plan?.activePhase.dailyQuotaMin ?? 273,
              ),
              const SizedBox(height: 24),

              // Stats row
              Row(
                mainAxisAlignment: MainAxisAlignment.spaceEvenly,
                children: [
                  _stat('Unlocks', '${today?.unlocks ?? 0}'),
                  _stat('Streak', '${plan != null ? 3 : 0} days'),
                  _stat('Phase', plan?.activePhase.name ?? '-'),
                ],
              ),
              const SizedBox(height: 24),

              // Rehab progress
              if (plan != null) ...[
                Row(
                  children: [
                    Text('Day ${plan.currentDay} of ${plan.durationDays}',
                        style: const TextStyle(fontWeight: FontWeight.bold)),
                    const Spacer(),
                    Text('${(plan.progressPercent * 100).round()}%',
                        style: const TextStyle(color: Colors.grey)),
                  ],
                ),
                const SizedBox(height: 8),
                LinearProgressIndicator(
                  value: plan.progressPercent,
                  minHeight: 8,
                  borderRadius: BorderRadius.circular(4),
                ),
              ],
            ],
          ),
        ),
      ),
    );
  }

  Widget _stat(String label, String value) {
    return Column(
      children: [
        Text(value, style: const TextStyle(fontSize: 20, fontWeight: FontWeight.bold)),
        const SizedBox(height: 2),
        Text(label, style: const TextStyle(fontSize: 12, color: Colors.grey)),
      ],
    );
  }
}

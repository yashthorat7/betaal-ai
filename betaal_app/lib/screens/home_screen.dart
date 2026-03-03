import 'package:flutter/material.dart';
import 'package:provider/provider.dart';
import '../providers/auth_provider.dart';
import '../providers/usage_provider.dart';
import '../providers/rehab_provider.dart';
import '../widgets/monitoring_ring.dart';
import '../widgets/weekly_summary.dart';

class HomeScreen extends StatelessWidget {
  const HomeScreen({super.key});

  static const _teal = Color(0xFF2DD4BF);
  static const _charcoal = Color(0xFF101018);
  static const _bgColor = Color(0xFFF2F2F2);

  @override
  Widget build(BuildContext context) {
    final auth = context.watch<AuthProvider>();
    final usage = context.watch<UsageProvider>();
    final rehab = context.watch<RehabProvider>();
    final user = auth.user;
    final today = usage.today;
    final plan = rehab.plan;
    final quota = plan?.activePhase.dailyQuotaMin ?? 273;

    return Scaffold(
      backgroundColor: _bgColor,
      body: SafeArea(
        child: SingleChildScrollView(
          padding: const EdgeInsets.symmetric(horizontal: 24),
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              const SizedBox(height: 24),

              // --- HEADER ---
              Row(
                children: [
                  Expanded(
                    child: Text(
                      'hey, ${user?.name.toLowerCase() ?? 'user'}',
                      style: const TextStyle(
                        fontSize: 28,
                        fontWeight: FontWeight.w600,
                        color: _charcoal,
                        letterSpacing: -0.5,
                      ),
                    ),
                  ),
                  // Avatar with online dot
                  Stack(
                    children: [
                      Container(
                        width: 48,
                        height: 48,
                        decoration: BoxDecoration(
                          shape: BoxShape.circle,
                          border: Border.all(
                            color: Colors.black.withOpacity(0.06),
                          ),
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
                          ],
                        ),
                        child: const CircleAvatar(
                          radius: 24,
                          backgroundColor: Color(0xFFE8E8E8),
                          child: Icon(Icons.person, color: Color(0xFF888888), size: 26),
                        ),
                      ),
                      Positioned(
                        bottom: 0,
                        right: 0,
                        child: Container(
                          width: 14,
                          height: 14,
                          decoration: BoxDecoration(
                            color: _teal,
                            shape: BoxShape.circle,
                            border: Border.all(color: _bgColor, width: 2),
                          ),
                        ),
                      ),
                    ],
                  ),
                ],
              ),
              const SizedBox(height: 28),

              // --- THIS WEEK label ---
              Row(
                children: [
                  Text(
                    'This Week',
                    style: TextStyle(
                      fontSize: 13,
                      fontWeight: FontWeight.w500,
                      color: Colors.grey.shade500,
                    ),
                  ),
                  const Spacer(),
                  Icon(Icons.more_horiz, color: Colors.grey.shade400, size: 20),
                ],
              ),
              const SizedBox(height: 16),

              // --- WEEKLY BARS ---
              WeeklySummary(
                week: usage.week,
                quotaMinutes: quota,
                todayIndex: _getTodayIndex(usage.week),
              ),
              const SizedBox(height: 32),

              // --- BIG PROGRESS RING ---
              Center(
                child: MonitoringRing(
                  usedMinutes: today?.totalMin ?? 0,
                  quotaMinutes: quota,
                ),
              ),
              const SizedBox(height: 24),

              // --- STATUS BADGE ---
              if (plan != null)
                Center(
                  child: Container(
                    padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 10),
                    decoration: BoxDecoration(
                      color: Colors.white,
                      borderRadius: BorderRadius.circular(999),
                      border: Border.all(
                        color: Colors.grey.shade200,
                      ),
                      boxShadow: [
                        BoxShadow(
                          color: Colors.black.withOpacity(0.03),
                          blurRadius: 4,
                          offset: const Offset(0, 2),
                        ),
                      ],
                    ),
                    child: Row(
                      mainAxisSize: MainAxisSize.min,
                      children: [
                        Container(
                          width: 8,
                          height: 8,
                          decoration: const BoxDecoration(
                            color: _teal,
                            shape: BoxShape.circle,
                          ),
                        ),
                        const SizedBox(width: 8),
                        Text(
                          'Phase ${plan.currentPhase} rehab active',
                          style: TextStyle(
                            fontSize: 13,
                            fontWeight: FontWeight.w500,
                            color: _charcoal.withOpacity(0.85),
                          ),
                        ),
                      ],
                    ),
                  ),
                ),
              const SizedBox(height: 24),

              // --- QUICK ACTION CARDS ---
              Row(
                children: [
                  Expanded(
                    child: _ActionCard(
                      icon: Icons.lock_open_rounded,
                      iconBgColor: _teal.withOpacity(0.1),
                      iconColor: _teal,
                      title: '${today?.unlocks ?? 0}',
                      subtitle: 'Unlocks',
                    ),
                  ),
                  const SizedBox(width: 16),
                  Expanded(
                    child: _ActionCard(
                      icon: Icons.shield_outlined,
                      iconBgColor: const Color(0xFF3838FF).withOpacity(0.1),
                      iconColor: const Color(0xFF3838FF),
                      title: plan?.activePhase.name ?? '-',
                      subtitle: 'Current Phase',
                    ),
                  ),
                ],
              ),
              const SizedBox(height: 24),

              // --- REHAB DAY PROGRESS ---
              if (plan != null) _RehabProgress(plan: plan),

              const SizedBox(height: 32),
            ],
          ),
        ),
      ),
    );
  }

  int _getTodayIndex(List<dynamic> week) {
    // Use week length - 1 as "today" index, capped at 6
    if (week.isEmpty) return 0;
    return (week.length - 1).clamp(0, 6);
  }
}

// --- Action Card Widget ---
class _ActionCard extends StatelessWidget {
  final IconData icon;
  final Color iconBgColor;
  final Color iconColor;
  final String title;
  final String subtitle;

  const _ActionCard({
    required this.icon,
    required this.iconBgColor,
    required this.iconColor,
    required this.title,
    required this.subtitle,
  });

  @override
  Widget build(BuildContext context) {
    return Container(
      padding: const EdgeInsets.all(20),
      decoration: BoxDecoration(
        color: Colors.white,
        borderRadius: BorderRadius.circular(16),
        border: Border.all(color: Colors.black.withOpacity(0.06)),
        boxShadow: [
          BoxShadow(
            color: Colors.black.withOpacity(0.03),
            blurRadius: 4,
            offset: const Offset(0, 2),
          ),
        ],
      ),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Container(
            padding: const EdgeInsets.all(8),
            decoration: BoxDecoration(
              color: iconBgColor,
              borderRadius: BorderRadius.circular(10),
            ),
            child: Icon(icon, color: iconColor, size: 22),
          ),
          const SizedBox(height: 14),
          Text(
            title,
            style: const TextStyle(
              fontSize: 15,
              fontWeight: FontWeight.w700,
              color: Color(0xFF101018),
            ),
          ),
          const SizedBox(height: 2),
          Text(
            subtitle,
            style: TextStyle(
              fontSize: 12,
              color: Colors.grey.shade500,
            ),
          ),
        ],
      ),
    );
  }
}

// --- Rehab Day Progress Widget ---
class _RehabProgress extends StatelessWidget {
  final dynamic plan;

  const _RehabProgress({required this.plan});

  static const _teal = Color(0xFF2DD4BF);
  static const _charcoal = Color(0xFF101018);

  @override
  Widget build(BuildContext context) {
    final progress = plan.progressPercent as double;
    final currentDay = plan.currentDay as int;
    final totalDays = plan.durationDays as int;
    final percent = (progress * 100).round();

    return Container(
      padding: const EdgeInsets.all(20),
      decoration: BoxDecoration(
        color: Colors.white,
        borderRadius: BorderRadius.circular(16),
        border: Border.all(color: Colors.black.withOpacity(0.06)),
        boxShadow: [
          BoxShadow(
            color: Colors.black.withOpacity(0.03),
            blurRadius: 4,
            offset: const Offset(0, 2),
          ),
        ],
      ),
      child: Column(
        children: [
          Row(
            children: [
              Text(
                'Day $currentDay of $totalDays',
                style: const TextStyle(
                  fontSize: 14,
                  fontWeight: FontWeight.w600,
                  color: _charcoal,
                ),
              ),
              const Spacer(),
              Text(
                '$percent%',
                style: TextStyle(
                  fontSize: 13,
                  fontWeight: FontWeight.w500,
                  color: Colors.grey.shade400,
                ),
              ),
            ],
          ),
          const SizedBox(height: 12),
          // Neumorphic progress bar
          Container(
            height: 10,
            decoration: BoxDecoration(
              color: Colors.grey.shade200,
              borderRadius: BorderRadius.circular(999),
            ),
            child: ClipRRect(
              borderRadius: BorderRadius.circular(999),
              child: Align(
                alignment: Alignment.centerLeft,
                child: FractionallySizedBox(
                  widthFactor: progress.clamp(0.02, 1.0),
                  child: Container(
                    decoration: BoxDecoration(
                      gradient: const LinearGradient(
                        colors: [_teal, Color(0xFF14B8A6)],
                      ),
                      borderRadius: BorderRadius.circular(999),
                      boxShadow: [
                        BoxShadow(
                          color: _teal.withOpacity(0.4),
                          blurRadius: 6,
                          offset: const Offset(0, 2),
                        ),
                      ],
                    ),
                  ),
                ),
              ),
            ),
          ),
        ],
      ),
    );
  }
}

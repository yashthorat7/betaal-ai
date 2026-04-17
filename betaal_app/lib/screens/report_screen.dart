import 'package:flutter/material.dart';
import 'package:provider/provider.dart';
import 'package:fl_chart/fl_chart.dart';
import '../providers/usage_provider.dart';
import '../providers/rehab_provider.dart';
import '../dummy/dummy_data.dart';
import '../models/usage_record.dart';
import 'app_usage_screen.dart';

class ReportScreen extends StatefulWidget {
  const ReportScreen({super.key});

  @override
  State<ReportScreen> createState() => _ReportScreenState();
}

class _ReportScreenState extends State<ReportScreen> {
  static const _teal = Color(0xFF26A69A);
  static const _primary = Color(0xFF3A86FF);
  static const _bgColor = Color(0xFFF2F2F2);
  static const _cardColor = Color(0xFFF9FAFB);
  static const _textMain = Color(0xFF333333);
  static const _textMuted = Color(0xFF6B7280);
  static const _borderColor = Color(0xFFE5E7EB);

  int _selectedFilter = 0;
  final _filters = ['Today', 'Yesterday', 'Weekly', 'Monthly', 'Yearly', 'All'];

  @override
  Widget build(BuildContext context) {
    final usage = context.watch<UsageProvider>();
    final rehab = context.watch<RehabProvider>();
    final plan = rehab.plan;

    // Get filtered data based on selected filter
    final filteredData = _getFilteredData(usage);
    final totalMin = filteredData['totalMin'] as int;
    final unlocks = filteredData['unlocks'] as int;
    final chartData = filteredData['chartData'] as List<FlSpot>;
    final chartLabels = filteredData['chartLabels'] as List<String>;
    final apps = filteredData['apps'] as List<AppUsage>;
    final prevTotalMin = filteredData['prevTotalMin'] as int;
    final prevUnlocks = filteredData['prevUnlocks'] as int;

    final hours = totalMin ~/ 60;
    final mins = totalMin % 60;

    // Comparison
    final timeDiff = totalMin - prevTotalMin;
    final timeDiffPercent = prevTotalMin > 0
        ? ((timeDiff / prevTotalMin) * 100).round()
        : 0;
    final unlockDiff = unlocks - prevUnlocks;

    // Status
    final quota = plan?.activePhase.dailyQuotaMin ?? 273;
    final isStable = totalMin <= quota;

    return Scaffold(
      backgroundColor: _bgColor,
      body: SafeArea(
        child: Column(
          children: [
            // --- TOP BAR ---
            Padding(
              padding: const EdgeInsets.fromLTRB(16, 16, 16, 8),
              child: Row(
                children: [
                  const SizedBox(width: 40),
                  const Expanded(
                    child: Text(
                      'REPORT',
                      textAlign: TextAlign.center,
                      style: TextStyle(
                        fontSize: 15,
                        fontWeight: FontWeight.w600,
                        letterSpacing: 1.2,
                        color: _textMain,
                      ),
                    ),
                  ),
                  Container(
                    width: 40,
                    height: 40,
                    alignment: Alignment.center,
                    child: const Icon(Icons.share_outlined, color: _textMain, size: 22),
                  ),
                ],
              ),
            ),

            // --- FILTER CHIPS ---
            SizedBox(
              height: 40,
              child: ListView.builder(
                scrollDirection: Axis.horizontal,
                padding: const EdgeInsets.symmetric(horizontal: 16),
                itemCount: _filters.length,
                itemBuilder: (_, i) {
                  final selected = i == _selectedFilter;
                  return Padding(
                    padding: const EdgeInsets.only(right: 10),
                    child: GestureDetector(
                      onTap: () => setState(() => _selectedFilter = i),
                      child: Container(
                        padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 8),
                        decoration: BoxDecoration(
                          color: selected ? _teal : Colors.white,
                          borderRadius: BorderRadius.circular(999),
                          border: selected ? null : Border.all(color: _borderColor),
                          boxShadow: [
                            BoxShadow(
                              color: Colors.black.withValues(alpha: 0.03),
                              blurRadius: 4,
                              offset: const Offset(0, 1),
                            ),
                          ],
                        ),
                        child: Text(
                          _filters[i],
                          style: TextStyle(
                            fontSize: 12,
                            fontWeight: FontWeight.w500,
                            color: selected ? Colors.white : _textMain,
                          ),
                        ),
                      ),
                    ),
                  );
                },
              ),
            ),
            const SizedBox(height: 12),

            // --- SCROLLABLE CONTENT ---
            Expanded(
              child: ListView(
                padding: const EdgeInsets.symmetric(horizontal: 16),
                children: [
                  const SizedBox(height: 8),

                  // --- ACTUAL USAGE CHART ---
                  _buildCard(
                    child: Column(
                      children: [
                        Row(
                          children: [
                            const Icon(Icons.show_chart, size: 18, color: _textMuted),
                            const SizedBox(width: 8),
                            const Text(
                              'ACTUAL USAGE',
                              style: TextStyle(
                                fontSize: 11,
                                fontWeight: FontWeight.w600,
                                letterSpacing: 1.5,
                                color: _textMuted,
                              ),
                            ),
                            const Spacer(),
                            Container(
                              width: 7,
                              height: 7,
                              decoration: const BoxDecoration(
                                color: _primary,
                                shape: BoxShape.circle,
                              ),
                            ),
                            const SizedBox(width: 6),
                            const Text(
                              'LIVE',
                              style: TextStyle(
                                fontSize: 10,
                                fontWeight: FontWeight.w500,
                                color: _primary,
                              ),
                            ),
                          ],
                        ),
                        const SizedBox(height: 20),
                        SizedBox(
                          height: 120,
                          child: _buildUsageChart(chartData, chartLabels),
                        ),
                      ],
                    ),
                    borderRadius: 24,
                    bgColor: Colors.white.withValues(alpha: 0.5),
                  ),
                  const SizedBox(height: 16),

                  // --- TODAY'S VITALS ---
                  _buildCard(
                    child: Column(
                      children: [
                        Row(
                          children: [
                            const Icon(Icons.monitor_heart_outlined, size: 18, color: _textMuted),
                            const SizedBox(width: 8),
                            const Text(
                              "TODAY'S VITALS",
                              style: TextStyle(
                                fontSize: 11,
                                fontWeight: FontWeight.w600,
                                letterSpacing: 1.5,
                                color: _textMuted,
                              ),
                            ),
                            const Spacer(),
                            Container(
                              padding: const EdgeInsets.symmetric(horizontal: 10, vertical: 4),
                              decoration: BoxDecoration(
                                color: isStable
                                    ? _teal.withValues(alpha: 0.1)
                                    : Colors.red.withValues(alpha: 0.1),
                                borderRadius: BorderRadius.circular(4),
                              ),
                              child: Text(
                                isStable ? 'STABLE' : 'HIGH',
                                style: TextStyle(
                                  fontSize: 10,
                                  fontWeight: FontWeight.w700,
                                  color: isStable ? _teal : Colors.red,
                                  letterSpacing: 0.5,
                                ),
                              ),
                            ),
                          ],
                        ),
                        const SizedBox(height: 20),
                        IntrinsicHeight(
                          child: Row(
                            children: [
                              // Screen time
                              Expanded(
                                child: Column(
                                  crossAxisAlignment: CrossAxisAlignment.start,
                                  children: [
                                    const Text(
                                      'Total screen time',
                                      style: TextStyle(fontSize: 11, color: _textMuted),
                                    ),
                                    const SizedBox(height: 6),
                                    Row(
                                      crossAxisAlignment: CrossAxisAlignment.baseline,
                                      textBaseline: TextBaseline.alphabetic,
                                      children: [
                                        Text(
                                          '$hours',
                                          style: const TextStyle(
                                            fontSize: 30,
                                            fontWeight: FontWeight.w300,
                                            color: _textMain,
                                          ),
                                        ),
                                        const Text(
                                          'h',
                                          style: TextStyle(
                                            fontSize: 16,
                                            fontWeight: FontWeight.w300,
                                            color: _textMuted,
                                          ),
                                        ),
                                        const SizedBox(width: 4),
                                        Text(
                                          '$mins',
                                          style: const TextStyle(
                                            fontSize: 30,
                                            fontWeight: FontWeight.w300,
                                            color: _textMain,
                                          ),
                                        ),
                                        const Text(
                                          'm',
                                          style: TextStyle(
                                            fontSize: 16,
                                            fontWeight: FontWeight.w300,
                                            color: _textMuted,
                                          ),
                                        ),
                                      ],
                                    ),
                                    const SizedBox(height: 6),
                                    Row(
                                      children: [
                                        Icon(
                                          timeDiff <= 0
                                              ? Icons.arrow_downward
                                              : Icons.arrow_upward,
                                          size: 14,
                                          color: _teal,
                                        ),
                                        const SizedBox(width: 2),
                                        Text(
                                          '${timeDiffPercent.abs()}% vs yesterday',
                                          style: const TextStyle(
                                            fontSize: 11,
                                            fontWeight: FontWeight.w500,
                                            color: _teal,
                                          ),
                                        ),
                                      ],
                                    ),
                                  ],
                                ),
                              ),
                              // Divider
                              Container(
                                width: 1,
                                color: Colors.grey.shade200,
                                margin: const EdgeInsets.symmetric(horizontal: 16),
                              ),
                              // Unlocks
                              Expanded(
                                child: Padding(
                                  padding: const EdgeInsets.only(left: 8),
                                  child: Column(
                                    crossAxisAlignment: CrossAxisAlignment.start,
                                    children: [
                                      const Text(
                                        'Unlocks',
                                        style: TextStyle(fontSize: 11, color: _textMuted),
                                      ),
                                      const SizedBox(height: 6),
                                      Text(
                                        '$unlocks',
                                        style: const TextStyle(
                                          fontSize: 30,
                                          fontWeight: FontWeight.w300,
                                          color: _textMain,
                                        ),
                                      ),
                                      const SizedBox(height: 6),
                                      Row(
                                        children: [
                                          Icon(
                                            unlockDiff <= 0
                                                ? Icons.arrow_downward
                                                : Icons.arrow_upward,
                                            size: 14,
                                            color: _teal,
                                          ),
                                          const SizedBox(width: 2),
                                          Text(
                                            '${unlockDiff.abs()} vs yesterday',
                                            style: const TextStyle(
                                              fontSize: 11,
                                              fontWeight: FontWeight.w500,
                                              color: _teal,
                                            ),
                                          ),
                                        ],
                                      ),
                                    ],
                                  ),
                                ),
                              ),
                            ],
                          ),
                        ),
                      ],
                    ),
                  ),
                  const SizedBox(height: 16),

                  // --- APP USAGE (clickable) ---
                  GestureDetector(
                    onTap: () {
                      Navigator.push(
                        context,
                        MaterialPageRoute(
                          builder: (_) => AppUsageScreen(apps: apps),
                        ),
                      );
                    },
                    child: _buildCard(
                      child: Column(
                        children: [
                          Row(
                            children: [
                              const Icon(Icons.pie_chart_outline, size: 18, color: _textMuted),
                              const SizedBox(width: 8),
                              const Text(
                                'APP USAGE',
                                style: TextStyle(
                                  fontSize: 11,
                                  fontWeight: FontWeight.w600,
                                  letterSpacing: 1.5,
                                  color: _textMuted,
                                ),
                              ),
                              const Spacer(),
                              Text(
                                _getFilterLabel(),
                                style: const TextStyle(fontSize: 10, color: _textMuted),
                              ),
                              const SizedBox(width: 4),
                              const Icon(Icons.chevron_right, size: 16, color: _textMuted),
                            ],
                          ),
                          const SizedBox(height: 20),
                          // Top 3 apps preview
                          ...apps.take(3).map((app) => _buildAppBar(app, apps)),
                        ],
                      ),
                    ),
                  ),
                  const SizedBox(height: 16),

                  // --- REHAB TIMELINE ---
                  if (plan != null)
                    _buildCard(
                      child: Column(
                        children: [
                          Row(
                            children: [
                              const Icon(Icons.calendar_month_outlined, size: 18, color: _textMuted),
                              const SizedBox(width: 8),
                              const Text(
                                'REHAB TIMELINE',
                                style: TextStyle(
                                  fontSize: 11,
                                  fontWeight: FontWeight.w600,
                                  letterSpacing: 1.5,
                                  color: _textMuted,
                                ),
                              ),
                              const Spacer(),
                              Container(
                                padding: const EdgeInsets.symmetric(horizontal: 10, vertical: 4),
                                decoration: BoxDecoration(
                                  color: Colors.blue.shade50,
                                  borderRadius: BorderRadius.circular(4),
                                ),
                                child: RichText(
                                  text: TextSpan(
                                    style: const TextStyle(fontSize: 10, fontWeight: FontWeight.w700),
                                    children: [
                                      TextSpan(
                                        text: 'Day ${plan.currentDay} ',
                                        style: TextStyle(color: Colors.blue.shade600),
                                      ),
                                      TextSpan(
                                        text: '/ ${plan.durationDays}',
                                        style: TextStyle(color: Colors.blue.shade300),
                                      ),
                                    ],
                                  ),
                                ),
                              ),
                            ],
                          ),
                          const SizedBox(height: 36),
                          // Timeline
                          _buildTimeline(plan),
                          const SizedBox(height: 20),
                          Text(
                            'You are currently in the ${plan.activePhase.name} Phase. '
                            'Maintain low dopamine triggers to proceed to the next phase.',
                            textAlign: TextAlign.center,
                            style: const TextStyle(
                              fontSize: 11,
                              height: 1.5,
                              color: _textMuted,
                            ),
                          ),
                        ],
                      ),
                    ),
                  // Extra padding so content doesn't hide behind floating nav bar
                  const SizedBox(height: 88),
                ],
              ),
            ),
          ],
        ),
      ),
    );
  }

  // --- HELPERS ---

  String _getFilterLabel() {
    switch (_selectedFilter) {
      case 0: return 'Past 24h';
      case 1: return 'Yesterday';
      case 2: return 'Past 7 days';
      case 3: return 'Past 30 days';
      case 4: return 'Past year';
      default: return 'All time';
    }
  }

  Map<String, dynamic> _getFilteredData(UsageProvider usage) {
    final logs = DummyData.getUsageLogs();
    final apps = usage.todayApps;

    switch (_selectedFilter) {
      case 0: // Today
        final today = usage.today;
        final yesterday = logs.length >= 2 ? logs[logs.length - 2] : null;
        return {
          'totalMin': today?.totalMin ?? 0,
          'unlocks': today?.unlocks ?? 0,
          'prevTotalMin': yesterday?.totalMin ?? 0,
          'prevUnlocks': yesterday?.unlocks ?? 0,
          'apps': apps,
          'chartData': _generateHourlyData(today?.totalMin ?? 185),
          'chartLabels': ['6AM', '9AM', '12PM', '3PM', '6PM', '9PM'],
        };
      case 1: // Yesterday
        final yesterday = logs.length >= 2 ? logs[logs.length - 2] : null;
        final dayBefore = logs.length >= 3 ? logs[logs.length - 3] : null;
        return {
          'totalMin': yesterday?.totalMin ?? 0,
          'unlocks': yesterday?.unlocks ?? 0,
          'prevTotalMin': dayBefore?.totalMin ?? 0,
          'prevUnlocks': dayBefore?.unlocks ?? 0,
          'apps': apps,
          'chartData': _generateHourlyData(yesterday?.totalMin ?? 200),
          'chartLabels': ['6AM', '9AM', '12PM', '3PM', '6PM', '9PM'],
        };
      case 2: // Weekly
        final weekLogs = logs.length >= 7 ? logs.sublist(logs.length - 7) : logs;
        final totalMin = weekLogs.fold(0, (sum, r) => sum + r.totalMin);
        final totalUnlocks = weekLogs.fold(0, (sum, r) => sum + r.unlocks);
        final prevWeek = logs.length >= 14 ? logs.sublist(logs.length - 14, logs.length - 7) : <UsageRecord>[];
        final prevMin = prevWeek.fold(0, (sum, r) => sum + r.totalMin);
        final prevUnlocks = prevWeek.fold(0, (sum, r) => sum + r.unlocks);
        return {
          'totalMin': totalMin,
          'unlocks': totalUnlocks,
          'prevTotalMin': prevMin,
          'prevUnlocks': prevUnlocks,
          'apps': apps,
          'chartData': weekLogs.asMap().entries.map((e) =>
            FlSpot(e.key.toDouble(), e.value.totalMin.toDouble())).toList(),
          'chartLabels': ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
        };
      case 3: // Monthly
        final totalMin = logs.fold(0, (sum, r) => sum + r.totalMin);
        final totalUnlocks = logs.fold(0, (sum, r) => sum + r.unlocks);
        return {
          'totalMin': totalMin,
          'unlocks': totalUnlocks,
          'prevTotalMin': (totalMin * 1.2).round(),
          'prevUnlocks': (totalUnlocks * 1.1).round(),
          'apps': apps,
          'chartData': logs.asMap().entries.map((e) =>
            FlSpot(e.key.toDouble(), e.value.totalMin.toDouble())).toList(),
          'chartLabels': List.generate(logs.length, (i) => 'D${i + 1}'),
        };
      default: // Yearly, All
        final totalMin = logs.fold(0, (sum, r) => sum + r.totalMin);
        final totalUnlocks = logs.fold(0, (sum, r) => sum + r.unlocks);
        return {
          'totalMin': totalMin,
          'unlocks': totalUnlocks,
          'prevTotalMin': 0,
          'prevUnlocks': 0,
          'apps': apps,
          'chartData': logs.asMap().entries.map((e) =>
            FlSpot(e.key.toDouble(), e.value.totalMin.toDouble())).toList(),
          'chartLabels': List.generate(logs.length, (i) => '${i + 1}'),
        };
    }
  }

  List<FlSpot> _generateHourlyData(int totalMin) {
    // Simulate hourly distribution for a day
    final fractions = [0.05, 0.15, 0.25, 0.2, 0.15, 0.2];
    double cumulative = 0;
    return List.generate(6, (i) {
      cumulative += fractions[i] * totalMin;
      return FlSpot(i.toDouble(), cumulative);
    });
  }

  Widget _buildCard({
    required Widget child,
    double borderRadius = 24,
    Color? bgColor,
  }) {
    return Container(
      padding: const EdgeInsets.all(20),
      decoration: BoxDecoration(
        color: bgColor ?? _cardColor,
        borderRadius: BorderRadius.circular(borderRadius),
        border: Border.all(color: _borderColor),
        boxShadow: [
          BoxShadow(
            color: Colors.black.withValues(alpha: 0.03),
            blurRadius: 8,
            offset: const Offset(0, 2),
          ),
        ],
      ),
      child: child,
    );
  }

  Widget _buildUsageChart(List<FlSpot> data, List<String> labels) {
    if (data.isEmpty) return const SizedBox.shrink();
    final maxY = data.map((s) => s.y).reduce((a, b) => a > b ? a : b) * 1.2;

    return LineChart(
      LineChartData(
        lineTouchData: LineTouchData(
          enabled: true,
          // Single tap to select, stays until tap elsewhere
          touchTooltipData: LineTouchTooltipData(
            getTooltipColor: (_) => Colors.white,
            tooltipBorder: const BorderSide(color: _borderColor, width: 1),
            tooltipRoundedRadius: 8,
            tooltipPadding: const EdgeInsets.symmetric(horizontal: 12, vertical: 6),
            getTooltipItems: (touchedSpots) {
              return touchedSpots.map((spot) {
                final mins = spot.y.round();
                final h = mins ~/ 60;
                final m = mins % 60;
                final text = h > 0 ? '${h}h ${m}m' : '${m}m';
                return LineTooltipItem(
                  text,
                  const TextStyle(
                    color: _textMain,
                    fontWeight: FontWeight.w600,
                    fontSize: 13,
                  ),
                );
              }).toList();
            },
          ),
          // Vertical dashed indicator line
          getTouchedSpotIndicator: (barData, spotIndexes) {
            return spotIndexes.map((index) {
              return TouchedSpotIndicatorData(
                FlLine(
                  color: Colors.grey.shade400,
                  strokeWidth: 1,
                  dashArray: [4, 4],
                ),
                FlDotData(
                  show: true,
                  getDotPainter: (_, __, ___, ____) => FlDotCirclePainter(
                    radius: 5,
                    color: _teal,
                    strokeWidth: 2,
                    strokeColor: Colors.white,
                  ),
                ),
              );
            }).toList();
          },
          handleBuiltInTouches: true,
        ),
        gridData: FlGridData(
          show: true,
          drawVerticalLine: false,
          horizontalInterval: maxY / 3,
          getDrawingHorizontalLine: (_) => FlLine(
            color: Colors.grey.shade200,
            strokeWidth: 1,
            dashArray: [4, 4],
          ),
        ),
        titlesData: FlTitlesData(
          topTitles: const AxisTitles(sideTitles: SideTitles(showTitles: false)),
          rightTitles: const AxisTitles(sideTitles: SideTitles(showTitles: false)),
          leftTitles: const AxisTitles(sideTitles: SideTitles(showTitles: false)),
          bottomTitles: AxisTitles(
            sideTitles: SideTitles(
              showTitles: true,
              reservedSize: 20,
              interval: 1,
              getTitlesWidget: (value, _) {
                final idx = value.toInt();
                if (idx < 0 || idx >= labels.length) return const SizedBox();
                return Text(
                  labels[idx],
                  style: const TextStyle(
                    fontSize: 9,
                    color: _textMuted,
                    fontWeight: FontWeight.w500,
                    letterSpacing: 0.5,
                  ),
                );
              },
            ),
          ),
        ),
        borderData: FlBorderData(show: false),
        minY: 0,
        maxY: maxY,
        lineBarsData: [
          LineChartBarData(
            spots: data,
            isCurved: true,
            color: _primary,
            barWidth: 2,
            dotData: FlDotData(
              show: true,
              getDotPainter: (spot, _, __, ___) {
                if (spot == data.last) {
                  return FlDotCirclePainter(
                    radius: 3,
                    color: _primary,
                    strokeWidth: 0,
                  );
                }
                return FlDotCirclePainter(radius: 0, color: Colors.transparent, strokeWidth: 0);
              },
            ),
            belowBarData: BarAreaData(
              show: true,
              gradient: LinearGradient(
                begin: Alignment.topCenter,
                end: Alignment.bottomCenter,
                colors: [
                  _primary.withValues(alpha: 0.2),
                  _primary.withValues(alpha: 0.0),
                ],
              ),
            ),
          ),
        ],
      ),
    );
  }

  Widget _buildAppBar(AppUsage app, List<AppUsage> allApps) {
    final maxMin = allApps.map((a) => a.minutes).reduce((a, b) => a > b ? a : b);
    final fraction = maxMin > 0 ? app.minutes / maxMin : 0.0;
    final hours = app.minutes ~/ 60;
    final mins = app.minutes % 60;
    final timeStr = hours > 0 ? '${hours}h ${mins}m' : '${mins}m';

    return Padding(
      padding: const EdgeInsets.only(bottom: 16),
      child: Column(
        children: [
          Row(
            children: [
              Container(
                width: 6,
                height: 6,
                decoration: BoxDecoration(
                  color: _textMain.withValues(alpha: fraction > 0.5 ? 1.0 : 0.4),
                  shape: BoxShape.circle,
                ),
              ),
              const SizedBox(width: 8),
              Text(
                app.appName,
                style: const TextStyle(
                  fontSize: 12,
                  fontWeight: FontWeight.w500,
                  color: _textMain,
                ),
              ),
              const Spacer(),
              Text(
                timeStr,
                style: const TextStyle(fontSize: 10, color: _textMuted),
              ),
            ],
          ),
          const SizedBox(height: 6),
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
                      color: _teal.withValues(alpha: 0.6 + fraction * 0.4),
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
  }

  Widget _buildTimeline(dynamic plan) {
    final progress = plan.progressPercent as double;

    return Column(
      children: [
        // "Current Stage" label
        Align(
          alignment: Alignment(progress * 2 - 1, 0),
          child: Column(
            children: [
              Container(
                padding: const EdgeInsets.symmetric(horizontal: 8, vertical: 3),
                decoration: BoxDecoration(
                  color: _textMain,
                  borderRadius: BorderRadius.circular(4),
                  boxShadow: [
                    BoxShadow(
                      color: Colors.black.withValues(alpha: 0.1),
                      blurRadius: 4,
                    ),
                  ],
                ),
                child: const Text(
                  'Current Stage',
                  style: TextStyle(
                    fontSize: 9,
                    fontWeight: FontWeight.w700,
                    color: Colors.white,
                  ),
                ),
              ),
              // Triangle
              CustomPaint(
                size: const Size(8, 4),
                painter: _TrianglePainter(color: _textMain),
              ),
            ],
          ),
        ),
        const SizedBox(height: 4),
        // Track
        SizedBox(
          height: 14,
          child: Stack(
            children: [
              // Background track
              Positioned(
                left: 0,
                right: 0,
                top: 6,
                child: Container(
                  height: 4,
                  decoration: BoxDecoration(
                    color: Colors.grey.shade200,
                    borderRadius: BorderRadius.circular(999),
                  ),
                ),
              ),
              // Filled track
              Positioned(
                left: 0,
                top: 6,
                child: FractionallySizedBox(
                  child: Container(
                    width: MediaQuery.of(context).size.width * progress * 0.75,
                    height: 4,
                    decoration: BoxDecoration(
                      color: Colors.blue.shade600,
                      borderRadius: BorderRadius.circular(999),
                    ),
                  ),
                ),
              ),
              // Start dot
              Positioned(
                left: 0,
                top: 3,
                child: Container(
                  width: 8,
                  height: 8,
                  decoration: BoxDecoration(
                    color: Colors.blue.shade600,
                    shape: BoxShape.circle,
                    boxShadow: const [
                      BoxShadow(
                        color: Colors.white,
                        spreadRadius: 3,
                      ),
                    ],
                  ),
                ),
              ),
              // Current position dot
              Positioned(
                left: MediaQuery.of(context).size.width * progress * 0.75 - 7,
                top: 0,
                child: Container(
                  width: 14,
                  height: 14,
                  decoration: BoxDecoration(
                    color: const Color(0xFF22D3EE),
                    shape: BoxShape.circle,
                    border: Border.all(color: Colors.white, width: 3),
                    boxShadow: [
                      BoxShadow(
                        color: Colors.black.withValues(alpha: 0.15),
                        blurRadius: 4,
                      ),
                    ],
                  ),
                ),
              ),
              // End dot
              Positioned(
                right: 0,
                top: 3,
                child: Container(
                  width: 8,
                  height: 8,
                  decoration: BoxDecoration(
                    color: Colors.grey.shade300,
                    shape: BoxShape.circle,
                  ),
                ),
              ),
            ],
          ),
        ),
        const SizedBox(height: 8),
        // Labels
        const Row(
          mainAxisAlignment: MainAxisAlignment.spaceBetween,
          children: [
            Text('Start', style: TextStyle(fontSize: 10, color: _textMuted, fontWeight: FontWeight.w500)),
            Text('Goal', style: TextStyle(fontSize: 10, color: _textMuted, fontWeight: FontWeight.w500)),
          ],
        ),
      ],
    );
  }
}

class _TrianglePainter extends CustomPainter {
  final Color color;
  _TrianglePainter({required this.color});

  @override
  void paint(Canvas canvas, Size size) {
    final paint = Paint()..color = color;
    final path = Path()
      ..moveTo(0, 0)
      ..lineTo(size.width, 0)
      ..lineTo(size.width / 2, size.height)
      ..close();
    canvas.drawPath(path, paint);
  }

  @override
  bool shouldRepaint(covariant CustomPainter oldDelegate) => false;
}

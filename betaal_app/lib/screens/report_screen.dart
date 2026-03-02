import 'package:flutter/material.dart';
import 'package:provider/provider.dart';
import 'package:fl_chart/fl_chart.dart';
import '../providers/usage_provider.dart';
import '../providers/rehab_provider.dart';
import '../dummy/dummy_data.dart';

class ReportScreen extends StatelessWidget {
  const ReportScreen({super.key});

  @override
  Widget build(BuildContext context) {
    final usage = context.watch<UsageProvider>();
    final rehab = context.watch<RehabProvider>();
    final today = usage.today;
    final plan = rehab.plan;
    final badges = DummyData.getBadges();

    return Scaffold(
      body: SafeArea(
        child: ListView(
          padding: const EdgeInsets.all(16),
          children: [
            const Text('Report', style: TextStyle(fontSize: 24, fontWeight: FontWeight.bold)),
            const SizedBox(height: 16),

            // Today's summary card
            Card(
              child: Padding(
                padding: const EdgeInsets.all(16),
                child: Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    const Text('Today', style: TextStyle(fontWeight: FontWeight.bold, fontSize: 16)),
                    const SizedBox(height: 12),
                    Row(
                      mainAxisAlignment: MainAxisAlignment.spaceBetween,
                      children: [
                        _miniStat('Total', '${today?.totalMin ?? 0}m'),
                        _miniStat('Unlocks', '${today?.unlocks ?? 0}'),
                        _miniStat('Top App', today?.topApp ?? '-'),
                        _miniStat('vs Yesterday', '-15m'),
                      ],
                    ),
                  ],
                ),
              ),
            ),
            const SizedBox(height: 16),

            // Weekly bar chart
            const Text('This Week', style: TextStyle(fontWeight: FontWeight.bold, fontSize: 16)),
            const SizedBox(height: 8),
            SizedBox(
              height: 200,
              child: _weeklyChart(usage.week),
            ),
            const SizedBox(height: 20),

            // Badges / Achievements
            const Text('Achievements', style: TextStyle(fontWeight: FontWeight.bold, fontSize: 16)),
            const SizedBox(height: 8),
            SizedBox(
              height: 100,
              child: ListView.builder(
                scrollDirection: Axis.horizontal,
                itemCount: badges.length,
                itemBuilder: (_, i) {
                  final b = badges[i];
                  return Container(
                    width: 80,
                    margin: const EdgeInsets.only(right: 8),
                    child: Column(
                      children: [
                        CircleAvatar(
                          radius: 24,
                          backgroundColor: b.earned ? Colors.black : Colors.grey.shade200,
                          child: Icon(b.icon, color: b.earned ? Colors.white : Colors.grey, size: 24),
                        ),
                        const SizedBox(height: 4),
                        Text(b.name, style: const TextStyle(fontSize: 10), textAlign: TextAlign.center, maxLines: 2),
                      ],
                    ),
                  );
                },
              ),
            ),
            const SizedBox(height: 16),

            // Rehab progress
            if (plan != null) ...[
              const Text('Rehab Progress', style: TextStyle(fontWeight: FontWeight.bold, fontSize: 16)),
              const SizedBox(height: 8),
              Card(
                child: Padding(
                  padding: const EdgeInsets.all(16),
                  child: Column(
                    children: [
                      Row(
                        children: [
                          Text('Day ${plan.currentDay} of ${plan.durationDays}'),
                          const Spacer(),
                          Text('Phase ${plan.currentPhase}: ${plan.activePhase.name}',
                              style: const TextStyle(fontWeight: FontWeight.bold)),
                        ],
                      ),
                      const SizedBox(height: 8),
                      LinearProgressIndicator(
                        value: plan.progressPercent,
                        minHeight: 10,
                        borderRadius: BorderRadius.circular(5),
                      ),
                    ],
                  ),
                ),
              ),
            ],
            const SizedBox(height: 16),

            // Top 5 apps breakdown
            const Text('App Breakdown', style: TextStyle(fontWeight: FontWeight.bold, fontSize: 16)),
            const SizedBox(height: 8),
            ...usage.todayApps.map((app) => Padding(
              padding: const EdgeInsets.only(bottom: 8),
              child: Row(
                children: [
                  SizedBox(width: 80, child: Text(app.appName, style: const TextStyle(fontSize: 13))),
                  Expanded(
                    child: LinearProgressIndicator(
                      value: app.minutes / 60,
                      minHeight: 16,
                      borderRadius: BorderRadius.circular(8),
                    ),
                  ),
                  const SizedBox(width: 8),
                  Text('${app.minutes}m', style: const TextStyle(fontWeight: FontWeight.bold, fontSize: 13)),
                ],
              ),
            )),
            const SizedBox(height: 16),

            // 30-day trend line chart
            const Text('30-Day Trend', style: TextStyle(fontWeight: FontWeight.bold, fontSize: 16)),
            const SizedBox(height: 8),
            SizedBox(
              height: 180,
              child: _trendChart(),
            ),
            const SizedBox(height: 16),

            // Interruptions log
            Card(
              child: Padding(
                padding: const EdgeInsets.all(16),
                child: Row(
                  mainAxisAlignment: MainAxisAlignment.spaceBetween,
                  children: [
                    const Column(
                      crossAxisAlignment: CrossAxisAlignment.start,
                      children: [
                        Text('Interruptions Today', style: TextStyle(fontWeight: FontWeight.bold)),
                        SizedBox(height: 4),
                        Text('6 triggered', style: TextStyle(fontSize: 24, fontWeight: FontWeight.bold)),
                      ],
                    ),
                    Column(
                      crossAxisAlignment: CrossAxisAlignment.end,
                      children: [
                        Text('This Week', style: TextStyle(color: Colors.grey.shade600)),
                        const SizedBox(height: 4),
                        const Text('32 total', style: TextStyle(fontSize: 16)),
                      ],
                    ),
                  ],
                ),
              ),
            ),
            const SizedBox(height: 32),
          ],
        ),
      ),
    );
  }

  Widget _miniStat(String label, String value) {
    return Column(
      children: [
        Text(value, style: const TextStyle(fontWeight: FontWeight.bold, fontSize: 16)),
        Text(label, style: const TextStyle(fontSize: 11, color: Colors.grey)),
      ],
    );
  }

  Widget _weeklyChart(List<dynamic> week) {
    final days = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
    final totals = DummyData.getWeeklyReport()['daily_totals'] as List;
    return BarChart(
      BarChartData(
        alignment: BarChartAlignment.spaceAround,
        maxY: 350,
        barTouchData: BarTouchData(enabled: false),
        titlesData: FlTitlesData(
          bottomTitles: AxisTitles(
            sideTitles: SideTitles(
              showTitles: true,
              getTitlesWidget: (v, _) => Text(days[v.toInt() % 7], style: const TextStyle(fontSize: 10)),
            ),
          ),
          leftTitles: AxisTitles(
            sideTitles: SideTitles(
              showTitles: true,
              reservedSize: 32,
              getTitlesWidget: (v, _) => Text('${v.toInt()}', style: const TextStyle(fontSize: 9)),
            ),
          ),
          topTitles: const AxisTitles(sideTitles: SideTitles(showTitles: false)),
          rightTitles: const AxisTitles(sideTitles: SideTitles(showTitles: false)),
        ),
        gridData: const FlGridData(show: false),
        borderData: FlBorderData(show: false),
        barGroups: List.generate(7, (i) {
          final val = (totals[i] as num).toDouble();
          return BarChartGroupData(x: i, barRods: [
            BarChartRodData(
              toY: val,
              width: 20,
              borderRadius: BorderRadius.circular(4),
              color: val > 273 ? Colors.red.shade300 : Colors.black87,
            ),
          ]);
        }),
      ),
    );
  }

  Widget _trendChart() {
    final logs = DummyData.getUsageLogs();
    return LineChart(
      LineChartData(
        gridData: const FlGridData(show: false),
        titlesData: const FlTitlesData(
          topTitles: AxisTitles(sideTitles: SideTitles(showTitles: false)),
          rightTitles: AxisTitles(sideTitles: SideTitles(showTitles: false)),
          bottomTitles: AxisTitles(sideTitles: SideTitles(showTitles: false)),
          leftTitles: AxisTitles(
            sideTitles: SideTitles(
              showTitles: true,
              reservedSize: 32,
              getTitlesWidget: _trendLeftTitle,
            ),
          ),
        ),
        borderData: FlBorderData(show: false),
        lineBarsData: [
          LineChartBarData(
            spots: List.generate(logs.length, (i) => FlSpot(i.toDouble(), logs[i].totalMin.toDouble())),
            isCurved: true,
            color: Colors.black87,
            barWidth: 2,
            dotData: const FlDotData(show: false),
            belowBarData: BarAreaData(show: true, color: Colors.black.withAlpha(25)),
          ),
        ],
      ),
    );
  }

  static Widget _trendLeftTitle(double value, TitleMeta meta) {
    return Text('${value.toInt()}', style: const TextStyle(fontSize: 9));
  }
}

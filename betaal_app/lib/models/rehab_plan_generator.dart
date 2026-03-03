import 'rehab_plan.dart';
import '../core/enums.dart';

/// Generates a real RehabPlan locally from addiction level + strictness.
class RehabPlanGenerator {
  static const _baseline = 420; // minutes
  static const _phaseRatios = [0.90, 0.65, 0.40, 0.20];
  static const _phaseCuts = [0.20, 0.50, 0.80, 1.00]; // cumulative duration %

  static final _phaseNames = [
    RehabPhaseName.awareness,
    RehabPhaseName.reduction,
    RehabPhaseName.discipline,
    RehabPhaseName.freedom,
  ];

  /// Generate a plan. [startDate] is ISO 8601 date string (yyyy-MM-dd).
  static RehabPlan generate({
    required int addictionLevel,
    required int strictness,
    required String startDate,
  }) {
    final duration = (addictionLevel * 3 * (6 - strictness)).clamp(7, 90);
    final start = DateTime.parse(startDate);
    final today = DateTime.now();
    final daysSinceStart = today.difference(start).inDays;
    final currentDay = (daysSinceStart + 1).clamp(1, duration);

    // Build phases
    final phases = <RehabPhase>[];
    int prevEnd = 0;
    for (int i = 0; i < 4; i++) {
      final endDay = (_phaseCuts[i] * duration).round().clamp(prevEnd + 1, duration);
      final startDay = prevEnd + 1;
      phases.add(RehabPhase(
        phase: i + 1,
        name: _phaseNames[i].name[0].toUpperCase() + _phaseNames[i].name.substring(1),
        startDay: startDay,
        endDay: endDay,
        dailyQuotaMin: (_baseline * _phaseRatios[i]).round(),
        intensity: (i + 1) * 0.25,
      ));
      prevEnd = endDay;
    }

    // Determine current phase
    int currentPhase = 1;
    for (final p in phases) {
      if (currentDay >= p.startDay && currentDay <= p.endDay) {
        currentPhase = p.phase;
        break;
      }
    }

    return RehabPlan(
      uid: 'local',
      durationDays: duration,
      startDate: startDate,
      currentPhase: currentPhase,
      currentDay: currentDay,
      phases: phases,
    );
  }
}

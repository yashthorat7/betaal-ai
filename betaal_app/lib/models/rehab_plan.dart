class RehabPhase {
  final int phase;
  final String name;
  final int startDay;
  final int endDay;
  final int dailyQuotaMin;
  final double intensity;

  RehabPhase({
    required this.phase,
    required this.name,
    required this.startDay,
    required this.endDay,
    required this.dailyQuotaMin,
    required this.intensity,
  });

  factory RehabPhase.fromJson(Map<String, dynamic> json) {
    return RehabPhase(
      phase: json['phase'] ?? 0,
      name: json['name'] ?? '',
      startDay: json['start_day'] ?? 0,
      endDay: json['end_day'] ?? 0,
      dailyQuotaMin: json['daily_quota_min'] ?? 0,
      intensity: (json['intensity'] ?? 0).toDouble(),
    );
  }
}

class RehabPlan {
  final String uid;
  final int durationDays;
  final String startDate;
  final int currentPhase;
  final int currentDay;
  final List<RehabPhase> phases;

  RehabPlan({
    required this.uid,
    required this.durationDays,
    required this.startDate,
    required this.currentPhase,
    required this.currentDay,
    required this.phases,
  });

  factory RehabPlan.fromJson(Map<String, dynamic> json) {
    return RehabPlan(
      uid: json['uid'] ?? '',
      durationDays: json['duration_days'] ?? 0,
      startDate: json['start_date'] ?? '',
      currentPhase: json['current_phase'] ?? 1,
      currentDay: json['current_day'] ?? 1,
      phases: (json['phases'] as List? ?? [])
          .map((p) => RehabPhase.fromJson(p))
          .toList(),
    );
  }

  double get progressPercent => currentDay / durationDays;

  RehabPhase get activePhase =>
      phases.firstWhere((p) => p.phase == currentPhase, orElse: () => phases.first);
}

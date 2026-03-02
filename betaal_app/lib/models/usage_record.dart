class UsageRecord {
  final String date;
  final int totalMin;
  final int unlocks;
  final String topApp;
  final bool underQuota;

  UsageRecord({
    required this.date,
    required this.totalMin,
    required this.unlocks,
    required this.topApp,
    required this.underQuota,
  });

  factory UsageRecord.fromJson(Map<String, dynamic> json) {
    return UsageRecord(
      date: json['date'] ?? '',
      totalMin: json['total_min'] ?? 0,
      unlocks: json['unlocks'] ?? 0,
      topApp: json['top_app'] ?? '',
      underQuota: json['under_quota'] ?? false,
    );
  }

  Map<String, dynamic> toJson() => {
    'date': date,
    'total_min': totalMin,
    'unlocks': unlocks,
    'top_app': topApp,
    'under_quota': underQuota,
  };
}

class AppUsage {
  final String appName;
  final String category;
  final int minutes;

  AppUsage({
    required this.appName,
    required this.category,
    required this.minutes,
  });

  factory AppUsage.fromJson(Map<String, dynamic> json) {
    return AppUsage(
      appName: json['app_name'] ?? '',
      category: json['category'] ?? '',
      minutes: json['minutes'] ?? 0,
    );
  }
}

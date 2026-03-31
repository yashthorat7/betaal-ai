import 'package:flutter/material.dart';
import '../models/user_model.dart';
import '../models/usage_record.dart';
import '../models/rehab_plan.dart';
import '../models/interruption.dart';
import '../models/chat_message.dart';
import '../models/badge_model.dart';

class DummyData {
  static UserModel getUser() => UserModel(
    uid: 'demo_user_001',
    name: 'Arjun',
    age: 19,
    email: 'arjun.demo@gmail.com',
    addictionLevel: 8,
    strictness: 3,
    createdAt: '2025-01-01T00:00:00Z',
  );

  static RehabPlan getRehabPlan() => RehabPlan.fromJson({
    'uid': 'demo_user_001',
    'duration_days': 24,
    'start_date': '2025-01-01',
    'current_phase': 2,
    'current_day': 8,
    'phases': [
      {'phase': 1, 'name': 'Awareness', 'start_day': 1, 'end_day': 5, 'daily_quota_min': 378, 'intensity': 0.2},
      {'phase': 2, 'name': 'Reduction', 'start_day': 6, 'end_day': 12, 'daily_quota_min': 273, 'intensity': 0.5},
      {'phase': 3, 'name': 'Discipline', 'start_day': 13, 'end_day': 19, 'daily_quota_min': 168, 'intensity': 0.8},
      {'phase': 4, 'name': 'Freedom', 'start_day': 20, 'end_day': 24, 'daily_quota_min': 84, 'intensity': 0.5},
    ],
  });

  static List<UsageRecord> getUsageLogs() => [
    UsageRecord(date: '2025-01-01', totalMin: 420, unlocks: 78, topApp: 'Instagram', underQuota: false),
    UsageRecord(date: '2025-01-02', totalMin: 405, unlocks: 72, topApp: 'YouTube', underQuota: false),
    UsageRecord(date: '2025-01-03', totalMin: 390, unlocks: 65, topApp: 'Instagram', underQuota: false),
    UsageRecord(date: '2025-01-04', totalMin: 410, unlocks: 70, topApp: 'TikTok', underQuota: false),
    UsageRecord(date: '2025-01-05', totalMin: 370, unlocks: 60, topApp: 'YouTube', underQuota: true),
    UsageRecord(date: '2025-01-06', totalMin: 340, unlocks: 55, topApp: 'Instagram', underQuota: false),
    UsageRecord(date: '2025-01-07', totalMin: 310, unlocks: 48, topApp: 'YouTube', underQuota: false),
    UsageRecord(date: '2025-01-08', totalMin: 285, unlocks: 42, topApp: 'Instagram', underQuota: false),
    UsageRecord(date: '2025-01-09', totalMin: 260, unlocks: 38, topApp: 'WhatsApp', underQuota: true),
    UsageRecord(date: '2025-01-10', totalMin: 240, unlocks: 35, topApp: 'YouTube', underQuota: true),
    UsageRecord(date: '2025-01-11', totalMin: 255, unlocks: 40, topApp: 'TikTok', underQuota: true),
    UsageRecord(date: '2025-01-12', totalMin: 220, unlocks: 30, topApp: 'Instagram', underQuota: true),
    UsageRecord(date: '2025-01-13', totalMin: 200, unlocks: 28, topApp: 'YouTube', underQuota: false),
    UsageRecord(date: '2025-01-14', totalMin: 185, unlocks: 25, topApp: 'WhatsApp', underQuota: true),
  ];

  static UsageRecord getToday() => getUsageLogs().last;

  static List<UsageRecord> getWeek() => getUsageLogs().sublist(7);

  static List<AppUsage> getTodayApps() => [
    AppUsage(appName: 'Instagram', category: 'social', minutes: 52),
    AppUsage(appName: 'YouTube', category: 'entertainment', minutes: 45),
    AppUsage(appName: 'WhatsApp', category: 'messaging', minutes: 38),
    AppUsage(appName: 'BGMI', category: 'gaming', minutes: 28),
    AppUsage(appName: 'Chrome', category: 'browser', minutes: 22),
  ];

  static List<Interruption> getTodayInterruptions() => [
    Interruption(timeOffsetMin: 3, type: 'blur_screen', intensity: 0.3, durationSec: 10),
    Interruption(timeOffsetMin: 6, type: 'tint', intensity: 0.5, durationSec: 15),
    Interruption(timeOffsetMin: 10, type: 'grayscale', intensity: 0.8, durationSec: 30),
    Interruption(timeOffsetMin: 14, type: 'black_screen', intensity: 0.8, durationSec: 12),
    Interruption(timeOffsetMin: 18, type: 'pixel_rain', intensity: 0.6, durationSec: 15),
    Interruption(timeOffsetMin: 22, type: 'loading', intensity: 0.6, durationSec: 8),
    Interruption(timeOffsetMin: 26, type: 'delayed_touch', intensity: 0.7, durationSec: 20),
    Interruption(timeOffsetMin: 30, type: 'mistouch', intensity: 0.9, durationSec: 30),
    Interruption(timeOffsetMin: 34, type: 'static_noise', intensity: 0.7, durationSec: 12),
    Interruption(timeOffsetMin: 38, type: 'fly', intensity: 0.5, durationSec: 25),
    Interruption(timeOffsetMin: 42, type: 'vibrate_pulse', intensity: 0.8, durationSec: 10),
    Interruption(timeOffsetMin: 46, type: 'timer_overlay', intensity: 0.4, durationSec: 60),
    Interruption(timeOffsetMin: 50, type: 'swapped_touch', intensity: 0.6, durationSec: 20),
    Interruption(timeOffsetMin: 54, type: 'shame_counter', intensity: 1.0, durationSec: 15),
    Interruption(timeOffsetMin: 58, type: 'quiz_gate', intensity: 1.0, durationSec: 0),
    Interruption(timeOffsetMin: 62, type: 'flicker', intensity: 0.8, durationSec: 10),
    Interruption(timeOffsetMin: 66, type: 'invert_colors', intensity: 1.0, durationSec: 20),
    Interruption(timeOffsetMin: 70, type: 'half_block', intensity: 0.7, durationSec: 20),
    Interruption(timeOffsetMin: 74, type: 'earthquake', intensity: 0.9, durationSec: 25),
    Interruption(timeOffsetMin: 78, type: 'force_rotate', intensity: 1.0, durationSec: 30),
    Interruption(timeOffsetMin: 82, type: 'volume_zero', intensity: 1.0, durationSec: 60),
    Interruption(timeOffsetMin: 86, type: 'warning', intensity: 1.0, durationSec: 15),
    Interruption(timeOffsetMin: 90, type: 'close_app', intensity: 1.0, durationSec: 0),
  ];

  static List<AchievementBadge> getBadges() => [
    AchievementBadge(id: '1', name: 'First Day', description: 'Completed your first day', icon: Icons.star, earned: true, progress: 100),
    AchievementBadge(id: '2', name: '3-Day Streak', description: '3 consecutive days under quota', icon: Icons.local_fire_department, earned: true, progress: 100),
    AchievementBadge(id: '3', name: '7-Day Streak', description: '7 consecutive days under quota', icon: Icons.whatshot, earned: false, progress: 43),
    AchievementBadge(id: '4', name: 'Focus Master', description: 'Under 2 hours screen time', icon: Icons.center_focus_strong, earned: false, progress: 70),
    AchievementBadge(id: '5', name: 'Alpha Rehabber', description: 'Complete all 4 phases', icon: Icons.emoji_events, earned: false, progress: 33),
  ];

  static List<ChatMessage> getInitialChat() => [
    ChatMessage(
      message: "Hi! I'm Betaal, your digital rehab assistant. How can I help you today?",
      role: 'assistant',
      timestamp: DateTime.now().subtract(const Duration(minutes: 5)),
    ),
  ];

  static String getAIResponse(String userMessage) {
    final responses = [
      "Great progress! Your screen time has been dropping. That's a solid reduction — keep it going.",
      "I see Instagram is still your top app today. Try replacing 15 minutes of scrolling with a short walk.",
      "Your streak is impressive! Keep going and you'll unlock the next badge soon.",
      "You're well under quota today. That's exactly where you want to be in this phase.",
      "Tip: Build strong habits now so you're ready for the next phase. Small wins compound over time.",
    ];
    return responses[userMessage.length % responses.length];
  }

  // Weekly report data
  static Map<String, dynamic> getWeeklyReport() => {
    'week_start': '2025-01-08',
    'week_end': '2025-01-14',
    'daily_totals': [285, 260, 240, 255, 220, 200, 185],
    'avg_min': 235,
    'streak': 3,
    'phase': 2,
    'phase_name': 'Reduction',
    'progress_pct': 33,
  };

  // 30-day heatmap data (4 weeks x 7 days, in minutes)
  static List<List<int>> getHeatmap() => [
    [420, 405, 390, 410, 370, 340, 310],
    [285, 260, 240, 255, 220, 200, 185],
    [175, 160, 150, 165, 140, 130, 120],
    [115, 105, 100, 110, 95, 90, 85],
  ];
}

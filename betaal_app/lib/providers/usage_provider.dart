import 'package:flutter/material.dart';
import '../models/usage_record.dart';
import '../dummy/dummy_data.dart';

class UsageProvider extends ChangeNotifier {
  List<UsageRecord> _logs = [];
  List<AppUsage> _todayApps = [];
  UsageRecord? _today;

  List<UsageRecord> get logs => _logs;
  List<AppUsage> get todayApps => _todayApps;
  UsageRecord? get today => _today;
  List<UsageRecord> get week => _logs.length >= 7 ? _logs.sublist(_logs.length - 7) : _logs;

  void loadDummyData() {
    _logs = DummyData.getUsageLogs();
    _todayApps = DummyData.getTodayApps();
    _today = DummyData.getToday();
    notifyListeners();
  }
}

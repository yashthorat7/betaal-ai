import 'package:flutter/material.dart';
import '../models/rehab_plan.dart';
import '../models/rehab_plan_generator.dart';
import '../services/preferences_service.dart';
import '../dummy/dummy_data.dart';

class RehabProvider extends ChangeNotifier {
  RehabPlan? _plan;

  RehabPlan? get plan => _plan;

  /// Generate plan from saved prefs. Falls back to dummy if onboarding not done.
  void loadLocalPlan() {
    if (!PreferencesService.onboardingDone) {
      loadDummyData();
      return;
    }
    final startDate = PreferencesService.planStartDate;
    if (startDate.isEmpty) {
      loadDummyData();
      return;
    }
    _plan = RehabPlanGenerator.generate(
      addictionLevel: PreferencesService.addictionLevel,
      strictness: PreferencesService.strictness,
      startDate: startDate,
    );
    notifyListeners();
  }

  void loadDummyData() {
    _plan = DummyData.getRehabPlan();
    notifyListeners();
  }
}

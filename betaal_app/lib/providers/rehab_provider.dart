import 'package:flutter/material.dart';
import '../models/rehab_plan.dart';
import '../dummy/dummy_data.dart';

class RehabProvider extends ChangeNotifier {
  RehabPlan? _plan;

  RehabPlan? get plan => _plan;

  void loadDummyData() {
    _plan = DummyData.getRehabPlan();
    notifyListeners();
  }
}

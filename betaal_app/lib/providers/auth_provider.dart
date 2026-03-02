import 'package:flutter/material.dart';
import '../models/user_model.dart';
import '../dummy/dummy_data.dart';

class AuthProvider extends ChangeNotifier {
  bool _isSignedIn = false;
  bool _onboardingComplete = false;
  UserModel? _user;

  bool get isSignedIn => _isSignedIn;
  bool get onboardingComplete => _onboardingComplete;
  UserModel? get user => _user;

  // Simulated sign-in with dummy data
  Future<void> signIn() async {
    await Future.delayed(const Duration(milliseconds: 500));
    _user = DummyData.getUser();
    _isSignedIn = true;
    notifyListeners();
  }

  void completeOnboarding({
    required String name,
    required int age,
    required int addictionLevel,
    required int strictness,
  }) {
    _user = _user?.copyWith(
      name: name,
      age: age,
      addictionLevel: addictionLevel,
      strictness: strictness,
    );
    _onboardingComplete = true;
    notifyListeners();
  }

  void signOut() {
    _isSignedIn = false;
    _onboardingComplete = false;
    _user = null;
    notifyListeners();
  }
}

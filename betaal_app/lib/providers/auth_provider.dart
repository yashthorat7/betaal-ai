import 'package:flutter/material.dart';
import 'package:firebase_auth/firebase_auth.dart';
import 'package:google_sign_in/google_sign_in.dart';
import '../models/user_model.dart';
import '../services/preferences_service.dart';

class AuthProvider extends ChangeNotifier {
  final FirebaseAuth _firebaseAuth = FirebaseAuth.instance;
  final GoogleSignIn _googleSignIn = GoogleSignIn();

  bool _isSignedIn = false;
  bool _onboardingComplete = false;
  UserModel? _user;

  bool get isSignedIn => _isSignedIn;
  bool get onboardingComplete => _onboardingComplete;
  UserModel? get user => _user;

  AuthProvider() {
    _restoreSession();
  }

  void _restoreSession() {
    final firebaseUser = _firebaseAuth.currentUser;
    if (firebaseUser != null) {
      // Use saved onboarding name if available, fallback to Google name
      final savedName = PreferencesService.getUserName();
      final displayName = savedName.isNotEmpty
          ? savedName
          : (firebaseUser.displayName ?? 'User');

      _user = UserModel(
        uid: firebaseUser.uid,
        name: displayName,
        age: PreferencesService.getAge(),
        email: firebaseUser.email ?? '',
        avatarUrl: firebaseUser.photoURL,
        addictionLevel: PreferencesService.getAddictionLevel(),
        strictness: PreferencesService.getStrictness(),
        createdAt: firebaseUser.metadata.creationTime?.toIso8601String() ?? '',
      );
      _isSignedIn = true;
      _onboardingComplete = PreferencesService.onboardingDone;
    }
  }

  Future<void> signIn() async {
    try {
      final googleUser = await _googleSignIn.signIn();
      if (googleUser == null) return; // user cancelled

      final googleAuth = await googleUser.authentication;
      final credential = GoogleAuthProvider.credential(
        accessToken: googleAuth.accessToken,
        idToken: googleAuth.idToken,
      );

      final userCredential = await _firebaseAuth.signInWithCredential(credential);
      final fbUser = userCredential.user;
      if (fbUser != null) {
        final savedName = PreferencesService.getUserName();
        _user = UserModel(
          uid: fbUser.uid,
          name: savedName.isNotEmpty ? savedName : (fbUser.displayName ?? 'User'),
          age: PreferencesService.getAge(),
          email: fbUser.email ?? '',
          avatarUrl: fbUser.photoURL,
          addictionLevel: PreferencesService.getAddictionLevel(),
          strictness: PreferencesService.getStrictness(),
          createdAt: fbUser.metadata.creationTime?.toIso8601String() ?? '',
        );
        _isSignedIn = true;
        notifyListeners();
      }
    } catch (e) {
      debugPrint('Google Sign-In error: $e');
      rethrow;
    }
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

  Future<void> signOut() async {
    await _googleSignIn.signOut();
    await _firebaseAuth.signOut();
    _isSignedIn = false;
    _onboardingComplete = false;
    _user = null;
    notifyListeners();
  }
}

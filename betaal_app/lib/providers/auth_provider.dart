import 'dart:convert';
import 'package:flutter/material.dart';
import 'package:firebase_auth/firebase_auth.dart';
import 'package:google_sign_in/google_sign_in.dart';
import 'package:http/http.dart' as http;
import '../models/user_model.dart';
import '../services/preferences_service.dart';

class AuthProvider extends ChangeNotifier {
  final FirebaseAuth _firebaseAuth = FirebaseAuth.instance;
  final GoogleSignIn _googleSignIn = GoogleSignIn();

  static const _backendUrl = 'http://10.58.25.239:8000';

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
      // Build user from local prefs first (instant, no network)
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
        createdAt:
            firebaseUser.metadata.creationTime?.toIso8601String() ?? '',
      );
      _isSignedIn = true;
      _onboardingComplete = PreferencesService.onboardingDone;

      // Then try to fetch latest from backend (async, non-blocking)
      _fetchProfileFromBackend(firebaseUser.uid, firebaseUser.photoURL);
    }
  }

  Future<void> signIn() async {
    try {
      final googleUser = await _googleSignIn.signIn();
      if (googleUser == null) return;

      final googleAuth = await googleUser.authentication;
      final credential = GoogleAuthProvider.credential(
        accessToken: googleAuth.accessToken,
        idToken: googleAuth.idToken,
      );

      final userCredential =
          await _firebaseAuth.signInWithCredential(credential);
      final fbUser = userCredential.user;
      if (fbUser != null) {
        // Build from local prefs first
        final savedName = PreferencesService.getUserName();
        _user = UserModel(
          uid: fbUser.uid,
          name: savedName.isNotEmpty
              ? savedName
              : (fbUser.displayName ?? 'User'),
          age: PreferencesService.getAge(),
          email: fbUser.email ?? '',
          avatarUrl: fbUser.photoURL,
          addictionLevel: PreferencesService.getAddictionLevel(),
          strictness: PreferencesService.getStrictness(),
          createdAt:
              fbUser.metadata.creationTime?.toIso8601String() ?? '',
        );
        _isSignedIn = true;
        notifyListeners();

        // Fetch from backend — overwrites with server data if available
        await _fetchProfileFromBackend(fbUser.uid, fbUser.photoURL);
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

    // Save to backend (fire-and-forget)
    _saveProfileToBackend();
  }

  Future<void> signOut() async {
    await _googleSignIn.signOut();
    await _firebaseAuth.signOut();
    _isSignedIn = false;
    _onboardingComplete = false;
    _user = null;
    notifyListeners();
  }

  // ─── Backend Calls ────────────────────────────────────────────────

  /// Save user profile to Firestore via backend.
  Future<void> _saveProfileToBackend() async {
    final u = _user;
    if (u == null) return;
    try {
      await http.put(
        Uri.parse('$_backendUrl/user/profile'),
        headers: {'Content-Type': 'application/json'},
        body: jsonEncode({
          'uid': u.uid,
          'name': u.name,
          'age': u.age,
          'addiction_level': u.addictionLevel,
          'strictness': u.strictness,
        }),
      ).timeout(const Duration(seconds: 5));
      debugPrint('Profile saved to backend');
    } catch (e) {
      debugPrint('Backend save failed (offline?): $e');
    }
  }

  /// Fetch user profile from Firestore via backend.
  /// Updates local user + prefs if server has data.
  Future<void> _fetchProfileFromBackend(
      String uid, String? avatarUrl) async {
    try {
      final resp = await http
          .get(Uri.parse('$_backendUrl/user/profile?uid=$uid'))
          .timeout(const Duration(seconds: 5));

      if (resp.statusCode == 200) {
        final data = jsonDecode(resp.body);
        final serverName = data['name'] as String? ?? '';
        final serverAge = data['age'] as int? ?? 0;
        final serverAddiction = data['addiction_level'] as int? ?? 0;
        final serverStrictness = data['strictness'] as int? ?? 0;

        // Only use server data if it looks real (not the demo fallback)
        if (serverName.isNotEmpty &&
            serverName != 'Arjun' &&
            serverAge > 0) {
          _user = UserModel(
            uid: uid,
            name: serverName,
            age: serverAge,
            email: _user?.email ?? '',
            avatarUrl: avatarUrl,
            addictionLevel: serverAddiction,
            strictness: serverStrictness,
            createdAt: _user?.createdAt ?? '',
          );

          // Sync to local prefs so next cold start is instant
          PreferencesService.setUserName(serverName);
          PreferencesService.setAge(serverAge);
          PreferencesService.setAddictionLevel(serverAddiction);
          PreferencesService.setStrictness(serverStrictness);

          notifyListeners();
          debugPrint('Profile loaded from backend: $serverName');
        }
      }
    } catch (e) {
      debugPrint('Backend fetch failed (offline?): $e');
      // No problem — local prefs already loaded
    }
  }
}

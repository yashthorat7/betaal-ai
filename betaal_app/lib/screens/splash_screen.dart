import 'package:flutter/material.dart';
import 'package:firebase_auth/firebase_auth.dart';
import '../services/preferences_service.dart';

class SplashScreen extends StatefulWidget {
  const SplashScreen({super.key});

  @override
  State<SplashScreen> createState() => _SplashScreenState();
}

class _SplashScreenState extends State<SplashScreen> {
  @override
  void initState() {
    super.initState();
    Future.delayed(const Duration(seconds: 2), () {
      if (!mounted) return;
      final hasUser = FirebaseAuth.instance.currentUser != null;
      final onboarded = PreferencesService.onboardingDone;

      String route;
      if (hasUser && onboarded) {
        // Returning user — go straight to main
        route = '/main';
      } else if (hasUser && !onboarded) {
        // Signed in but never onboarded — go to onboarding
        route = '/onboarding';
      } else {
        // Not signed in
        route = '/signin';
      }
      Navigator.pushReplacementNamed(context, route);
    });
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      body: Center(
        child: Column(
          mainAxisAlignment: MainAxisAlignment.center,
          children: [
            // 👇 Replaced the shield icon with your local image 👇
            Image.asset(
              'assets/icon.png',
              width: 80,
              height: 80,
            ),
            const SizedBox(height: 16),
            const Text(
              'Betaal AI',
              style: TextStyle(fontSize: 32, fontWeight: FontWeight.bold),
            ),
            const SizedBox(height: 8),
            const Text(
              'Your Digital Rehab Companion',
              style: TextStyle(fontSize: 14, color: Colors.grey),
            ),
          ],
        ),
      ),
    );
  }
}

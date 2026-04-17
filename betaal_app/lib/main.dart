import 'package:flutter/material.dart';
import 'package:provider/provider.dart';
import 'package:firebase_core/firebase_core.dart';
import 'providers/auth_provider.dart';
import 'providers/usage_provider.dart';
import 'providers/rehab_provider.dart';
import 'providers/chat_provider.dart';
import 'screens/splash_screen.dart';
import 'screens/sign_in_screen.dart';
import 'screens/onboarding_screen.dart';
import 'screens/ai_screen.dart';
import 'screens/home_screen.dart';
import 'screens/report_screen.dart';
import 'screens/personalize_screen.dart';
import 'screens/settings_screen.dart';
import 'services/preferences_service.dart';
import 'services/usage_stats_service.dart';

void main() async {
  WidgetsFlutterBinding.ensureInitialized();
  await Firebase.initializeApp();
  await PreferencesService.init();
  runApp(const BetaalApp());
}

class BetaalApp extends StatelessWidget {
  const BetaalApp({super.key});

  @override
  Widget build(BuildContext context) {
    return MultiProvider(
      providers: [
        ChangeNotifierProvider(create: (_) => AuthProvider()),
        ChangeNotifierProvider(create: (_) => UsageProvider()),
        ChangeNotifierProvider(create: (_) => RehabProvider()),
        ChangeNotifierProvider(create: (_) => ChatProvider()),
      ],
      child: MaterialApp(
        title: 'Betaal AI',
        debugShowCheckedModeBanner: false,
        theme: ThemeData(
          useMaterial3: true,
          brightness: Brightness.light,
          scaffoldBackgroundColor: const Color(0xFFF2F2F2),
        ),
        initialRoute: '/splash',
        routes: {
          '/splash': (_) => const SplashScreen(),
          '/signin': (_) => const SignInScreen(),
          '/onboarding': (_) => const OnboardingScreen(),
          '/main': (_) => const MainShell(),
        },
      ),
    );
  }
}

/// Bottom navigation shell with 4 tabs
class MainShell extends StatefulWidget {
  const MainShell({super.key});

  @override
  State<MainShell> createState() => _MainShellState();
}

class _MainShellState extends State<MainShell> with WidgetsBindingObserver {
  int _currentIndex = 0;

  final _screens = const [
    HomeScreen(),
    ReportScreen(),
    PersonalizeScreen(),
    SettingsScreen(),
  ];

  @override
  void initState() {
    super.initState();
    WidgetsBinding.instance.addObserver(this);

    final usage = context.read<UsageProvider>();
    final rehab = context.read<RehabProvider>();
    final chat = context.read<ChatProvider>();

    // Load real rehab plan and sync quota to prefs
    rehab.loadLocalPlan();
    final plan = rehab.plan;
    if (plan != null) {
      PreferencesService.setDailyQuotaMin(plan.activePhase.dailyQuotaMin);
    }

    // Load real usage data (falls back to dummy if no permission)
    usage.loadRealData();
    // Start auto-refresh every 30 seconds
    usage.startAutoRefresh();

    final userName = context.read<AuthProvider>().user?.name ?? 'User';
    chat.loadInitialMessages(userName: userName);

    // Start background usage tracking service
    UsageStatsService.startTracking();
  }

  @override
  void dispose() {
    WidgetsBinding.instance.removeObserver(this);
    context.read<UsageProvider>().stopAutoRefresh();
    super.dispose();
  }

  @override
  void didChangeAppLifecycleState(AppLifecycleState state) {
    final usage = context.read<UsageProvider>();
    if (state == AppLifecycleState.resumed) {
      // App came to foreground — refresh immediately + restart timer
      usage.loadRealData();
      usage.startAutoRefresh();
    } else if (state == AppLifecycleState.paused) {
      // App went to background — stop polling to save battery
      usage.stopAutoRefresh();
    }
  }

  static const _navIcons = [
    Icons.home_outlined,
    Icons.bar_chart_outlined,
    Icons.tune_outlined,
    Icons.settings_outlined,
  ];

  static const _navIconsFilled = [
    Icons.home,
    Icons.bar_chart,
    Icons.tune,
    Icons.settings,
  ];

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      body: Stack(
        children: [
          IndexedStack(
            index: _currentIndex,
            children: _screens,
          ),
          // AI FAB button
          Positioned(
            right: 20,
            bottom: 84,
            child: GestureDetector(
              onTap: () {
                Navigator.push(
                  context,
                  MaterialPageRoute(builder: (_) => const AiScreen()),
                );
              },
              child: Container(
                width: 52,
                height: 52,
                decoration: BoxDecoration(
                  color: const Color(0xFF2DD4BF),
                  shape: BoxShape.circle,
                  boxShadow: [
                    BoxShadow(
                      color: const Color(0xFF2DD4BF).withValues(alpha: 0.35),
                      blurRadius: 14,
                      offset: const Offset(0, 5),
                    ),
                    BoxShadow(
                      color: Colors.black.withValues(alpha: 0.1),
                      blurRadius: 6,
                      offset: const Offset(0, 2),
                    ),
                  ],
                ),
                child: const Icon(Icons.smart_toy, color: Colors.white, size: 24),
              ),
            ),
          ),
          // Floating pill nav bar
          Positioned(
            left: 0,
            right: 0,
            bottom: 16,
            child: Center(
              child: Container(
                padding: const EdgeInsets.all(6),
                decoration: BoxDecoration(
                  color: const Color(0xFF222222),
                  borderRadius: BorderRadius.circular(999),
                  boxShadow: [
                    BoxShadow(
                      color: Colors.black.withValues(alpha: 0.25),
                      blurRadius: 20,
                      offset: const Offset(0, 8),
                    ),
                  ],
                  border: Border.all(
                    color: Colors.white.withValues(alpha: 0.08),
                  ),
                ),
                child: Row(
                  mainAxisSize: MainAxisSize.min,
                  children: List.generate(4, (i) {
                    final isActive = _currentIndex == i;
                    return GestureDetector(
                      onTap: () => setState(() => _currentIndex = i),
                      child: AnimatedContainer(
                        duration: const Duration(milliseconds: 200),
                        width: 48,
                        height: 48,
                        margin: EdgeInsets.only(
                          left: i == 0 ? 0 : 4,
                          right: i == 3 ? 0 : 4,
                        ),
                        decoration: BoxDecoration(
                          color: isActive ? Colors.white : Colors.transparent,
                          shape: BoxShape.circle,
                        ),
                        child: Icon(
                          isActive ? _navIconsFilled[i] : _navIcons[i],
                          size: 22,
                          color: isActive
                              ? const Color(0xFF222222)
                              : Colors.grey.shade500,
                        ),
                      ),
                    );
                  }),
                ),
              ),
            ),
          ),
        ],
      ),
    );
  }
}

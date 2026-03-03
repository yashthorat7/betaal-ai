import 'package:flutter/material.dart';
import 'package:provider/provider.dart';
import 'providers/auth_provider.dart';
import 'providers/usage_provider.dart';
import 'providers/rehab_provider.dart';
import 'providers/chat_provider.dart';
import 'screens/splash_screen.dart';
import 'screens/sign_in_screen.dart';
import 'screens/onboarding_screen.dart';
import 'screens/home_screen.dart';
import 'screens/report_screen.dart';
import 'screens/personalize_screen.dart';
import 'screens/settings_screen.dart';
import 'services/preferences_service.dart';
import 'services/usage_stats_service.dart';

void main() async {
  WidgetsFlutterBinding.ensureInitialized();
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
          navigationBarTheme: NavigationBarThemeData(
            backgroundColor: Colors.white.withOpacity(0.8),
            indicatorColor: const Color(0xFF2DD4BF).withOpacity(0.15),
            labelTextStyle: WidgetStateProperty.resolveWith((states) {
              if (states.contains(WidgetState.selected)) {
                return const TextStyle(
                  fontSize: 12,
                  fontWeight: FontWeight.w600,
                  color: Color(0xFF101018),
                );
              }
              return TextStyle(
                fontSize: 12,
                fontWeight: FontWeight.w400,
                color: Colors.grey.shade400,
              );
            }),
          ),
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

class _MainShellState extends State<MainShell> {
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
    chat.loadInitialMessages();

    // Start background usage tracking service
    UsageStatsService.startTracking();
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      body: IndexedStack(
        index: _currentIndex,
        children: _screens,
      ),
      bottomNavigationBar: NavigationBar(
        selectedIndex: _currentIndex,
        onDestinationSelected: (i) => setState(() => _currentIndex = i),
        destinations: const [
          NavigationDestination(icon: Icon(Icons.home), label: 'Home'),
          NavigationDestination(icon: Icon(Icons.bar_chart), label: 'Report'),
          NavigationDestination(icon: Icon(Icons.tune), label: 'Personalize'),
          NavigationDestination(icon: Icon(Icons.settings), label: 'Settings'),
        ],
      ),
    );
  }
}

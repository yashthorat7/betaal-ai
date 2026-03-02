# Mobile App Directory Structure — Betaal AI

```
mobile-app/
│
├── android/
│   └── app/src/main/
│       ├── kotlin/.../                    # Native Kotlin modules
│       │   ├── UsageTrackingService.kt    # Foreground service for usage stats
│       │   ├── OverlayService.kt          # System overlay for interruptions
│       │   ├── BootReceiver.kt            # Restart service on device reboot
│       │   └── StealthChannel.kt          # Activity-alias toggling for stealth mode
│       └── AndroidManifest.xml            # Permissions, activity-aliases, services
│
├── lib/
│   ├── main.dart                          # App entry point
│   │
│   ├── core/                              # Constants, enums, utilities
│   │   ├── constants.dart                 # API URLs, default values
│   │   ├── enums.dart                     # RehabPhase, InterruptionType, etc.
│   │   └── validators.dart                # Input validation helpers
│   │
│   ├── models/                            # Data models
│   │   ├── user_model.dart                # UserProfile
│   │   ├── usage_record.dart              # Daily usage data
│   │   ├── rehab_plan.dart                # RehabPlan, RehabPhase
│   │   ├── interruption.dart              # InterruptionItem, InterruptionArray
│   │   ├── badge_model.dart               # Achievements/Badges
│   │   ├── friend_model.dart              # Social/Friend data
│   │   └── chat_message.dart              # ChatMessage
│   │
│   ├── services/                          # Business logic & API calls
│   │   ├── auth_service.dart              # Firebase Auth + Google Sign-In
│   │   ├── firestore_service.dart         # Firestore CRUD operations
│   │   ├── api_service.dart               # Dio → FastAPI backend calls
│   │   ├── usage_stats_service.dart       # MethodChannel → Kotlin usage tracker
│   │   ├── overlay_service.dart           # MethodChannel → Kotlin overlay
│   │   ├── stealth_service.dart           # MethodChannel → Kotlin stealth
│   │   └── notification_service.dart      # Local notifications
│   │
│   ├── providers/                         # State management (Provider/GetX)
│   │   ├── auth_provider.dart
│   │   ├── user_provider.dart
│   │   ├── usage_provider.dart
│   │   ├── rehab_provider.dart
│   │   ├── report_provider.dart
│   │   ├── achievement_provider.dart
│   │   ├── social_provider.dart
│   │   ├── personalization_provider.dart
│   │   └── chat_provider.dart
│   │
│   ├── screens/                           # UI pages
│   │   ├── splash_screen.dart
│   │   ├── sign_in_screen.dart
│   │   ├── onboarding_screen.dart         # 4-step walkthrough
│   │   ├── home_screen.dart               # Tab 1: Home
│   │   ├── report_screen.dart             # Tab 2: Analytics dashboard
│   │   ├── ai_screen.dart                 # Tab 3: AI chat assistant
│   │   ├── settings_screen.dart           # Tab 4: Settings (including Personalization)
│   │   └── friend_profile_screen.dart     # Friend profile viewer
│   │
│   ├── widgets/                           # Reusable components
│   │   ├── monitoring_ring.dart           # Circular progress ring
│   │   ├── weekly_summary.dart            # 7-day indicator row
│   │   ├── top_bar.dart                   # Name + avatar header
│   │   ├── stealth_mode_card.dart
│   │   ├── rehab_params_card.dart
│   │   ├── today_summary_card.dart
│   │   ├── weekly_chart.dart
│   │   ├── app_breakdown.dart
│   │   ├── chat_bubble.dart
│   │   └── chat_input.dart
│   │
│   └── dummy/                             # Hackathon demo data
│       └── dummy_data.dart                # Synthetic 14-day usage data
│
├── pubspec.yaml                           # Flutter dependencies
└── .env                                   # API keys (gitignored)
```

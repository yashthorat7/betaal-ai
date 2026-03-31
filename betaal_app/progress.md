# Progress — Mobile App

> Update this file after every work session.

## Log

| Date | Phase | What Was Done | Status |
|------|-------|---------------|--------|
| 2026-03-03 | Phase 1 | Project config — `build.gradle` (minSdk 26, targetSdk 34, namespace `com.betaalai.app`, NDK 25.1, Java 11, AGP 8.3.0, Kotlin 1.9.22, Gradle 8.4) | ✅ Done |
| 2026-03-03 | Phase 1 | Dependencies — `flutter_overlay_window`, `permission_handler`, `flutter_dotenv`, `shared_preferences` | ✅ Done |
| 2026-03-03 | Phase 1 | Android Manifest — 8 permissions, foreground service, boot receiver, 3 stealth aliases | ✅ Done |
| 2026-03-03 | Phase 1 | Kotlin native modules — 6 files (MainActivity, UsageTrackingHelper, UsageTrackingService, OverlayService, BootReceiver, StealthHelper) | ✅ Done |
| 2026-03-03 | Phase 1 | Dart service bridges — `usage_stats_service.dart`, `overlay_service.dart`, `stealth_service.dart` | ✅ Done |
| 2026-03-03 | Phase 1 | Build verified — APK installs on emulator as `com.betaalai.app` | ✅ Done |
| 2026-03-03 | Phase 2 | Dependencies — added `provider`, `fl_chart` to pubspec.yaml | ✅ Done |
| 2026-03-03 | Phase 2 | Data models — 7 models: `user_model.dart`, `usage_record.dart`, `rehab_plan.dart`, `interruption.dart`, `chat_message.dart`, `badge_model.dart`, `friend_model.dart` | ✅ Done |
| 2026-03-03 | Phase 2 | Core files — `constants.dart`, `enums.dart` | ✅ Done |
| 2026-03-03 | Phase 2 | Dummy data — `dummy_data.dart` with 14-day usage logs, user profile, rehab plan, app breakdown, badges, friends, chat, interruptions, weekly report, heatmap | ✅ Done |
| 2026-03-03 | Phase 2 | Providers — `auth_provider.dart`, `usage_provider.dart`, `rehab_provider.dart`, `chat_provider.dart` | ✅ Done |
| 2026-03-03 | Phase 2 | Navigation — `main.dart` with MultiProvider, named routes (`/splash`, `/signin`, `/onboarding`, `/main`), bottom nav bar (Home, Report, AI, Settings) | ✅ Done |
| 2026-03-03 | Phase 2 | Splash Screen — centered logo + text, auto-navigates to sign-in after 2s | ✅ Done |
| 2026-03-03 | Phase 2 | Sign-In Screen — "Sign in with Google" button (simulated with dummy data) | ✅ Done |
| 2026-03-03 | Phase 2 | Onboarding Screen — 4-step PageView (name+age, addiction level slider+emoji, strictness slider+computed rehab days, permissions checklist) | ✅ Done |
| 2026-03-03 | Phase 2 | Home Screen — greeting, weekly summary row (7 day-indicators), monitoring ring (circular progress), stats row, rehab progress bar | ✅ Done |
| 2026-03-03 | Phase 2 | Report Screen — today's summary card, weekly bar chart (fl_chart), achievements horizontal list, rehab progress, app breakdown bars, 30-day trend line chart, interruption log | ✅ Done |
| 2026-03-03 | Phase 2 | AI Chat Screen — chat bubbles (user right, AI left), text input + send button, simulated AI responses from dummy data | ✅ Done |
| 2026-03-03 | Phase 2 | Settings Screen — friends list, stealth mode dropdown, rehab params steppers, cooldown selector, profile info, language dropdown, notification toggles, sign out | ✅ Done |
| 2026-03-03 | Phase 2 | Widgets — `monitoring_ring.dart` (custom painter with arc), `weekly_summary.dart` (7-day indicator row) | ✅ Done |
| 2026-03-03 | Phase 2 | Build verified — `flutter analyze` passes with 0 issues | ✅ Done |

## Current Phase: Phase 2 ✅ Complete → Ready for Phase 6 (Integration) or Phase 7 (Styling)

## Blockers:
- Native modules need **real Android device** to test (emulator has limited support)
- Firebase setup (Phase 2 Step 1) skipped — needs `google-services.json` from Firebase Console
- Integration (Phase 6) needs backend API running

## Files Created/Modified

### Phase 1 — Android (Kotlin)
- `android/app/build.gradle` — updated config
- `android/settings.gradle` — AGP 8.3.0, Kotlin 1.9.22
- `android/gradle/wrapper/gradle-wrapper.properties` — Gradle 8.4
- `android/app/src/main/AndroidManifest.xml` — permissions, services, aliases
- `android/app/src/main/kotlin/com/betaalai/app/MainActivity.kt`
- `android/app/src/main/kotlin/com/betaalai/app/UsageTrackingHelper.kt`
- `android/app/src/main/kotlin/com/betaalai/app/UsageTrackingService.kt`
- `android/app/src/main/kotlin/com/betaalai/app/OverlayService.kt`
- `android/app/src/main/kotlin/com/betaalai/app/BootReceiver.kt`
- `android/app/src/main/kotlin/com/betaalai/app/StealthHelper.kt`

### Phase 1 — Dart Services
- `lib/services/usage_stats_service.dart`
- `lib/services/overlay_service.dart`
- `lib/services/stealth_service.dart`

### Phase 2 — Core
- `lib/core/constants.dart`
- `lib/core/enums.dart`

### Phase 2 — Models
- `lib/models/user_model.dart`
- `lib/models/usage_record.dart`
- `lib/models/rehab_plan.dart`
- `lib/models/interruption.dart`
- `lib/models/chat_message.dart`
- `lib/models/badge_model.dart`
- `lib/models/friend_model.dart`

### Phase 2 — Dummy Data
- `lib/dummy/dummy_data.dart`

### Phase 2 — Providers
- `lib/providers/auth_provider.dart`
- `lib/providers/usage_provider.dart`
- `lib/providers/rehab_provider.dart`
- `lib/providers/chat_provider.dart`

### Phase 2 — Screens
- `lib/screens/splash_screen.dart`
- `lib/screens/sign_in_screen.dart`
- `lib/screens/onboarding_screen.dart`
- `lib/screens/home_screen.dart`
- `lib/screens/report_screen.dart`
- `lib/screens/ai_screen.dart`
- `lib/screens/settings_screen.dart`

### Phase 2 — Widgets
- `lib/widgets/monitoring_ring.dart`
- `lib/widgets/weekly_summary.dart`

### Other
- `lib/main.dart` — app entry with MultiProvider + routes + bottom nav
- `pubspec.yaml` — all dependencies
- `test/widget_test.dart` — updated

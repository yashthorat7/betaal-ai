# Progress — Mobile App

> Update this file after every work session.

## Log

| Date | Phase | What Was Done | Status |
|------|-------|---------------|--------|
| 2026-03-03 | Phase 1 | Project config — updated `build.gradle` (minSdk 26, targetSdk 34, namespace `com.betaalai.app`, NDK 25.1, Java 11, AGP 8.3.0, Kotlin 1.9.22, Gradle 8.4) | ✅ Done |
| 2026-03-03 | Phase 1 | Dependencies — added `flutter_overlay_window`, `permission_handler`, `flutter_dotenv`, `shared_preferences` to `pubspec.yaml` | ✅ Done |
| 2026-03-03 | Phase 1 | Android Manifest — added 8 permissions (USAGE_STATS, SYSTEM_ALERT_WINDOW, FOREGROUND_SERVICE, BOOT_COMPLETED, etc.), foreground service declaration, 3 stealth activity-aliases (Calculator, Notes, Weather) | ✅ Done |
| 2026-03-03 | Phase 1 | Kotlin native modules — created `MainActivity.kt` (3 MethodChannels: usage, overlay, stealth), `UsageTrackingHelper.kt` (UsageStatsManager queries), `UsageTrackingService.kt` (foreground service polling every 5s), `OverlayService.kt` (TYPE_APPLICATION_OVERLAY with black/blur/warning types), `BootReceiver.kt` (restart tracking on reboot), `StealthHelper.kt` (activity-alias toggling) | ✅ Done |
| 2026-03-03 | Phase 1 | Dart service bridges — created `usage_stats_service.dart`, `overlay_service.dart`, `stealth_service.dart` with all MethodChannel wrappers | ✅ Done |
| 2026-03-03 | Phase 1 | Test UI — replaced default counter app with Phase 1 test screen (buttons for all native functions + real-time log) | ✅ Done |
| 2026-03-03 | Phase 1 | Build verification — `flutter analyze` passes with 0 issues, APK builds and installs on emulator as `com.betaalai.app` | ✅ Done |

## Current Phase: Phase 1 ✅ Complete → Ready for Phase 2

## Blockers:
- Native modules (usage tracking, overlay, stealth) need **real Android device** to fully test (emulator has limited support for UsageStatsManager and overlay permissions)

## Files Created/Modified

### Android (Kotlin)
- `android/app/build.gradle` — updated config
- `android/settings.gradle` — AGP 8.3.0, Kotlin 1.9.22
- `android/gradle/wrapper/gradle-wrapper.properties` — Gradle 8.4
- `android/app/src/main/AndroidManifest.xml` — permissions, services, aliases
- `android/app/src/main/kotlin/com/betaalai/app/MainActivity.kt` — NEW
- `android/app/src/main/kotlin/com/betaalai/app/UsageTrackingHelper.kt` — NEW
- `android/app/src/main/kotlin/com/betaalai/app/UsageTrackingService.kt` — NEW
- `android/app/src/main/kotlin/com/betaalai/app/OverlayService.kt` — NEW
- `android/app/src/main/kotlin/com/betaalai/app/BootReceiver.kt` — NEW
- `android/app/src/main/kotlin/com/betaalai/app/StealthHelper.kt` — NEW

### Dart
- `lib/main.dart` — test UI for native modules
- `lib/services/usage_stats_service.dart` — NEW
- `lib/services/overlay_service.dart` — NEW
- `lib/services/stealth_service.dart` — NEW
- `test/widget_test.dart` — updated
- `pubspec.yaml` — updated dependencies

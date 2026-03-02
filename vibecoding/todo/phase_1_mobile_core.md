# Phase 1 — Mobile Core (No UI)

**Goal:** Get the native Android modules working before touching any Flutter UI. Verify feasibility of usage tracking and overlay on a real device.

**Time estimate:** 3–4 hours

---

## Step 1: Flutter Project Setup

1. Create Flutter project at `mobile-app/`
   ```bash
   flutter create --org com.betaalai mobile_app
   ```
2. Rename directory to `mobile-app` in the monorepo
3. Set `minSdkVersion 26` and `targetSdkVersion 34` in `android/app/build.gradle`
4. Add to `pubspec.yaml`:
   ```yaml
   dependencies:
     flutter_overlay_window: ^0.4.3
     usage_stats: ^1.1.1
     permission_handler: ^11.0.0
     flutter_dotenv: ^5.1.0
   ```
5. Run `flutter pub get`

**Checkpoint:** App compiles and runs on emulator/device

---

## Step 2: Android Permissions

1. In `AndroidManifest.xml`, add:
   ```xml
   <uses-permission android:name="android.permission.PACKAGE_USAGE_STATS" tools:ignore="ProtectedPermissions"/>
   <uses-permission android:name="android.permission.SYSTEM_ALERT_WINDOW"/>
   <uses-permission android:name="android.permission.REQUEST_IGNORE_BATTERY_OPTIMIZATIONS"/>
   <uses-permission android:name="android.permission.RECEIVE_BOOT_COMPLETED"/>
   <uses-permission android:name="android.permission.INTERNET"/>
   <uses-permission android:name="android.permission.FOREGROUND_SERVICE"/>
   ```
2. Add foreground service declaration for usage tracking

**Checkpoint:** Permissions declared, no crashes

---

## Step 3: UsageTrackingService (Kotlin)

**File:** `android/app/src/main/kotlin/.../UsageTrackingService.kt`

1. Create a Kotlin foreground service that:
   - Polls `UsageStatsManager` every 5 seconds
   - Gets current foreground app name and package
   - Calculates total screen time for today
   - Reports data back to Dart via `MethodChannel`
2. Register service in `AndroidManifest.xml`

**Test script (in Dart main.dart):**
```dart
// Temporary test — print foreground app every 5 seconds
UsageStatsService.startTracking();
UsageStatsService.onUsageUpdate.listen((data) {
  print('Foreground: ${data.appName}, Today: ${data.totalMinutes}min');
});
```

**Checkpoint:** Console prints current foreground app name + total minutes used today

---

## Step 4: OverlayService (Kotlin)

**File:** `android/app/src/main/kotlin/.../OverlayService.kt`

1. Create a Kotlin service that:
   - Uses `SYSTEM_ALERT_WINDOW` permission
   - Draws a full-screen overlay (`TYPE_APPLICATION_OVERLAY`)
   - Supports overlay types: solid black, blur (if possible), semi-transparent
   - Can be shown/hidden from Dart via `MethodChannel`
2. Register service in `AndroidManifest.xml`

**Test script (in Dart main.dart):**
```dart
// Temporary test — show black overlay for 3 seconds, then hide
await OverlayService.show(type: 'black_screen');
await Future.delayed(Duration(seconds: 3));
await OverlayService.hide();
```

**Checkpoint:** Black overlay appears over all apps, then disappears after 3 seconds

---

## Step 5: BootReceiver (Kotlin)

**File:** `android/app/src/main/kotlin/.../BootReceiver.kt`

1. Create a `BroadcastReceiver` that:
   - Listens for `BOOT_COMPLETED`
   - Restarts `UsageTrackingService`
2. Register in `AndroidManifest.xml`

**Checkpoint:** After device reboot, usage tracking resumes automatically

---

## Step 6: StealthChannel (Kotlin)

**File:** `android/app/src/main/kotlin/.../StealthChannel.kt`

1. Define activity-aliases in `AndroidManifest.xml`:
   - `default` (enabled) — normal icon/name
   - `calculator` (disabled) — decoy
   - `notes` (disabled) — decoy
2. Create Kotlin method channel that:
   - Disables current alias
   - Enables selected alias
   - Uses `PackageManager.setComponentEnabledSetting()`

**Test script (in Dart main.dart):**
```dart
// Temporary test — switch to calculator icon
await StealthService.switchTo('calculator');
// Check launcher — app should appear as "Calculator Pro"
```

**Checkpoint:** App icon and name change in the device launcher

---

## Step 7: MethodChannel Bridges

**File:** `lib/services/usage_stats_service.dart`, `overlay_service.dart`, `stealth_service.dart`

1. Create Dart service classes that wrap the MethodChannel calls
2. Each service has simple static methods (start, stop, show, hide, switch)
3. Keep them minimal — no state management yet

**Checkpoint:** All 4 native modules callable from Dart

---

## Step 8: Feasibility Check

Run all modules together on a **real Android device** (not emulator):

| Test | Expected Result | Pass? |
|------|----------------|-------|
| Usage tracking starts | Prints foreground app every 5s | [ ] |
| Overlay shows | Black screen covers all apps | [ ] |
| Overlay hides | Black screen disappears | [ ] |
| Boot receiver works | Tracking resumes after reboot | [ ] |
| Stealth mode works | App icon changes in launcher | [ ] |
| Battery drain | < 5% per hour of tracking | [ ] |

**If any fail:** Debug and fix before moving to Phase 2. Don't build UI on a broken foundation.

---

## Step 9: Create CONTEXT.md

Create `mobile-app/CONTEXT.md` with:
- What native modules exist and what they do
- How the MethodChannel bridges work
- Any gotchas discovered during feasibility testing
- Current state of the codebase

This file helps the next AI session understand the code without re-reading everything.

---

## Step 10: Update progress.md

Update `vibecoding/mobile/progress.md` with:
- Date, what was done, what works, what doesn't
- Feasibility check results

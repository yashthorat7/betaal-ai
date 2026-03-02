# TODO — Mobile App (betaal_app)

> **Owner:** Divesh
> **Estimated Time:** 3–4 hours (Phase 1) + 4–5 hours (Phase 2) + 3 hours (Integration) + 3 hours (Styling)
> **Rule:** Core first → Layout second. All UI starts B&W, no styling. Demo-first development.

---

## Phase 1 — Mobile Core (No UI)

> Get native Android modules working before touching any Flutter UI.

### Step 1: Flutter Project Setup
- [ ] Create Flutter project (`flutter create --org com.betaalai betaal_app`)
- [ ] Set `minSdkVersion 26`, `targetSdkVersion 34` in `android/app/build.gradle`
- [ ] Add to `pubspec.yaml`: `flutter_overlay_window`, `usage_stats`, `permission_handler`, `flutter_dotenv`
- [ ] Run `flutter pub get`
- [ ] Verify: app compiles and runs on emulator/device

### Step 2: Android Permissions
- [ ] Add permissions to `AndroidManifest.xml`: PACKAGE_USAGE_STATS, SYSTEM_ALERT_WINDOW, REQUEST_IGNORE_BATTERY_OPTIMIZATIONS, RECEIVE_BOOT_COMPLETED, INTERNET, FOREGROUND_SERVICE
- [ ] Add foreground service declaration
- [ ] Verify: permissions declared, no crashes

### Step 3: UsageTrackingService (Kotlin)
- [ ] Create `UsageTrackingService.kt` — foreground service polling `UsageStatsManager` every 5s
- [ ] Get current foreground app name and package
- [ ] Calculate total screen time for today
- [ ] Report data back to Dart via `MethodChannel`
- [ ] Register service in `AndroidManifest.xml`
- [ ] Verify: console prints current foreground app name + total minutes used today

### Step 4: OverlayService (Kotlin)
- [ ] Create `OverlayService.kt` — draw full-screen overlay (`TYPE_APPLICATION_OVERLAY`)
- [ ] Support overlay types: solid black, blur, semi-transparent
- [ ] Show/hide from Dart via `MethodChannel`
- [ ] Register service in `AndroidManifest.xml`
- [ ] Verify: black overlay appears over all apps, then disappears after 3 seconds

### Step 5: BootReceiver (Kotlin)
- [ ] Create `BootReceiver.kt` — `BroadcastReceiver` for `BOOT_COMPLETED`
- [ ] Restarts `UsageTrackingService` on boot
- [ ] Register in `AndroidManifest.xml`
- [ ] Verify: after device reboot, usage tracking resumes automatically

### Step 6: StealthChannel (Kotlin)
- [ ] Define activity-aliases in `AndroidManifest.xml` (default, calculator, notes)
- [ ] Create `StealthChannel.kt` — disable current alias, enable selected alias
- [ ] Uses `PackageManager.setComponentEnabledSetting()`
- [ ] Verify: app icon and name change in device launcher

### Step 7: MethodChannel Bridges (Dart)
- [ ] Create `lib/services/usage_stats_service.dart`
- [ ] Create `lib/services/overlay_service.dart`
- [ ] Create `lib/services/stealth_service.dart`
- [ ] Verify: all 4 native modules callable from Dart

### Step 8: Feasibility Check (Real Device)
- [ ] Usage tracking starts — prints foreground app every 5s
- [ ] Overlay shows — black screen covers all apps
- [ ] Overlay hides — black screen disappears
- [ ] Boot receiver — tracking resumes after reboot
- [ ] Stealth mode — app icon changes in launcher
- [ ] Battery drain < 5% per hour of tracking

### Step 9: Documentation
- [ ] Create `CONTEXT.md` in `betaal_app/` (native modules, MethodChannels, gotchas)
- [ ] Update `progress.md`

---

## Phase 2 — Mobile Layout (B&W, Dummy Data)

> All screens with minimal layout. Hardcoded dummy data. No API calls, no styling.

### Step 1: Firebase Setup
- [ ] Add `firebase_auth`, `google_sign_in`, `cloud_firestore` to `pubspec.yaml`
- [ ] Download `google-services.json` → `android/app/`
- [ ] Add Firebase plugin to `android/app/build.gradle`
- [ ] Verify: Google Sign-In works → prints user email to console

### Step 2: State Management
- [ ] Add `provider` to `pubspec.yaml`
- [ ] Create `lib/providers/auth_provider.dart`
- [ ] Create `lib/providers/usage_provider.dart`
- [ ] Create `lib/providers/rehab_provider.dart`
- [ ] Wire up `MultiProvider` in `main.dart`
- [ ] Verify: providers accessible from any screen

### Step 3: Models
- [ ] Create `lib/models/user_model.dart` (with `.fromJson()` / `.toJson()`)
- [ ] Create `lib/models/usage_record.dart`
- [ ] Create `lib/models/rehab_plan.dart`
- [ ] Create `lib/models/interruption.dart`
- [ ] Create `lib/models/chat_message.dart`
- [ ] Verify: models compile, can parse seed data JSON

### Step 4: Dummy Data Service
- [ ] Create `lib/dummy/dummy_data.dart` with static getters: `getUser()`, `getUsageLogs()`, `getRehabPlan()`, `getTodayApps()`
- [ ] Verify: data accessible from any screen

### Step 5: Navigation & Routing
- [ ] Set up routes: `/splash`, `/signin`, `/onboarding`, `/home`, `/personalization`, `/report`, `/settings`, `/chat`
- [ ] Splash → auto-navigate based on auth state
- [ ] Bottom nav bar (4 tabs): Home, Personalization, Report, Settings
- [ ] Chat → push route from FAB
- [ ] Verify: can navigate between all screens

### Step 6: Splash + Sign-In Screens
- [ ] Splash: centered text "Betaal AI", auto-navigate after 2 seconds
- [ ] Sign-In: centered "Sign in with Google" button
- [ ] Verify: launches → splash → sign in → redirects

### Step 7: Onboarding Screen
- [ ] 4-step PageView with arrow navigation
- [ ] Step 1: name input + age stepper
- [ ] Step 2: addiction level stepper (1–10)
- [ ] Step 3: strictness stepper (1–10) + computed rehab days display
- [ ] Step 4: permissions checklist (usage, overlay, battery, notifications)
- [ ] Verify: complete onboarding → values stored → navigate to Home

### Step 8: Home Screen
- [ ] Top bar: Text("Hi, Name") left, CircleAvatar right
- [ ] Row of 7 day-indicators (Mon–Sun)
- [ ] Large circular progress indicator (monitoring ring) from dummy data
- [ ] FloatingActionButton → navigates to Chat
- [ ] Verify: home screen shows dummy data in correct positions

### Step 9: Personalization Screen
- [ ] Stealth mode: dropdown + text field + switch toggle
- [ ] Rehab params: two steppers (addiction + strictness) + computed days
- [ ] Interruption prefs: dropdown for cooldown duration
- [ ] Verify: stealth mode changeable, rehab params update computed days

### Step 10: Report Screen
- [ ] Card: today's total, unlocks, top app, vs yesterday
- [ ] Weekly bar chart with `fl_chart` — dummy 7-day data
- [ ] Progress bar: "Day X of Y" with linear indicator
- [ ] Horizontal list: top 5 apps with time
- [ ] Line chart: 30-day trend (dummy)
- [ ] Card: interruptions triggered today
- [ ] Verify: all sections render with dummy data

### Step 11: Settings Screen
- [ ] Profile (name, age, email read-only), language dropdown, notification toggles, sign out
- [ ] Verify: sign out → returns to Sign-In

### Step 12: Chat Screen
- [ ] AppBar with title, ListView of chat bubbles, TextField + Send button
- [ ] On send: add user message, hardcoded AI response after 1s delay
- [ ] Verify: can type messages, responses appear

### Step 13: Documentation
- [ ] Update `progress.md`
- [ ] Update `CONTEXT.md` with screen list and data flow

---

## Phase 6 — Integration (Mobile Tasks)

- [ ] Update `ApiService` base URL to deployed backend
- [ ] Replace `DummyDataService` calls with API calls:
  - [ ] Home screen ring → GET `/usage/stats`
  - [ ] Report charts → GET `/report/daily`, `/report/weekly`
  - [ ] Rehab progress → GET `/rehab/plan`
  - [ ] Chat → POST `/chat` (live Gemini responses)
  - [ ] Interruption scheduling → POST `/interruption/schedule`
- [ ] Keep dummy data as fallback (if API fails)
- [ ] Verify: Home screen shows real data from backend

---

## Phase 7 — Styling (Mobile Tasks)

- [ ] Apply color palette to all screens
- [ ] Style monitoring ring with gradient colors
- [ ] Style charts with branded colors
- [ ] Add subtle animations (splash fade, ring fill)
- [ ] Style onboarding with branded look
- [ ] Style chat bubbles
- [ ] Bottom nav bar icons + selected state
- [ ] Final update to `progress.md`

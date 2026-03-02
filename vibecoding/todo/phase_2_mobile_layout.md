# Phase 2 — Mobile Layout (B&W, Dummy Data)

**Goal:** Build all Flutter screens with minimal B&W layout. Use hardcoded dummy data. No API calls, no styling.

**Time estimate:** 4–5 hours
**Prerequisite:** Phase 1 complete (native modules working)

---

## Step 1: Firebase Setup

1. Add `firebase_auth`, `google_sign_in`, `cloud_firestore` to `pubspec.yaml`
2. Download `google-services.json` from Firebase Console → place in `android/app/`
3. Add Firebase plugin to `android/app/build.gradle`
4. Test: Google Sign-In works → prints user email to console

**Checkpoint:** Sign in with Google → user object returned

---

## Step 2: State Management Setup

1. Add `provider` to `pubspec.yaml`
2. Create provider files in `lib/providers/`:
   - `auth_provider.dart` — holds current user
   - `usage_provider.dart` — holds dummy usage data
   - `rehab_provider.dart` — holds dummy rehab plan
3. Wire up `MultiProvider` in `main.dart`

**Checkpoint:** Providers accessible from any screen

---

## Step 3: Models

Create data classes in `lib/models/`:
- `user_model.dart` — matches seed_data.md user shape
- `usage_record.dart` — daily usage with app breakdown
- `rehab_plan.dart` — plan with phases
- `interruption.dart` — interruption item from array
- `chat_message.dart` — role + content

All models should have `.fromJson()` and `.toJson()` for future API integration.

**Checkpoint:** Models compile, can parse seed_data.md JSON

---

## Step 4: Dummy Data Service

**File:** `lib/dummy/dummy_data.dart`

1. Hardcode the JSON from `vibecoding/seed_data.md` as Dart objects
2. Create a `DummyDataService` class with static getters:
   - `getUser()` → UserModel
   - `getUsageLogs()` → List of daily records
   - `getRehabPlan()` → RehabPlan
   - `getTodayApps()` → App breakdown
3. All screens pull from this service for now

**Checkpoint:** Dummy data accessible from any screen

---

## Step 5: Navigation & Routing

1. Set up routes: `/splash`, `/signin`, `/onboarding`, `/home`, `/personalization`, `/report`, `/settings`, `/chat`
2. Splash → auto-navigate to SignIn or Home (based on auth state)
3. Home/Personalization/Report/Settings → bottom navigation bar (4 tabs)
4. Chat → opened from FAB, push route

**Checkpoint:** Can navigate between all screens (even if they're empty containers)

---

## Step 6: Splash + Sign-In Screens

**Splash:** Centered text "Betaal AI", auto-navigate after 2 seconds
**Sign-In:** Centered "Sign in with Google" button, triggers Firebase auth

Both screens: minimal, no decoration, just functional.

**Checkpoint:** App launches → splash → sign in → redirects

---

## Step 7: Onboarding Screen

4-step PageView with arrow navigation:
1. Name input + age stepper
2. Addiction level stepper (1–10)
3. Strictness stepper (1–10) + computed rehab days display
4. Permissions checklist (usage, overlay, battery, notifications)

Each step: just input widgets, labels, and navigation arrows. No decoration.

**Checkpoint:** Complete onboarding → values stored in provider → navigate to Home

---

## Step 8: Home Screen

Layout (top to bottom):
1. Top bar: Text("Hi, Name") left, CircleAvatar right
2. Row of 7 containers (Mon–Sun) — colored based on dummy data
3. Large circular progress indicator (monitoring ring) — shows remaining time from dummy data
4. FloatingActionButton bottom-right → navigates to Chat

Use `DummyDataService` for all values.

**Checkpoint:** Home screen shows dummy data in correct layout positions

---

## Step 9: Personalization Screen

Layout:
1. Stealth mode section: dropdown for icon choice, text field for name, switch toggle
2. Rehab params: two steppers (addiction + strictness), text showing computed days
3. Interruption prefs: dropdown for cooldown duration

All values from providers, editable.

**Checkpoint:** Can change stealth mode, rehab params update computed days

---

## Step 10: Report Screen

Layout (scrollable):
1. Card: today's total, unlocks, top app, vs yesterday
2. Chart: weekly bar chart with `fl_chart` — dummy 7-day data
3. Progress bar: "Day X of Y" with linear indicator
4. Horizontal list: top 5 apps with time
5. Line chart: 30-day trend (dummy)
6. Card: interruptions triggered today

All charts use dummy data. Minimal — no chart styling.

**Checkpoint:** All sections render with dummy data

---

## Step 11: Settings Screen

Layout (ListView):
- Profile section: name, age, email (read-only)
- Language dropdown
- Notification toggles (3 switches)
- Data & Privacy (text buttons)
- About (text)
- Sign Out button

**Checkpoint:** Sign out works → returns to Sign-In

---

## Step 12: Chat Screen

Layout:
- AppBar with title
- ListView of chat bubbles (user right-aligned, AI left-aligned)
- Bottom: TextField + Send IconButton
- On send: add user message, add hardcoded AI response after 1 second delay

**Checkpoint:** Can type messages, hardcoded responses appear

---

## Step 13: Update Docs

- Update `vibecoding/mobile/progress.md`
- Create `mobile-app/CONTEXT.md` with screen list and data flow
- Update any structural changes in `vibecoding/mobile/directory_structure.md`

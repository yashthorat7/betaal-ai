# Mobile App Tech Stack — Betaal AI

## Flutter & Dart

| Component | Technology / Package | Purpose |
|-----------|---------------------|---------|
| Framework | Flutter 3.x | Cross-platform UI (Android only for now) |
| Language | Dart (UI) + Kotlin (native bridge) | UI logic + native Android APIs |
| State Management | Provider (or GetX) | Lightweight, fast for hackathon |
| Authentication | `firebase_auth` ^4.x + `google_sign_in` ^6.x | Google Sign-In |
| Database | `cloud_firestore` ^4.x | Sync data with Firebase |
| HTTP Client | `dio` ^5.x | REST API calls to FastAPI backend |
| Overlay Engine | `flutter_overlay_window` / custom Kotlin | System-level overlay interruptions |
| Usage Tracking | `usage_stats` + custom Kotlin `MethodChannel` | Read Android UsageStatsManager |
| Charts | `fl_chart` ^0.65 | Progress rings, bar charts, line graphs |
| Animations | `lottie` ^2.x + built-in Flutter animations | Splash, transitions |
| Localization | `flutter_localizations` + `.arb` files | Multi-language support |
| Local Storage | `shared_preferences` ^2.x | Cache settings locally |
| Notifications | `flutter_local_notifications` ^16.x | Rehab reminders, daily summaries |
| Permissions | `permission_handler` ^11.x | Request usage, overlay, battery perms |
| Environment | `flutter_dotenv` ^5.x | API keys, config |

## Native Kotlin Modules

| Module | Purpose |
|--------|---------|
| `UsageTrackingService` | Foreground service polling `UsageStatsManager` |
| `OverlayService` | Draws system-level overlays (`TYPE_APPLICATION_OVERLAY`) |
| `BootReceiver` | `RECEIVE_BOOT_COMPLETED` → restart tracking on reboot |
| `StealthChannel` | Enable/disable activity aliases for icon/name swap |

## Android Requirements

| Requirement | Value |
|-------------|-------|
| Min SDK | API 26 (Android 8.0) |
| Target SDK | API 34 (Android 14) |
| Key Permissions | PACKAGE_USAGE_STATS, SYSTEM_ALERT_WINDOW, REQUEST_IGNORE_BATTERY_OPTIMIZATIONS, INTERNET, RECEIVE_BOOT_COMPLETED |

---

## Environment Variables (.env)

```
API_BASE_URL=http://your-backend-url:8000
GEMINI_API_KEY=your_gemini_api_key_here
```

Firebase config: download `google-services.json` from Firebase Console → place at `android/app/google-services.json`

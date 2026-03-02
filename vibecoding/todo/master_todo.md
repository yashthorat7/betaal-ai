# Master Development Plan — Betaal AI

## Philosophy

**Core first → Layout second → Features third → Connect fourth → Style last.**

Every component follows this pattern. We never touch colors or fonts until Phase 7.

---

## Phase Overview

| Phase | What | Components | Goal |
|-------|------|-----------|------|
| **1** | Mobile Core | `mobile-app/` | Native Kotlin modules working — usage tracking + overlay. No Flutter UI. |
| **2** | Mobile Layout | `mobile-app/` | Flutter screens with B&W minimal layout. Dummy data. No styling. |
| **3** | Website | `web-dashboard/` | Next.js pages with B&W layout. Dummy data from seed_data.md. |
| **4** | Extension | `browser-extension/` | Chrome extension fully working. Timer, overlay, popup. Minimal UI. |
| **5** | AI Backend | `ai-backend/` | FastAPI endpoints, math engine, seed data, Gemini chat. All APIs working. |
| **6** | Integration | All | Connect all frontends to real backend. Replace dummy data with API calls. |
| **7** | Styling | All | Colors, fonts, animations, polish. Make it look stunning for judges. |

---

## Phase Checklist

### Phase 1 — Mobile Core (No UI)
> Detailed steps: [phase_1_mobile_core.md](./phase_1_mobile_core.md)

- [ ] Set up Flutter project with Kotlin native bridge
- [ ] Implement `UsageTrackingService.kt` — read UsageStatsManager
- [ ] Implement `OverlayService.kt` — draw system overlay
- [ ] Implement `BootReceiver.kt` — restart on reboot
- [ ] Implement `StealthChannel.kt` — activity-alias toggling
- [ ] Create MethodChannel bridges (Dart ↔ Kotlin)
- [ ] **Feasibility check:** verify usage tracking + overlay work on real device
- [ ] Create `CONTEXT.md` in `mobile-app/` for future AI sessions

### Phase 2 — Mobile Layout (B&W, Dummy Data)
> Detailed steps: [phase_2_mobile_layout.md](./phase_2_mobile_layout.md)

- [ ] Firebase Auth + Google Sign-In
- [ ] Splash → Sign-In → Onboarding flow
- [ ] Home Screen (monitoring ring, 7-day summary, FAB)
- [ ] Personalization Screen (stealth, rehab params)
- [ ] Report Screen (charts with dummy data)
- [ ] Settings Screen
- [ ] Chat Screen (hardcoded responses for now)
- [ ] All screens minimal B&W — layout only, no colors

### Phase 3 — Website (B&W, Dummy Data)
> Detailed steps: [phase_3_website.md](./phase_3_website.md)

- [ ] Init Next.js project with Tailwind
- [ ] Landing page sections (hero, problem, how it works, features, CTA)
- [ ] Dashboard with dummy charts (Recharts)
- [ ] Resources page (guided steps, articles, FAQ)
- [ ] About page (team, mission, contact form)
- [ ] Firebase Auth for dashboard
- [ ] All pages minimal B&W — layout only

### Phase 4 — Extension (Core + Layout)
> Detailed steps: [phase_4_extension.md](./phase_4_extension.md)

- [ ] manifest.json + file structure
- [ ] background.js — timer, idle detection, messaging
- [ ] content.js — blur overlay + warning banner injection
- [ ] Popup — usage ring, top sites, remaining time
- [ ] Options page — daily limit, whitelist, account link
- [ ] Offline-first: works without backend

### Phase 5 — AI Backend
> Detailed steps: [phase_5_ai_backend.md](./phase_5_ai_backend.md)

- [ ] FastAPI project setup + CORS + middleware
- [ ] Firebase Admin SDK integration
- [ ] Auth endpoints (verify token)
- [ ] User CRUD endpoints
- [ ] Rehab engine (plan generation, recalculation)
- [ ] Interruption scheduler (math engine, weighted random)
- [ ] Usage analytics (aggregation, heat map, streaks)
- [ ] ML model (train on synthetic data, inference endpoint)
- [ ] Chat AI (Gemini integration with user context)
- [ ] Report generator (daily, weekly)
- [ ] Extension API (heartbeat, threshold check)
- [ ] Seed database script
- [ ] All endpoints match `api_examples.md` contracts

### Phase 6 — Integration
> Detailed steps: [phase_6_integration.md](./phase_6_integration.md)

- [ ] Mobile app → Backend API calls (replace dummy data)
- [ ] Website dashboard → Backend API calls (replace dummy data)
- [ ] Extension → Backend sync (heartbeat, threshold)
- [ ] AI Chat → Live Gemini via backend
- [ ] Cross-platform data appears on dashboard
- [ ] End-to-end demo flow works

### Phase 7 — Styling
> Detailed steps: [phase_7_styling.md](./phase_7_styling.md)

- [ ] Design system: color palette, typography, spacing
- [ ] Mobile app styling
- [ ] Website styling
- [ ] Extension popup/overlay styling
- [ ] Animations and transitions
- [ ] Final polish and demo rehearsal

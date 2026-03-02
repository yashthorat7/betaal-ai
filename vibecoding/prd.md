# Product Requirements Document — Betaal AI Ecosystem

## 0. The Idea

**One-Liner:** An AI-powered digital rehabilitation system that cures smartphone addiction through adaptive, escalating interruptions instead of hard app-blocking.

**The Problem:** Mobile addiction is a growing epidemic — Gen Z averages 7–9 hours of daily screen time. Existing solutions are static app blockers that are easily bypassed, frustrating, and don't address the behavioral root of addiction. Nobody is treating this like a **rehabilitation program**.

**Our Solution:** Betaal AI is a multi-platform ecosystem that acts as a **personalized digital rehab coach**. Instead of locking users out (which they'll just uninstall), we use an adaptive engine that introduces **gradual, escalating interruptions** — screen blurring, reverse scrolling, black screens — that get progressively worse the more you exceed your daily limit. The system learns from your behavior and adjusts the rehab plan automatically.

**Key Innovations:**
- **Gradual Interruptions** — 20 types of disruptions that escalate based on math-driven intensity curves
- **Safety Cooldown** — 10–15 min grace period on unlock so users can handle emergencies
- **Stealth Mode** — app disguises itself as a calculator/notes app (parental control)
- **AI Chat Assistant** — Gemini-powered chatbot that knows your stats and gives personalized rehab feedback
- **Cross-Platform Sync** — phone + desktop usage combined into one rehab plan

---

## 1. Overview

**Product:** Betaal AI
**Type:** Multi-platform digital rehabilitation ecosystem
**Platforms:** Android (primary), Web (dashboard), Chrome (extension)
**Timeframe:** 24-hour hackathon prototype — must be demonstrable, not production-ready

---

## 2. Ecosystem Components

| Component | Role | Consumers |
|-----------|------|-----------|
| Flutter Mobile App | Primary user-facing product — tracks usage, delivers interruptions | End user |
| FastAPI Backend | Brain — computes rehab plans, math engine, ML model, AI chat | Mobile, Website, Extension |
| Next.js Website | Landing page (marketing) + dashboard (monitoring) | End user, parents |
| Chrome Extension | Desktop companion — tracks browser time, blurs on limit | End user |
| Firebase | Auth (Google Sign-In) + Firestore (data sync) | All components |

---

## 3. Core Features

### 3.1 Gradual Interruption Engine

The hero feature. Instead of blocking apps, the system delivers **escalating UI disruptions**:

**20 Interruption Types:**

| # | Type | # | Type |
|---|------|---|------|
| 1 | Screen blur | 11 | Grayscale filter |
| 2 | Black screen | 12 | Slow touch response |
| 3 | Reverse scroll | 13 | Random vibration |
| 4 | Touch offset | 14 | Screen shake |
| 5 | Flicker | 15 | Countdown overlay |
| 6 | Color invert | 16 | Motivational quote |
| 7 | Shrink screen | 17 | Breathing exercise |
| 8 | Rotate display | 18 | Lock for N seconds |
| 9 | Ghost touch | 19 | Audio alert |
| 10 | Progressive dim | 20 | Full block |

**Intensity escalation:** Gentle → Moderate → Aggressive (sigmoid curve based on usage vs. quota)

**Selection logic:** Weighted random — factors in app category, time of day, cumulative usage, rehab phase

### 3.2 Rehabilitation Plan

Each user gets a personalized rehab plan based on:
- `addiction_level` (1–10, self-reported)
- `strictness` (1–5, user-chosen)

**Plan structure:**

| Phase | % of Total Days | Daily Quota | Intensity |
|-------|----------------|-------------|-----------|
| 1 — Awareness | 20% | current_avg × 0.9 | 0.2 (gentle) |
| 2 — Reduction | 30% | current_avg × 0.65 | 0.5 (moderate) |
| 3 — Discipline | 30% | current_avg × 0.4 | 0.8 (aggressive) |
| 4 — Freedom | 20% | current_avg × 0.2 | 0.5 (maintenance) |

Duration formula: `base = addiction_level × 3`, `modifier = 6 - strictness`, `duration = clamp(base × modifier, 7, 90)`

### 3.3 Safety Cooldown

- On every phone unlock → **10–15 min grace period** with zero interruptions
- Ensures users can handle real-life emergencies
- Cooldown duration scales with current intensity level
- When phone is locked during interruptions → save position, resume after cooldown

### 3.4 AI Chat Assistant

- Powered by Google Gemini API via the FastAPI backend
- System prompt includes real-time user stats (rehab day, usage, streaks)
- Provides personalized feedback, tips, and encouragement
- **This runs live during the demo** — judges can interact with it

### 3.5 Stealth Mode (Parental Control)

- Change app icon to a decoy (calculator, notes, weather)
- Change app name in launcher
- Uses Android `activity-alias` toggling
- Purpose: prevent children from identifying and deleting the app

### 3.6 Cross-Platform Tracking

- Mobile app tracks phone usage
- Browser extension tracks desktop browsing
- Both sync to Firebase via the backend
- Website dashboard shows combined stats

---

## 4. Screen / Page Layout — Mobile App

> **Note:** Layout structure only. No colors, fonts, or styling.

### Onboarding (4-step walkthrough)

| Step | Title | Elements |
|------|-------|----------|
| 1 | "Let's start with you" | Avatar picker, name input, age stepper |
| 2 | "What smartphone has done to you" | Addiction level selector (1–10) |
| 3 | "How dedicated are you?" | Strictness selector, computed rehab days display |
| 4 | "Setup permissions" | Usage access, overlay, battery exemption, notifications — each with checkbox |

### Home Screen

| Section | Content |
|---------|---------|
| Top bar | User name (left), profile avatar (right) |
| 7-day summary | Horizontal row of day indicators (green=under, red=over) |
| Monitoring ring | Large circular progress ring — remaining time, quota, urgency color |
| AI Chat FAB | Floating button → opens chat screen |

### Personalization Screen

| Section | Content |
|---------|---------|
| Stealth mode | Icon picker, name input, toggle |
| Rehab params | Addiction + strictness steppers, computed days |
| Interruption prefs | Cooldown duration selector, preview interruptions |

### Report Screen

| Section | Content |
|---------|---------|
| Today's summary | Total time, unlocks, most-used app, vs. yesterday |
| Weekly chart | Bar/line graph (Mon–Sun) |
| Rehab progress | Linear progress bar (Day X of Y) |
| App breakdown | Horizontal bars — top 5 apps with time |
| Monthly trend | Line graph — 30 day avg |
| Interruption log | Count and types triggered |

### Settings Screen

| Section | Content |
|---------|---------|
| Profile | Edit name, age, photo |
| Language | Language selector |
| Notifications | Toggles for summary, milestones, reminders |
| Data & Privacy | Export, delete account, privacy policy |
| About | Version, licenses, contact |
| Sign out | Button |

---

## 5. Page Layout — Website

### Landing Page

| Section | Content |
|---------|---------|
| Hero | Headline, subtitle, CTA button, hero visual |
| Problem | Stats about screen addiction |
| Solution | How Betaal AI works (3-step or feature cards) |
| Features | Grid of feature cards with icons |
| How it works | Step-by-step flow |
| Testimonials | Fake testimonials for demo |
| Download / CTA | Final call-to-action |

### Dashboard

| Section | Content |
|---------|---------|
| Sidebar nav | Profile, overview, reports, settings |
| Overview cards | Today's screen time, streak, rehab progress |
| Charts | Daily/weekly usage graphs, app breakdown pie chart |
| Rehab timeline | Phase progress with milestones |
| AI insights | Summary from AI analysis |

---

## 6. Extension Layout

### Popup (click extension icon)

| Section | Content |
|---------|---------|
| Header | Betaal AI branding |
| Usage ring | Today's time used / limit |
| Stats | Top 3 sites with time |
| Action | "Open Dashboard" button |

### Full-page overlay (limit hit)

| Element | Content |
|---------|---------|
| Backdrop | Full-page blur, dark semi-transparent layer |
| Card | "Time's Up!" message, countdown timer, "+10 Minutes" button |
| Behavior | Cannot be closed; only dismissed via +10 min or cooldown |

### Warning banner (near limit)

| Element | Content |
|---------|---------|
| Position | Fixed top of page |
| Content | "You have X minutes left today" with dismiss button |

---

## 7. Hackathon Demo Strategy

| What | How |
|------|-----|
| Charts & stats | Pre-seeded with 14 days of synthetic Firebase data |
| ML model | Pre-trained on synthetic dataset, loaded on startup |
| AI chat | Live via Gemini API — judges interact in real-time |
| Interruption demo | Simulate a short session, trigger escalating interruptions |
| Dashboard | Pre-populated with realistic heat maps and trends |
| Extension | Set limit to 2 min so it triggers fast during demo |
| Cross-platform | Same user data visible on phone, website, and extension |

---

## 8. Success Criteria

- [ ] Judges see a live interruption escalation demo
- [ ] Judges interact with the AI chatbot and get personalized responses
- [ ] Dashboard shows realistic-looking stats and predictions
- [ ] "We trained our own model" is demonstrable
- [ ] Rehab plan visibly adjusts when strictness is changed live
- [ ] Extension blur triggers during demo browsing
- [ ] All 4 platforms show synced data for the same user
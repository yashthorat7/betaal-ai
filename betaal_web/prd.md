# Website PRD . Betaal AI

## 1. Overview

The website is the **public-facing portal** for Betaal AI. It serves two purposes:

1. **Landing Page** . Explain the product, impress judges, provide download links
2. **Dashboard** . Logged-in users/parents monitor screen time stats and rehab progress

Plus two supporting pages: Resources and About.

**Auth required:** Only for Dashboard. All other pages are public.

---

## 2. Pages

| Page | Route | Auth | Purpose |
|------|-------|------|---------|
| Landing | `/` | No | Marketing, first impression, CTAs |
| Dashboard | `/dashboard` | Yes | Usage stats, charts, rehab progress |
| Resources | `/resources` | No | Guides, articles, FAQ |
| About | `/about` | No | Team, mission, contact |

---

## 3. Global Components

### Navbar

| Element | Details |
|---------|---------|
| Logo | "Betaal AI" text + icon, links to `/` |
| Nav Links | Home · Dashboard · Resources · About |
| Auth Button | Not logged in → "Sign In" button. Logged in → avatar + dropdown (Profile, Logout) |
| Behavior | Sticky on scroll. Mobile → hamburger menu |

### Footer

| Element | Details |
|---------|---------|
| Left | Logo + copyright |
| Center | Nav links + Privacy Policy |
| Right | Social icons (GitHub, Twitter, LinkedIn) |
| Bottom | Team credit line |

---

## 4. Page Layouts

> **No styling details.** Layout structure only.

### 4.1 Landing Page (`/`)

| Section | Content |
|---------|---------|
| Hero | Headline ("Reclaim Your Focus with Betaal AI"), subtitle, 2 CTA buttons (Download App, Get Extension), phone mockup visual |
| Problem Statement | 3 stat cards (9+ hrs/day, 68% feel addicted, 12% tried detox), brief paragraph on the crisis |
| How It Works | 3 step cards: Sign Up → AI Tracks → Gradual Recovery |
| Key Features | 2×3 grid of feature cards: AI Rehab, Stealth Mode, Smart Reports, Extension, Gradual Interruptions, AI Chat |
| Research | 2–3 paragraphs on the science of gradual intervention + optional infographic |
| Bottom CTA | "Ready to break free?" + repeated download buttons |

### 4.2 Dashboard (`/dashboard`)

| Section | Content |
|---------|---------|
| Header bar | "Welcome back, [Name] 👋" + current date |
| Today's summary | Large progress ring (time used / limit), total used, daily limit |
| Weekly trend | Line chart (Mon–Sun screen time) |
| App breakdown | Horizontal scrollable row of app cards with time + progress bars |
| Rehab progress | Horizontal progress bar (Day X of Y), current phase, next milestone, AI recommendation |
| Connected devices | Vertical list: device icon, name, status, today's usage + "Link New Device" button |
| Heat map | GitHub-style 30-day contribution grid (darker = more usage) |

### 4.3 Resources (`/resources`)

| Section | Content |
|---------|---------|
| Guided Steps | 4 expandable cards: Understanding Addiction → Mindfulness → Boundaries → Maintaining Progress |
| Articles & Blog | 3-column card grid with thumbnails, titles, read times (pre-written placeholder content) |
| Downloadable Resources | List with download buttons: Screen Time Tracker PDF, Weekly Journal, Family Agreement |
| FAQ | Accordion-style: 5–8 questions about how the app works, privacy, parental control, etc. |

### 4.4 About (`/about`)

| Section | Content |
|---------|---------|
| Mission statement | Centered large quote about healthy tech relationship |
| Team | 4-column grid: photo, name, role, 1-line bio, social links |
| Our Approach | 2–3 paragraphs on why gradual intervention works + vision |
| Contact form | Name, email, message fields + send button. For demo: just show success toast |

---

## 5. Data Sources

| Data | Source | Demo Strategy |
|------|--------|---------------|
| User profile | Firebase Auth | Real Google Sign-In |
| Usage stats | REST API → FastAPI `/api/usage/*` | Pre-seeded dummy data |
| Rehab plan | REST API → FastAPI `/api/rehab/*` | Pre-seeded dummy data |
| AI insights | REST API → FastAPI `/api/chat` | Live Gemini API |
| Articles | Static content / MDX | Pre-written placeholder |

---

## 6. SEO & Meta

Each page needs proper `<title>` and `<meta name="description">` tags:

| Page | Title | Description |
|------|-------|-------------|
| Landing | Betaal AI . Digital Rehabilitation for Screen Addiction | AI-powered app that helps overcome screen addiction through gradual interventions |
| Dashboard | Dashboard . Betaal AI | Monitor screen time and track rehabilitation progress |
| Resources | Resources . Betaal AI | Guides, articles, and tools for managing screen time |
| About | About Us . Betaal AI | Meet the team and learn about our mission |

Open Graph tags for social sharing previews.

---

## 7. Demo Strategy

- Dashboard pre-populated with 14 days of synthetic data
- Charts render realistic trends (improvement curve)
- Heat map shows decreasing usage pattern
- Connected devices show 2–3 dummy entries
- Contact form just shows a success toast on submit
- Resources page has placeholder articles (can be AI-generated)

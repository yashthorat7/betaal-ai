# Phase 3 — Website (B&W, Dummy Data)

**Goal:** All Next.js pages built with minimal B&W layout. Dashboard shows dummy charts. No styling.

**Time estimate:** 4–5 hours
**Prerequisite:** None (can run parallel with Phase 2)

---

## Step 1: Project Setup

1. Initialize Next.js in `web-dashboard/`:
   ```bash
   npx -y create-next-app@latest ./ --tailwind --app --src-dir=false --import-alias="@/*" --eslint
   ```
2. Install dependencies:
   ```bash
   npm install firebase recharts zustand framer-motion axios lucide-react next-auth
   ```
3. Create `.env.local` from `vibecoding/env_templates/web-dashboard.env.local.example`
4. Verify `npm run dev` works

**Checkpoint:** Next.js dev server runs at localhost:3000

---

## Step 2: Firebase Client Setup

**File:** `lib/firebase.js`

1. Initialize Firebase client SDK with env vars
2. Export `auth` and `firestore` instances

**Checkpoint:** Firebase initialized without errors

---

## Step 3: Dummy Data

**File:** `lib/dummy-data.js`

1. Port the JSON from `vibecoding/seed_data.md` into JavaScript objects
2. Export functions: `getUser()`, `getUsageLogs()`, `getRehabPlan()`, `getTodayApps()`, etc.
3. All pages import from here until Phase 6

**Checkpoint:** Data importable from any component

---

## Step 4: Global Layout + Navbar + Footer

**Files:** `app/layout.jsx`, `components/Navbar.jsx`, `components/Footer.jsx`

1. Layout: wraps all pages with Navbar + Footer
2. Navbar: text logo, 4 links (Home, Dashboard, Resources, About), sign-in button placeholder
3. Footer: logo, nav links, team credit

All minimal — plain text, basic flex layout, no colors.

**Checkpoint:** Navbar and footer appear on every page

---

## Step 5: Landing Page (`/`)

**File:** `app/page.jsx` + components

Build sections top to bottom:
1. **HeroSection** — headline text, subtitle, 2 placeholder buttons, empty image spot
2. **ProblemStats** — 3 stat numbers in a row
3. **HowItWorks** — 3 text cards with step numbers
4. **FeaturesGrid** — 2×3 grid of text cards
5. **ResearchSection** — 2 paragraphs of text
6. **CTABanner** — headline + 2 buttons

Each component is its own file in `components/`. All B&W.

**Checkpoint:** Landing page has all 6 sections, scrollable, no styling

---

## Step 6: Dashboard (`/dashboard`)

**File:** `app/dashboard/page.jsx` + components

1. **Header bar** — "Welcome back, [Name]" text
2. **ProgressRing** — SVG circle showing dummy usage/limit
3. **WeeklyChart** — Recharts line chart with 7 dummy data points
4. **AppBreakdown** — row of cards with app name + minutes
5. **RehabProgress** — div with progress bar + text
6. **DeviceList** — list of 3 dummy devices
7. **HeatMap** — grid of colored squares (or just placeholder text)

All data from `lib/dummy-data.js`. No auth check yet (add in Phase 6).

**Checkpoint:** Dashboard shows all sections with dummy data

---

## Step 7: Resources (`/resources`)

**File:** `app/resources/page.jsx` + components

1. **GuidedSteps** — 4 expandable divs (click to toggle content)
2. **ArticleGrid** — 3 cards with placeholder titles and read times
3. **Downloads** — 3 rows with text + download button (placeholder)
4. **FAQ** — 5 accordion items (click to expand)

**Checkpoint:** All sections interactive (accordions open/close)

---

## Step 8: About (`/about`)

**File:** `app/about/page.jsx` + components

1. **Mission** — centered large text block
2. **TeamGrid** — 4 cards with name, role, 1-line bio
3. **OurApproach** — 2 paragraphs
4. **ContactForm** — 3 inputs + submit button (shows alert on submit)

**Checkpoint:** Contact form submits (console.log or alert)

---

## Step 9: Update Docs

- Update `vibecoding/website/progress.md`
- Create `web-dashboard/CONTEXT.md`
- Update `vibecoding/website/directory_structure.md` if structure changed

# TODO — Website (betaal_web)

> **Owner:** Bhumika
> **Estimated Time:** 4–5 hours (Phase 3) + 2–3 hours (Integration) + 3 hours (Styling)
> **Rule:** All pages start B&W. Dummy data first. No styling until Phase 7. Can run parallel with Phase 2.

---

## Phase 3 — Website (B&W, Dummy Data)

### Step 1: Project Setup
- [x] Initialize Next.js:
  ```bash
  npx -y create-next-app@latest ./ --tailwind --app --src-dir=false --import-alias="@/*" --eslint
  ```
- [x] Install dependencies:
  ```bash
  npm install firebase recharts zustand framer-motion axios lucide-react next-auth
  ```
- [x] Create `.env.local` from template (see `tech_stack.md`)
- [x] Verify: `npm run dev` works at `localhost:3000`

### Step 2: Firebase Client Setup
- [x] Create `lib/firebase.js` — initialize Firebase client SDK with env vars
- [x] Export `auth` and `firestore` instances
- [x] Verify: Firebase initialized without errors

### Step 3: Dummy Data
- [x] Create `lib/dummy-data.js` — port JSON from `api_and_data.md` (in `betaal_ai/`)
- [x] Export: `getUser()`, `getUsageLogs()`, `getRehabPlan()`, `getTodayApps()`, etc.
- [x] Verify: data importable from any component

### Step 4: Global Layout + Navbar + Footer
- [x] Create `app/layout.jsx` — wraps all pages
- [x] Create `components/Navbar.jsx` — text logo, 4 links (Home, Dashboard, Resources, About), sign-in placeholder
- [x] Create `components/Footer.jsx` — logo, nav links, team credit
- [x] All minimal — plain text, basic flex, no colors
- [x] Verify: navbar and footer appear on every page

### Step 5: Landing Page (`/`)
- [x] Create `components/HeroSection.jsx` — headline, subtitle, 2 placeholder buttons, empty image spot
- [x] Create `components/ProblemStats.jsx` — 3 stat numbers in a row
- [x] Create `components/HowItWorks.jsx` — 3 text cards with step numbers
- [x] Create `components/FeaturesGrid.jsx` — 2×3 grid of text cards
- [x] Create `components/ResearchSection.jsx` — 2 paragraphs
- [x] Create `components/CTABanner.jsx` — headline + 2 buttons
- [x] Wire all into `app/page.jsx`
- [x] Verify: landing page has all 6 sections, scrollable, no styling

### Step 6: Dashboard (`/dashboard`)
- [x] Create `components/ProgressRing.jsx` — SVG circle showing dummy usage/limit
- [x] Create `components/WeeklyChart.jsx` — Recharts line chart with 7 dummy data points
- [x] Create `components/AppBreakdown.jsx` — row of cards with app name + minutes
- [x] Create `components/RehabProgress.jsx` — div with progress bar + text
- [x] Create `components/DeviceList.jsx` — list of 3 dummy devices
- [x] Create `components/HeatMap.jsx` — grid of colored squares (or placeholder text)
- [x] Wire all into `app/dashboard/page.jsx` with header bar ("Welcome back, [Name]")
- [x] All data from `lib/dummy-data.js`. No auth check yet.
- [x] Verify: dashboard shows all sections with dummy data

### Step 7: Resources (`/resources`)
- [x] Create `components/GuidedSteps.jsx` — 4 expandable divs (click to toggle)
- [x] Create `components/ArticleGrid.jsx` — 3 cards with placeholder titles + read times
- [x] Create `components/FAQ.jsx` — 5 accordion items (click to expand)
- [x] Add downloads section — 3 rows with text + download button (placeholder)
- [x] Wire all into `app/resources/page.jsx`
- [x] Verify: all sections interactive (accordions open/close)

### Step 8: About (`/about`)
- [x] Create `components/TeamGrid.jsx` — 4 cards with name, role, 1-line bio
- [x] Create `components/ContactForm.jsx` — 3 inputs + submit button
- [x] Add mission statement — centered large text block
- [x] Add "Our Approach" — 2 paragraphs
- [x] Wire all into `app/about/page.jsx`
- [x] Verify: contact form submits (console.log or alert)

### Step 9: SEO Meta Tags
- [x] Landing: title "Betaal AI — Digital Rehabilitation for Screen Addiction"
- [x] Dashboard: title "Dashboard — Betaal AI"
- [x] Resources: title "Resources — Betaal AI"
- [x] About: title "About Us — Betaal AI"
- [x] Add Open Graph tags for social sharing

### Step 10: Documentation
- [x] Update `progress.md`
- [x] Create `CONTEXT.md` in `betaal_web/`

---

## Phase 4 — Professional Refactor & UI Enhancement

### Step 1: Folder Restructuring
- [x] Move components to sub-folders (`landing/`, `dashboard/`, `resources/`, `about/`, `common/`)
- [x] Create `lib/hooks/` for shared logic (`useIsClient`)
- [x] Clean up top-level `components/` directory (delete redundant files)
- [x] Verify: Site still navigates and renders correctly

### Step 2: Atomic Styling & Design System
- [x] Centralize all styles in `app/globals.css` using Tailwind `@apply`
- [x] Define reusable classes: `.card`, `.btn-primary`, `.heading-xl`, `.container-wide`, etc.
- [x] Refactor all components to use these centralized classes
- [x] Verify: Changing one class in `globals.css` updates the entire site

### Step 3: shadcn/ui Integration
- [x] Initialize `shadcn/ui` with professional "New York" neutral theme
- [x] Install core primitives: `Button`, `Card`, `Input`, `Textarea`, `Accordion`
- [x] Refactor Hero, HowItWorks, FeaturesGrid, FAQ, and ContactForm to use shadcn primitives
- [x] Fix dependency issues (replaced `tw-animate-css` with `tailwindcss-animate`)
- [x] Verify: System feels premium and accessible

---

## Phase 6 — Integration (Website Tasks)

- [x] Update `lib/api.js` base URL to deployed backend
- [x] Replace `lib/dummy-data.js` calls with API calls:
  - [x] Dashboard ring → GET `/usage/stats`
  - [x] Weekly chart → GET `/report/weekly`
  - [x] App breakdown → GET `/usage/stats` (top apps)
  - [x] Rehab progress → GET `/rehab/plan`
  - [x] Connected devices → GET `/monitor/{child_id}/stats`
  - [x] Heat map → GET `/usage/heatmap`
- [x] Add Firebase Auth to dashboard page (redirect if not logged in)
- [x] Set up NextAuth with Google provider (`app/api/auth/[...nextauth]/route.js`)
- [x] Verify: dashboard shows live data from backend

---
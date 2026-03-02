# TODO — Website (betaal_web)

> **Owner:** Bhumika
> **Estimated Time:** 4–5 hours (Phase 3) + 2–3 hours (Integration) + 3 hours (Styling)
> **Rule:** All pages start B&W. Dummy data first. No styling until Phase 7. Can run parallel with Phase 2.

---

## Phase 3 — Website (B&W, Dummy Data)

### Step 1: Project Setup
- [ ] Initialize Next.js:
  ```bash
  npx -y create-next-app@latest ./ --typescript --tailwind --app --src-dir=false --import-alias="@/*" --eslint
  ```
- [ ] Install dependencies:
  ```bash
  npm install firebase recharts zustand framer-motion axios lucide-react next-auth
  ```
- [ ] Create `.env.local` from template (see `tech_stack.md`)
- [ ] Verify: `npm run dev` works at `localhost:3000`

### Step 2: Firebase Client Setup
- [ ] Create `lib/firebase.ts` — initialize Firebase client SDK with env vars
- [ ] Export `auth` and `firestore` instances
- [ ] Verify: Firebase initialized without errors

### Step 3: Dummy Data
- [ ] Create `lib/dummy-data.ts` — port JSON from `api_and_data.md` (in `betaal_ai/`)
- [ ] Export: `getUser()`, `getUsageLogs()`, `getRehabPlan()`, `getTodayApps()`, etc.
- [ ] Verify: data importable from any component

### Step 4: Global Layout + Navbar + Footer
- [ ] Create `app/layout.tsx` — wraps all pages
- [ ] Create `components/Navbar.tsx` — text logo, 4 links (Home, Dashboard, Resources, About), sign-in placeholder
- [ ] Create `components/Footer.tsx` — logo, nav links, team credit
- [ ] All minimal — plain text, basic flex, no colors
- [ ] Verify: navbar and footer appear on every page

### Step 5: Landing Page (`/`)
- [ ] Create `components/HeroSection.tsx` — headline, subtitle, 2 placeholder buttons, empty image spot
- [ ] Create `components/ProblemStats.tsx` — 3 stat numbers in a row
- [ ] Create `components/HowItWorks.tsx` — 3 text cards with step numbers
- [ ] Create `components/FeaturesGrid.tsx` — 2×3 grid of text cards
- [ ] Create `components/ResearchSection.tsx` — 2 paragraphs
- [ ] Create `components/CTABanner.tsx` — headline + 2 buttons
- [ ] Wire all into `app/page.tsx`
- [ ] Verify: landing page has all 6 sections, scrollable, no styling

### Step 6: Dashboard (`/dashboard`)
- [ ] Create `components/ProgressRing.tsx` — SVG circle showing dummy usage/limit
- [ ] Create `components/WeeklyChart.tsx` — Recharts line chart with 7 dummy data points
- [ ] Create `components/AppBreakdown.tsx` — row of cards with app name + minutes
- [ ] Create `components/RehabProgress.tsx` — div with progress bar + text
- [ ] Create `components/DeviceList.tsx` — list of 3 dummy devices
- [ ] Create `components/HeatMap.tsx` — grid of colored squares (or placeholder text)
- [ ] Wire all into `app/dashboard/page.tsx` with header bar ("Welcome back, [Name]")
- [ ] All data from `lib/dummy-data.ts`. No auth check yet.
- [ ] Verify: dashboard shows all sections with dummy data

### Step 7: Resources (`/resources`)
- [ ] Create `components/GuidedSteps.tsx` — 4 expandable divs (click to toggle)
- [ ] Create `components/ArticleGrid.tsx` — 3 cards with placeholder titles + read times
- [ ] Create `components/FAQ.tsx` — 5 accordion items (click to expand)
- [ ] Add downloads section — 3 rows with text + download button (placeholder)
- [ ] Wire all into `app/resources/page.tsx`
- [ ] Verify: all sections interactive (accordions open/close)

### Step 8: About (`/about`)
- [ ] Create `components/TeamGrid.tsx` — 4 cards with name, role, 1-line bio
- [ ] Create `components/ContactForm.tsx` — 3 inputs + submit button
- [ ] Add mission statement — centered large text block
- [ ] Add "Our Approach" — 2 paragraphs
- [ ] Wire all into `app/about/page.tsx`
- [ ] Verify: contact form submits (console.log or alert)

### Step 9: SEO Meta Tags
- [ ] Landing: title "Betaal AI — Digital Rehabilitation for Screen Addiction"
- [ ] Dashboard: title "Dashboard — Betaal AI"
- [ ] Resources: title "Resources — Betaal AI"
- [ ] About: title "About Us — Betaal AI"
- [ ] Add Open Graph tags for social sharing

### Step 10: Documentation
- [ ] Update `progress.md`
- [ ] Create `CONTEXT.md` in `betaal_web/`

---

## Phase 6 — Integration (Website Tasks)

- [ ] Update `lib/api.ts` base URL to deployed backend
- [ ] Replace `lib/dummy-data.ts` calls with API calls:
  - [ ] Dashboard ring → GET `/usage/stats`
  - [ ] Weekly chart → GET `/report/weekly`
  - [ ] App breakdown → GET `/usage/stats` (top apps)
  - [ ] Rehab progress → GET `/rehab/plan`
  - [ ] Connected devices → GET `/monitor/{child_id}/stats`
  - [ ] Heat map → GET `/usage/heatmap`
- [ ] Add Firebase Auth to dashboard page (redirect if not logged in)
- [ ] Set up NextAuth with Google provider (`app/api/auth/[...nextauth]/route.ts`)
- [ ] Verify: dashboard shows live data from backend

---

## Phase 7 — Styling (Website Tasks)

- [ ] Apply Tailwind classes for color palette
- [ ] Style landing page hero (gradient background, larger typography)
- [ ] Style feature cards (hover effects, shadows)
- [ ] Style dashboard charts and rings
- [ ] Style navbar (active link, scroll behavior)
- [ ] Add Framer Motion scroll reveals
- [ ] Responsive polish (mobile, tablet breakpoints)
- [ ] Generate hero images for landing page
- [ ] Final update to `progress.md`

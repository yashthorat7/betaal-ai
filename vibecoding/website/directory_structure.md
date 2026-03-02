# Website Directory Structure — Betaal AI

```
web-dashboard/
│
├── app/                              # Next.js App Router
│   ├── layout.tsx                    # Root layout (navbar, footer, providers)
│   ├── page.tsx                      # Landing page (/)
│   ├── globals.css                   # Global styles + Tailwind imports
│   │
│   ├── dashboard/
│   │   └── page.tsx                  # Dashboard (/dashboard) — auth required
│   │
│   ├── resources/
│   │   └── page.tsx                  # Resources page (/resources)
│   │
│   ├── about/
│   │   └── page.tsx                  # About & Contact (/about)
│   │
│   └── api/                          # API routes (if needed)
│       └── auth/
│           └── [...nextauth]/
│               └── route.ts          # NextAuth config
│
├── components/                       # Reusable React components
│   ├── Navbar.tsx                    # Sticky nav with auth state
│   ├── Footer.tsx                    # Site footer
│   ├── HeroSection.tsx               # Landing page hero
│   ├── ProblemStats.tsx              # 3 stat cards
│   ├── HowItWorks.tsx                # 3-step cards
│   ├── FeaturesGrid.tsx              # 2×3 feature card grid
│   ├── ResearchSection.tsx           # Science explanation
│   ├── CTABanner.tsx                 # Bottom call-to-action
│   ├── ProgressRing.tsx              # Circular SVG progress ring
│   ├── WeeklyChart.tsx               # Line chart (Recharts)
│   ├── AppBreakdown.tsx              # App usage cards row
│   ├── RehabProgress.tsx             # Progress bar + milestones
│   ├── DeviceList.tsx                # Connected devices table
│   ├── HeatMap.tsx                   # GitHub-style usage grid
│   ├── GuidedSteps.tsx               # Expandable resource cards
│   ├── ArticleGrid.tsx               # Blog post cards
│   ├── FAQ.tsx                       # Accordion FAQ
│   ├── TeamGrid.tsx                  # Team member cards
│   └── ContactForm.tsx               # Name, email, message form
│
├── lib/                              # Utilities & config
│   ├── firebase.ts                   # Firebase client initialization
│   ├── auth.ts                       # NextAuth config / Firebase auth helpers
│   └── api.ts                        # Axios/fetch wrapper for FastAPI calls
│
├── store/                            # Zustand state stores
│   ├── useAuthStore.ts               # User session state
│   └── useDashboardStore.ts          # Dashboard data & filters
│
├── public/                           # Static assets
│   ├── images/                       # Hero mockups, thumbnails
│   └── icons/                        # Favicon, OG images
│
├── package.json                      # Node dependencies
├── tailwind.config.js                # Tailwind configuration
├── tsconfig.json                     # TypeScript config
├── next.config.js                    # Next.js config
├── .env.local                        # Environment variables (gitignored)
└── .gitignore
```

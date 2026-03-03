# Website Directory Structure . Betaal AI

```
web-dashboard/
│
├── app/                              # Next.js App Router
│   ├── layout.jsx                    # Root layout (navbar, footer, providers)
│   ├── page.jsx                      # Landing page (/)
│   ├── globals.css                   # Global styles + Tailwind imports
│   │
│   ├── dashboard/
│   │   └── page.jsx                  # Dashboard (/dashboard) . auth required
│   │
│   ├── resources/
│   │   └── page.jsx                  # Resources page (/resources)
│   │
│   ├── about/
│   │   └── page.jsx                  # About & Contact (/about)
│   │
│   └── api/                          # API routes (if needed)
│       └── auth/
│           └── [...nextauth]/
│               └── route.js          # NextAuth config
│
├── components/                       # Reusable React components
│   ├── Navbar.jsx                    # Sticky nav with auth state
│   ├── Footer.jsx                    # Site footer
│   ├── HeroSection.jsx               # Landing page hero
│   ├── ProblemStats.jsx              # 3 stat cards
│   ├── HowItWorks.jsx                # 3-step cards
│   ├── FeaturesGrid.jsx              # 2×3 feature card grid
│   ├── ResearchSection.jsx           # Science explanation
│   ├── CTABanner.jsx                 # Bottom call-to-action
│   ├── ProgressRing.jsx              # Circular SVG progress ring
│   ├── WeeklyChart.jsx               # Line chart (Recharts)
│   ├── AppBreakdown.jsx              # App usage cards row
│   ├── RehabProgress.jsx             # Progress bar + milestones
│   ├── DeviceList.jsx                # Connected devices table
│   ├── HeatMap.jsx                   # GitHub-style usage grid
│   ├── GuidedSteps.jsx               # Expandable resource cards
│   ├── ArticleGrid.jsx               # Blog post cards
│   ├── FAQ.jsx                       # Accordion FAQ
│   ├── TeamGrid.jsx                  # Team member cards
│   └── ContactForm.jsx               # Name, email, message form
│
├── lib/                              # Utilities & config
│   ├── firebase.js                   # Firebase client initialization
│   ├── auth.js                       # NextAuth config / Firebase auth helpers
│   └── api.js                        # Axios/fetch wrapper for FastAPI calls
│
├── store/                            # Zustand state stores
│   ├── useAuthStore.js               # User session state
│   └── useDashboardStore.js          # Dashboard data & filters
│
├── public/                           # Static assets
│   ├── images/                       # Hero mockups, thumbnails
│   └── icons/                        # Favicon, OG images
│
├── package.json                      # Node dependencies
├── tailwind.config.js                # Tailwind configuration
├── jsconfig.json                     # JS configuration (path aliases)
├── next.config.js                    # Next.js config
├── .env.local                        # Environment variables (gitignored)
└── .gitignore
```

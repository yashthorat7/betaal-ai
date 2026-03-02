# Vibecoding Rules — Betaal AI

## Mindset

This is a **hackathon prototype**. We have ~24 hours. The goal is to **impress judges** with feature density and a polished front-face, not to write production-grade code.

**Showcase > Code Quality. Always.**

---

## Golden Rules

1. **Feature-stack aggressively.** More visible features = higher judge scores. Build wide, not deep. Every feature only needs to work for the demo flow.

2. **No styling in these docs.** These markdown files describe **layout, structure, and functionality only**. All colors, fonts, themes, animations, and CSS aesthetics will be decided and applied at the very end. Do not hardcode any styling decisions during development.

3. **Dummy data over real data.** Pre-seed Firebase with 14 days of synthetic usage data. Charts, graphs, and stats should look real but are fake. The AI chat is the only thing that runs live (Gemini API).

4. **Simulation over training.** The ML model is pre-trained on synthetic data. The math engine uses predefined arrays. Nothing trains in real-time during the demo.

5. **Demo-first development.** Build for the demo script. If a feature isn't in the demo flow, it's lower priority. If it IS in the demo flow, it must look flawless.

6. **No tests needed.** Skip unit tests, integration tests, and CI/CD. If it works on your machine during the demo, it's done.

7. **Skip error handling polish.** Basic try-catch is fine. No need for custom error pages, retry logic, or graceful degradation. If it crashes during development, fix the crash — don't engineer around it.

8. **Keep code concise.** Fewer lines always wins. Refactor aggressively. No boilerplate comments, no long docstrings. Short inline comments only when the logic is genuinely non-obvious.

9. **Update the MDs.** Every time you change code structure, add a feature, or modify an API — update the corresponding `.md` file in `vibecoding/` AND update the `progress.md` in that component's vibecoding subfolder.

10. **Black and white first.** All UI starts as minimal, unstyled, B&W layout. No colors, no fonts, no gradients, no animations. Just structure. Styling is Phase 7 — the very last thing we do.

11. **In-code documentation.** Place a brief `CONTEXT.md` in the actual code directories (not just vibecoding/) so the next AI session understands the codebase instantly without re-reading everything.

---

## Monorepo Structure

This is a **monorepo** with 4 independent components. Each component has its own subdirectory under `vibecoding/` with 3 standard docs:

| Component | Directory     | What It Is                             |
|-----------|---------------|----------------------------------------|
| AI Backend | `ai/`        | Python FastAPI server — the brain      |
| Mobile App | `mobile/`    | Flutter Android app — the main product |
| Website    | `website/`   | Next.js landing page + dashboard       |
| Extension  | `extension/` | Chrome extension — desktop companion   |

Each subdirectory contains:
- `prd.md` — What to build (features, screens, flows)
- `tech_stack.md` — What tools/packages to use
- `directory_structure.md` — Where files go

---

## Per-Component Doc Rules

- Every `prd.md` must include a **Demo Strategy** section explaining what to show judges.
- Every `tech_stack.md` must be a flat table — no essays, no philosophy, just component → technology → why.
- Every `directory_structure.md` must be a clean ASCII tree with one-line comments per file/folder.
- No wrapping content inside ````markdown` code blocks. These are real markdown files — write them as markdown directly.

---

## Development Order (Suggested)

1. **AI Backend** — get API endpoints running first (other components depend on it)
2. **Mobile App** — the hero product, takes the most time
3. **Website** — landing page + dashboard (can be done in parallel)
4. **Extension** — smallest scope, do last

---

## Demo Script Priority

When building, keep this demo flow in mind (this is roughly what we'll show judges):

1. Open the **website** → landing page looks stunning → show dashboard with fake stats
2. Open the **mobile app** → sign in → show onboarding → show home screen with monitoring ring
3. Trigger a **live interruption** → screen blurs → show the rehab concept
4. Open **AI chat** → talk to Betaal → it knows your (fake) stats
5. Show the **extension** → browse YouTube → limit hits → blur overlay appears
6. Point at the **dashboard** → stats from all 3 platforms synced in one place

**If a feature isn't in this flow, it's nice-to-have, not must-have.**

---

## How to Use These Docs (Antigravity)

**⚠️ NEVER @mention the entire `vibecoding/` folder.** That loads ~30 files and wastes tokens.

Instead, @mention only what you need:

| Working On | @mention These |
|-----------|----------------|
| Any component | `rules.md` + that component's folder (e.g., `vibecoding/website/`) |
| API integration | `vibecoding/ai/api_and_data.md` |
| Development plan | `vibecoding/todo/master_todo.md` + the current phase file |
| Resuming work | The component's `progress.md` first |

---

## File Index

| File | What's In It |
|------|-------------|
| `rules.md` | This file — mindset, rules, demo script |
| `prd.md` | Idea + ecosystem PRD + all layouts |
| `tech_stack.md` | Global stack overview + monorepo directory structure |
| `{component}/prd.md` | That component's features, screens, flows |
| `{component}/tech_stack.md` | That component's packages + env vars |
| `{component}/directory_structure.md` | That component's file tree |
| `{component}/progress.md` | What's been done so far |
| `ai/api_and_data.md` | API contracts + seed data JSON |
| `todo/master_todo.md` | 7-phase development checklist |
| `todo/phase_X_*.md` | Detailed steps for each phase |


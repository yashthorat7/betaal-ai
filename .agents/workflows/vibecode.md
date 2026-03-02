---
description: How to start vibecoding any component of the Betaal AI monorepo
---

# Vibecoding a Betaal AI Component

Use this workflow when starting work on any component of the Betaal AI project.

## Step 1: Read the rules first

Read `@vibecoding/rules.md` to understand the hackathon mindset, no-styling policy, and demo priorities.

## Step 2: Pick your component

Each component lives in its own subdirectory under `vibecoding/`:
- `ai/` — Python FastAPI backend
- `mobile/` — Flutter Android app
- `website/` — Next.js website
- `extension/` — Chrome browser extension

## Step 3: Read the 3 component docs

For your chosen component (e.g., `website/`), read these in order:
1. `vibecoding/website/prd.md` — What to build (features, screens, flows)
2. `vibecoding/website/tech_stack.md` — What tools/packages to use
3. `vibecoding/website/directory_structure.md` — Where files go

## Step 4: Read supporting docs

- `vibecoding/seed_data.md` — JSON shapes for dummy data (pre-seed Firebase)
- `vibecoding/ai/api_examples.md` — API request/response contracts (needed for any frontend)
- `vibecoding/env_templates/` — Environment variable templates for your component

## Step 5: Check the todo

Read `vibecoding/todo/master_todo.md` for the big picture, then read the detailed phase file for your current phase:
- Phase 1: `todo/phase_1_mobile_core.md`
- Phase 2: `todo/phase_2_mobile_layout.md`
- Phase 3: `todo/phase_3_website.md`
- Phase 4: `todo/phase_4_extension.md`
- Phase 5: `todo/phase_5_ai_backend.md`
- Phase 6: `todo/phase_6_integration.md`
- Phase 7: `todo/phase_7_styling.md`

## Step 6: Check progress

Read the `progress.md` in the component's vibecoding subfolder (e.g., `vibecoding/mobile/progress.md`) to see what's already been done.

## Step 7: Start building

1. Create the project using the directory structure from step 3
2. Set up environment variables from the env template
3. Build features in **demo script order** (see `rules.md` → Demo Script Priority)
4. Use dummy/hardcoded data first, connect to real APIs later
5. **Skip styling** — get the layout and functionality working first

## Step 8: After every session

1. Update `vibecoding/{component}/progress.md` with what was done
2. Update `vibecoding/todo/master_todo.md` — check off completed items
3. Create/update `CONTEXT.md` in the actual code directory
4. If code structure changed, update the corresponding `directory_structure.md`

## Tips for Antigravity

- When starting a component, @mention the entire vibecoding directory for full context
- For specific questions, @mention just the relevant file (e.g., `@vibecoding/ai/api_examples.md`)
- The `seed_data.md` has copy-paste-ready JSON — use it directly in seed scripts
- The `api_examples.md` has exact request/response shapes — match them exactly in frontend API calls
- Always read `progress.md` first so you don't redo work from a previous session

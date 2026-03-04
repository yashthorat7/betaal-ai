# Removal Plan: Simplify Betaal AI Backend

The current architecture is slightly over-engineered for a hackathon. It uses "industry-ready" patterns like mock classes and fragmented services which add boilerplate. Below is the list of parts to remove or consolidate to make it "backend only, clean, and minimal."

## 1. Remove Excessive Mocking Infrastructure
*   **`firebase/firebase_admin_init.py`**: 
    *   Delete `MockFirestoreClient`, `MockCollection`, and `MockDocument` classes.
    *   Simplify `initialize_firebase()` to only attempt real initialization. If it fails, let it log an error.
*   **`services/chat_service.py`**:
    *   Remove `get_demo_context()` (hardcoded data).
    *   Remove hardcoded Gemini fallback strings. The app should either work with the API key or return a standard error.
*   **`config.py`**: Rename/remove "mock" default values for API keys.

## 2. Consolidate Routers (Reduce Fragmented Boilerplate)
11 routers is too many for a hackathon. Consolidate them into these 4 logical groups:
*   **`core.py`**: (Auth, User, Usage)
*   **`rehab.py`**: (Rehab, Report, Dashboard)
*   **`ai.py`**: (Chat, Youtube, Monitor)
*   **`extension.py`**: Keep separate for the browser extension's unique needs.

## 3. Inline Services into Routers
Currently, every router calls a service. For a clean/minimal backend:
*   Move logic from `services/*.py` directly into the route handlers in `routers/*.py`.
*   Delete the `services/` directory once logic is moved.

---

## 🚀 Prompt to Execute Removal
Copy and paste this prompt to an AI assistant to automatically perform these cleanups:

> "Clean up the Betaal AI backend to make it hackathon-minimal. 
> 1. Remove all `Mock` classes and complex fallback mocking logic in `firebase/firebase_admin_init.py`. 
> 2. Remove hardcoded 'demo context' and hardcoded fallbacks from `services/chat_service.py` unless implemented specifically as a simple Plan B.
> 3. Consolidate the 11 routers in `routers/` into 3-4 main files (Core, Rehab, AI) to reduce boilerplate. 
> 4. Move simple logic from `services/` directly into the corresponding routers and delete the `services/` folder. 
> 5. **Core Philosophy:** No rate limiting or over-engineered 'industry-level' guards. Always try to run real core logic first (e.g. Firebase, Gemini). If the core fails, catch the error gracefully and return the default static data (from `api_and_data.md`) as a **Plan B** so the demo never crashes."

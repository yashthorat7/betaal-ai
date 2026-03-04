# Betaal AI - Backend Context

## Architecture
This is a standard FastAPI backend organized by `routers`, `models`, and `services`.

## Execution Notes Custom to Hackathon
1. **Minimal Hackathon Demo:** We prioritize a fast, working backend. No complex rate limiting or "industry-level" over-engineering is needed.
2. **Core Logic First, Default Data as Plan B:** Endpoints should attempt to execute real logic or fetch from Firebase. However, if the core doesn't work (e.g., connection failure), they should gracefully catch the error and return the default baseline data from `api_and_data.md` as a Plan B to save the demo.
3. **Core Math Services Available:** If needed, real mathematical engines are available inside `services/rehab_service.py` to calculate quotas on the fly.

## To Run
1. `python -m venv venv`
2. `venv\Scripts\activate` (Windows)
3. `pip install -r requirements.txt`
4. `uvicorn main:app --reload`

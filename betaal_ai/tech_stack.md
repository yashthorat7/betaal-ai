# AI Backend Tech Stack — Betaal AI

## Core Framework

| Component | Technology | Version | Why |
|-----------|-----------|---------|-----|
| API Framework | FastAPI | 0.104+ | Async, auto-docs (Swagger), type-safe, fast dev |
| Python Runtime | Python | 3.11+ | ML ecosystem, rapid prototyping |
| ASGI Server | Uvicorn | 0.24+ | Production-grade async server |

## Database & Auth

| Component | Technology | Why |
|-----------|-----------|-----|
| Database | Firebase Firestore | Real-time, no SQL setup, free tier |
| Authentication | Firebase Auth | Google Sign-In, token verify, free |
| Admin SDK | firebase-admin | Server-side Firestore + Auth access |

## Machine Learning

| Component | Technology | Why |
|-----------|-----------|-----|
| ML Framework | scikit-learn | Simple, fast, good for tabular data |
| Model Type | RandomForestRegressor | Handles non-linear patterns |
| Serialisation | joblib / pickle | Save & load trained model |
| Data Generation | numpy + pandas | Synthetic data for training |

## AI Chat & External APIs

| Component | Technology | Why |
|-----------|-----------|-----|
| LLM Provider | Google Gemini API | Free tier, good quality, fast |
| Model | gemini-pro | Text generation with context / Risk Profiler |
| SDK | google-generativeai | Official Python SDK |
| Video Suggestions | YouTube Data API v3 | Feeds personalized videos to dashboard |

## Math Engine (Pure Python + NumPy)

| Component | Implementation | Purpose |
|-----------|---------------|---------|
| Intensity Curves | Sigmoid function | Gradual escalation of disruption |
| Cooldown Calculator | Linear decay | Grace period computation |
| Quota Calculator | Phase-based formula | Daily allowed screen time |
| Rehab Duration | Custom formula | f(addiction, strictness) |
| Interruption Selection | Weighted random | Diverse, non-repeating selection |
| Heat Map Generator | 2D matrix math | Hour × DayOfWeek aggregation |

## API & Validation

| Component | Technology | Why |
|-----------|-----------|-----|
| Data Validation | Pydantic v2 | Type-safe models, auto-validation |
| API Docs | Swagger UI | Auto-generated from FastAPI |
| Serialisation | JSON | Universal format for all consumers |

## Deployment

| Component | Technology | Why |
|-----------|-----------|-----|
| Hosting | Railway / Render | Free tier, easy deploy |
| Environment Vars | .env + python-dotenv | Secure config management |
| CORS | FastAPI CORSMiddleware | Allow cross-origin requests |

---

## Python Dependencies (requirements.txt)

```txt
# Core
fastapi==0.104.1
uvicorn==0.24.0
pydantic==2.5.0
python-dotenv==1.0.0

# Firebase
firebase-admin==6.2.0

# Machine Learning
scikit-learn==1.3.2
numpy==1.26.2
pandas==2.1.4
joblib==1.3.2

# AI Chat
google-generativeai==0.3.1

# HTTP Client
httpx==0.25.2

# Utilities
python-dateutil==2.8.2
```

---

## Environment Variables (.env)

```
FIREBASE_CREDENTIALS_PATH=./firebase/service_account_key.json
GEMINI_API_KEY=your_gemini_api_key_here
CORS_ORIGINS=http://localhost:3000,http://localhost:8080
PORT=8000
```

# AI Backend Directory Structure — Betaal AI

```
ai-backend/
│
├── main.py                        # FastAPI entry point
├── config.py                      # Env vars, Firebase init, constants
├── requirements.txt               # Python dependencies
├── .env.example                   # Environment variable template
├── .gitignore
├── README.md
│
├── routers/                       # API route handlers
│   ├── __init__.py
│   ├── auth.py                    # POST /auth/verify
│   ├── user.py                    # GET/PUT /user/profile
│   ├── rehab.py                   # GET /rehab/plan, POST /rehab/recalculate
│   ├── interruption.py            # POST /interruption/schedule
│   ├── usage.py                   # POST /usage/log, GET /usage/stats
│   ├── predict.py                 # GET /predict/today
│   ├── chat.py                    # POST /chat
│   ├── report.py                  # GET /report/daily, GET /report/weekly
│   ├── extension.py               # POST /extension/heartbeat
│   └── monitor.py                 # GET /monitor/{child_id}/stats
│
├── models/                        # Pydantic request/response schemas
│   ├── __init__.py
│   ├── user_models.py             # UserProfile, UserCreate, UserUpdate
│   ├── rehab_models.py            # RehabPlan, RehabPhase, RehabRecalcRequest
│   ├── interruption_models.py     # InterruptionItem, InterruptionArray, SessionData
│   ├── usage_models.py            # UsageEvent, UsageStats, HeatMapData
│   ├── predict_models.py          # PredictionRequest, PredictionResponse
│   ├── chat_models.py             # ChatMessage, ChatResponse, ChatContext
│   ├── report_models.py           # DailyReport, WeeklyReport
│   └── extension_models.py        # HeartbeatRequest, HeartbeatResponse
│
├── services/                      # Core business logic
│   ├── __init__.py
│   ├── auth_service.py            # Firebase token verification
│   ├── user_service.py            # CRUD on user profiles
│   ├── rehab_service.py           # Rehab plan creation & recalculation
│   ├── interruption_service.py    # Math engine for scheduling interruptions
│   ├── usage_service.py           # Aggregation, heat maps, streaks
│   ├── predict_service.py         # ML model loading, inference
│   ├── chat_service.py            # Gemini API integration, context building
│   ├── report_service.py          # Report assembly from analytics
│   ├── extension_service.py       # Browser time tracking + threshold logic
│   └── monitor_service.py         # Parent-child linking & data fetch
│
├── engine/                        # Math & ML core
│   ├── __init__.py
│   ├── interruption_math.py       # Weighted random selection, intensity curves
│   ├── cooldown_calculator.py     # Cooldown period computation
│   ├── quota_calculator.py        # Daily quota from rehab plan + phase
│   ├── rehab_formula.py           # Duration formula: f(addiction, strictness)
│   └── curve_functions.py         # Sigmoid, linear ramp, exponential decay
│
├── ml/                            # Machine learning
│   ├── __init__.py
│   ├── train.py                   # Train model on dummy data
│   ├── inference.py               # Load model, predict
│   ├── dummy_data_generator.py    # Generate synthetic training data
│   ├── feature_engineering.py     # Feature extraction from raw usage
│   └── saved_models/
│       └── screen_time_model.pkl  # Serialised trained model
│
├── data/                          # Seed & dummy data
│   ├── seed_users.json            # Pre-built demo user profiles
│   ├── seed_usage.json            # 14 days of fake usage data
│   ├── interruption_types.json    # 20 interruption definitions
│   └── rehab_templates.json       # Phase templates for different strictness
│
├── firebase/                      # Firebase helpers
│   ├── __init__.py
│   ├── firebase_admin_init.py     # Initialise Firebase Admin SDK
│   ├── firestore_client.py        # Read/write to Firestore
│   └── service_account_key.json   # (gitignored) Firebase credentials
│
├── middleware/                    # FastAPI middleware
│   ├── __init__.py
│   ├── cors.py                    # CORS configuration
│   └── auth_middleware.py         # Token extraction & verification
│
├── utils/                         # Shared utilities
│   ├── __init__.py
│   ├── time_utils.py              # Time zone handling, epoch conversions
│   ├── math_utils.py              # Common math helpers
│   └── response_helpers.py        # Standard API response wrappers
│
└── scripts/                       # One-off scripts
    ├── seed_database.py           # Populate Firestore with dummy data
    ├── train_model.py             # Wrapper to train & save ML model
    └── generate_demo_data.py      # Create realistic 14-day demo dataset
```

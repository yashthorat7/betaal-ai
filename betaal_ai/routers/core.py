from fastapi import APIRouter
from models.user_models import (
    VerifyRequest, AuthResponse, LoginRequest, LoginResponse, LogoutRequest, LogoutResponse,
    UserProfile, UserUpdate, UserUpdateResponse, MonitorListResponse, UserStatsResponse, 
    UserLinkRequest, GenericResponse as UserGenericResponse
)
from models.usage_models import (
    UsageLogRequest, UsageStatsResponse, HeatMapResponse, UsageSummaryResponse, 
    GenericResponse as UsageGenericResponse
)
from models.extension_models import DashboardResponse, FeaturesResponse
from firebase import firebase_admin_init

router = APIRouter(tags=["Core (Auth, User, Usage)"])

# ====== AUTH ROUTES ====== #
@router.post("/auth/verify", response_model=AuthResponse)
async def verify_token(request: VerifyRequest):
    return AuthResponse(uid="demo_user_001", email="Yash.demo@gmail.com", session_token="sess_abc123")

@router.post("/auth/login", response_model=LoginResponse)
async def login(request: LoginRequest):
    name = None
    if request.email in ["yshthrt@gmail.com", "thoraty10@gmail.com"]:
        name = "Yash"
    
    return LoginResponse(
        uid=request.uid, 
        session_token="sess_abc123", 
        message="Login successful",
        name=name
    )

@router.post("/auth/logout", response_model=LogoutResponse)
async def logout(request: LogoutRequest):
    return LogoutResponse(status="success", message="Logged out")

# ====== USER ROUTES ====== #
@router.get("/user/profile", response_model=UserProfile)
async def get_profile(uid: str):
    # Try real DB if available
    if firebase_admin_init.db:
        try:
            doc = firebase_admin_init.db.collection("users").document(uid).get()
            if doc.exists:
                return UserProfile(**doc.to_dict())
        except Exception:
            pass # Fallback to Plan B
    
    return UserProfile(
        uid=uid, name="Yash", age=19, email="Yash.demo@gmail.com",
        addiction_level=8, strictness=3, linked_parent_id="demo_parent_001"
    )

@router.put("/user/profile", response_model=UserUpdateResponse)
async def update_profile(request: UserUpdate):
    if firebase_admin_init.db:
        try:
            data = request.dict(exclude_unset=True)
            firebase_admin_init.db.collection("users").document(request.uid).set(data, merge=True)
        except Exception:
            pass # Fallback to Plan B
            
    return UserUpdateResponse(status="updated", uid=request.uid)

@router.get("/user/list", response_model=MonitorListResponse)
async def list_linked_users(uid: str):
    return MonitorListResponse(monitoring=[{"uid": "demo_user_001", "name": "Yash", "relation": "child", "status": "active"}])

@router.get("/user/{user_id}/stats", response_model=UserStatsResponse)
async def get_user_stats(user_id: str):
    return UserStatsResponse(uid=user_id, today_min=185, quota_min=273, top_app="Instagram", streak_days=3, addiction_level=7, rehab_phase=2)

@router.post("/user/link", response_model=UserGenericResponse)
async def link_user(request: UserLinkRequest):
    return UserGenericResponse(status="success", message=f"Successfully linked account.")

# ====== USAGE ROUTES ====== #
@router.post("/usage/log", response_model=UsageGenericResponse)
async def log_usage(request: UsageLogRequest):
    return UsageGenericResponse(status="logged", message=f"Logged {len(request.events)} events.")

@router.get("/usage/stats", response_model=UsageStatsResponse)
async def get_stats(uid: str):
    return {
      "today": { "total_min": 185, "unlocks": 25, "top_app": "Instagram", "under_quota": True },
      "week_avg_min": 241, "streak_days": 3,
      "top_apps": [
        { "app_name": "Instagram", "minutes": 52 }, { "app_name": "YouTube",   "minutes": 45 },
        { "app_name": "WhatsApp",  "minutes": 38 }, { "app_name": "BGMI",      "minutes": 28 },
        { "app_name": "Chrome",    "minutes": 22 }
      ]
    }

@router.get("/usage/heatmap", response_model=HeatMapResponse)
async def get_heatmap(uid: str):
    return {
      "matrix": [[5, 3, 8, 12, 15, 10, 6], [4, 2, 7, 14, 18, 12, 5], [3, 1, 6, 10, 12, 8, 4]],
      "labels_x": ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"], "labels_y": ["Morning", "Afternoon", "Evening"],
      "unit": "minutes"
    }

@router.get("/usage/summary", response_model=UsageSummaryResponse)
async def get_summary(uid: str):
    return {
      "total_screen_time_today": 185, "daily_average_week": 241, "total_unlocks": 25,
      "status": "under_quota", "recommendation": "Trending down! Keep maintaining focus."
    }

# ====== DASHBOARD & FEATURES ====== #
@router.get("/dashboard", response_model=DashboardResponse)
async def get_dashboard(uid: str):
    return {
      "user_stats": { "today_min": 185, "limit_min": 273, "top_app": "Instagram" },
      "extension_stats": { "browser_min": 63, "limit_min": 120 },
      "linked_profiles": [
        { "name": "Child Profile", "today_min": 225, "limit_min": 300 }
      ]
    }

@router.get("/features", response_model=FeaturesResponse)
async def get_features():
    return {
      "active_features": [
        { "name": "AI Chat", "status": "enabled", "version": "1.0" },
        { "name": "YouTube Recommendations", "status": "enabled", "version": "1.0" },
        { "name": "Parental Monitoring", "status": "enabled", "version": "1.1" }
      ]
    }

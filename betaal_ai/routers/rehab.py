from fastapi import APIRouter
from models.rehab_models import RehabPlan, RehabRecalcRequest, RehabRecalcResponse
from models.usage_models import DailyReportResponse, WeeklyReportResponse
from models.extension_models import DashboardResponse, FeaturesResponse
import math

router = APIRouter(tags=["Rehab, Report, Dashboard"])

# ====== INLINED SERVICES ====== #
def calculate_duration(addiction_level: int, strictness: int) -> int:
    duration = addiction_level * 3 * (6 - strictness)
    return max(7, min(90, duration))

def calculate_phase_quotas(avg_daily: int):
    return { 1: int(avg_daily * 0.9), 2: int(avg_daily * 0.65), 3: int(avg_daily * 0.4), 4: int(avg_daily * 0.2) }

def generate_plan(uid: str, addiction_level: int, strictness: int, avg_daily_usage: int = 420):
    duration = calculate_duration(addiction_level, strictness)
    p1_days = max(1, int(duration * 0.2))
    p2_days = max(1, int(duration * 0.3))
    p3_days = max(1, int(duration * 0.3))
    p4_days = duration - p1_days - p2_days - p3_days # Remainder
    quotas = calculate_phase_quotas(avg_daily_usage)
    phases = [
        {"phase": 1, "name": "Awareness",  "start_day": 1, "end_day": p1_days, "daily_quota_min": quotas[1], "intensity": 0.2},
        {"phase": 2, "name": "Reduction",  "start_day": p1_days + 1, "end_day": p1_days + p2_days, "daily_quota_min": quotas[2], "intensity": 0.5},
        {"phase": 3, "name": "Discipline", "start_day": p1_days + p2_days + 1, "end_day": p1_days + p2_days + p3_days, "daily_quota_min": quotas[3], "intensity": 0.8},
        {"phase": 4, "name": "Freedom",    "start_day": p1_days + p2_days + p3_days + 1, "end_day": duration, "daily_quota_min": quotas[4], "intensity": 0.5}
    ]
    return {
        "uid": uid, "duration_days": duration, "current_day": 1, "current_phase": 1,
        "phase_name": "Awareness", "daily_quota_min": quotas[1], "intensity": 0.2, "phases": phases
    }

# ====== REHAB ROUTES ====== #
@router.get("/rehab/plan", response_model=RehabPlan)
async def get_plan(uid: str):
    return {
      "uid": uid, "duration_days": 24, "current_day": 8, "current_phase": 2, "phase_name": "Reduction",
      "daily_quota_min": 273, "intensity": 0.5,
      "phases": [
        { "phase": 1, "name": "Awareness",  "start_day": 1,  "end_day": 5,  "daily_quota_min": 378, "intensity": 0.2 },
        { "phase": 2, "name": "Reduction",  "start_day": 6,  "end_day": 12, "daily_quota_min": 273, "intensity": 0.5 },
        { "phase": 3, "name": "Discipline", "start_day": 13, "end_day": 19, "daily_quota_min": 168, "intensity": 0.8 },
        { "phase": 4, "name": "Freedom",    "start_day": 20, "end_day": 24, "daily_quota_min": 84,  "intensity": 0.5 }
      ]
    }

@router.post("/rehab/recalculate", response_model=RehabRecalcResponse)
async def recalculate_plan(request: RehabRecalcRequest):
    plan = generate_plan(request.uid, request.addiction_level, request.strictness)
    return RehabRecalcResponse(
        uid=request.uid, new_duration_days=plan['duration_days'],
        new_daily_quota_min=plan['phases'][0]['daily_quota_min'],
        message=f"Plan recalculated. New duration: {plan['duration_days']} days."
    )

# ====== REPORT ROUTES ====== #
@router.get("/report/daily", response_model=DailyReportResponse)
async def get_daily_report(uid: str):
    return {
      "date": "2025-01-14", "total_min": 185, "limit_min": 273, "under_quota": True,
      "unlocks": 25, "top_app": "Instagram", "vs_yesterday": -15, "interruptions_triggered": 6
    }

@router.get("/report/weekly", response_model=WeeklyReportResponse)
async def get_weekly_report(uid: str):
    return {
      "week_start": "2025-01-08", "week_end": "2025-01-14", "daily_totals": [285, 260, 240, 255, 220, 200, 185],
      "avg_min": 235, "streak": 3, "phase": 2, "phase_name": "Reduction", "progress_pct": 33
    }

# ====== DASHBOARD ROUTES ====== #
@router.get("/dashboard", response_model=DashboardResponse)
async def get_dashboard(uid: str):
    return {
      "user_stats": { "today_min": 185, "limit_min": 273, "top_app": "Instagram" },
      "extension_stats": { "browser_min": 63, "limit_min": 120 },
      "linked_profiles": [ { "name": "Child Profile", "today_min": 225, "limit_min": 300 } ]
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

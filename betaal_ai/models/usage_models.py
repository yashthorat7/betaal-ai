from pydantic import BaseModel
from typing import List

class UsageEvent(BaseModel):
    app_name: str
    category: str
    start: str
    end: str

class UsageLogRequest(BaseModel):
    uid: str
    events: List[UsageEvent]

class AppUsageTotal(BaseModel):
    app_name: str
    minutes: int

class UsageStatsToday(BaseModel):
    total_min: int
    unlocks: int
    top_app: str
    under_quota: bool

class UsageStatsResponse(BaseModel):
    today: UsageStatsToday
    week_avg_min: int
    streak_days: int
    top_apps: List[AppUsageTotal]

class HeatMapResponse(BaseModel):
    matrix: List[List[int]]
    labels_x: List[str]
    labels_y: List[str]
    unit: str

class UsageSummaryResponse(BaseModel):
    total_screen_time_today: int
    daily_average_week: int
    total_unlocks: int
    status: str
    recommendation: str

class DailyReportResponse(BaseModel):
    date: str
    total_min: int
    limit_min: int
    under_quota: bool
    unlocks: int
    top_app: str
    vs_yesterday: int
    interruptions_triggered: int

class WeeklyReportResponse(BaseModel):
    week_start: str
    week_end: str
    daily_totals: List[int]
    avg_min: int
    streak: int
    phase: int
    phase_name: str
    progress_pct: int

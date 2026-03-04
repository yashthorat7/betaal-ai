from pydantic import BaseModel
from typing import List

class RehabPhase(BaseModel):
    phase: int
    name: str
    start_day: int
    end_day: int
    daily_quota_min: int
    intensity: float

class RehabPlan(BaseModel):
    uid: str
    duration_days: int
    current_day: int
    current_phase: int
    phase_name: str
    daily_quota_min: int
    intensity: float
    phases: List[RehabPhase]

class RehabRecalcRequest(BaseModel):
    uid: str
    addiction_level: int
    strictness: int

class RehabRecalcResponse(BaseModel):
    uid: str
    new_duration_days: int
    new_daily_quota_min: int
    message: str

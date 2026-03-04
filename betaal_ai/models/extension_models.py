from pydantic import BaseModel
from typing import List, Optional

class DomainUsage(BaseModel):
    domain: str
    seconds: int

class HeartbeatRequest(BaseModel):
    uid: str
    today_browser_sec: int
    domains: List[DomainUsage]

class HeartbeatResponse(BaseModel):
    should_blur: bool
    time_left_sec: int
    message: str
    daily_limit_sec: int

class CooldownRequest(BaseModel):
    uid: str
    daily_limit_sec: int
    num_effects: int

class CooldownResponse(BaseModel):
    interruptions: List[List[int]]

class MonitorStatsResponse(BaseModel):
    child_name: str
    today_min: int
    quota_min: int
    under_quota: bool
    rehab_day: int
    rehab_total_days: int
    phase: str
    streak: int
    weekly_trend: List[int]

class MonitorStrictnessUpdate(BaseModel):
    parent_uid: str
    new_strictness: int

class MonitorStrictnessResponse(BaseModel):
    status: str
    new_strictness: int
    new_duration_days: int

class UserStatsSummary(BaseModel):
    today_min: int
    limit_min: int
    top_app: str

class ExtensionStatsSummary(BaseModel):
    browser_min: int
    limit_min: int

class LinkedProfileSummary(BaseModel):
    name: str
    today_min: int
    limit_min: int

class DashboardResponse(BaseModel):
    user_stats: UserStatsSummary
    extension_stats: ExtensionStatsSummary
    linked_profiles: List[LinkedProfileSummary]

class FeatureStatus(BaseModel):
    name: str
    status: str
    version: str

class FeaturesResponse(BaseModel):
    active_features: List[FeatureStatus]

class VideoResult(BaseModel):
    id: str
    title: str
    thumbnail: str
    url: str

class YoutubeRecommendRequest(BaseModel):
    uid: str
    prompt: Optional[str] = None
    topics: List[str]
    keywords: List[str]

class YoutubeRecommendResponse(BaseModel):
    videos: List[VideoResult]

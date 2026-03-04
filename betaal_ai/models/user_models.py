from pydantic import BaseModel
from typing import Optional, List

# --- AUTH MODELS ---
class VerifyRequest(BaseModel):
    id_token: str

class AuthResponse(BaseModel):
    uid: str
    email: str
    session_token: str

class LoginRequest(BaseModel):
    email: str
    uid: str

class LoginResponse(BaseModel):
    uid: str
    session_token: str
    message: str
    name: Optional[str] = None

class LogoutRequest(BaseModel):
    uid: str
    session_token: str

class LogoutResponse(BaseModel):
    status: str
    message: str


# --- USER MODELS ---
class UserProfile(BaseModel):
    uid: str
    name: str
    age: int
    email: Optional[str] = None
    addiction_level: int
    strictness: int
    stealth_icon: str = "default"
    linked_parent_id: Optional[str] = None
    
class UserUpdate(BaseModel):
    uid: str
    name: str
    age: int
    addiction_level: int
    strictness: int

class UserUpdateResponse(BaseModel):
    status: str
    uid: str

class MonitorUser(BaseModel):
    uid: str
    name: str
    relation: str
    status: str

class MonitorListResponse(BaseModel):
    monitoring: List[MonitorUser]

class UserStatsResponse(BaseModel):
    uid: str
    today_min: int
    quota_min: int
    top_app: str
    streak_days: int
    addiction_level: int
    rehab_phase: int

class UserLinkRequest(BaseModel):
    parent_uid: str
    child_uid: str
    relation: str
    link_code: str

class GenericResponse(BaseModel):
    status: str
    message: str

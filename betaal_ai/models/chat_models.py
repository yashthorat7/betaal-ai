from pydantic import BaseModel
from typing import List, Optional
from models.extension_models import VideoResult

class ChatMessage(BaseModel):
    uid: str
    message: str
    session_id: str

class ChatResponse(BaseModel):
    response: str
    session_id: str
    videos: List[VideoResult] = []

class EvaluateRequest(BaseModel):
    uid: str

class EvaluateResponse(BaseModel):
    classification: str
    score: int
    details: str
    suggested_actions: List[str]

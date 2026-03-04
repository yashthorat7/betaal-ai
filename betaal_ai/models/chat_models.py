from pydantic import BaseModel
from typing import List, Optional

class ChatMessage(BaseModel):
    uid: str
    message: str
    session_id: str
    user_name: str = "User"

class ChatResponse(BaseModel):
    response: str
    session_id: str

class EvaluateRequest(BaseModel):
    uid: str

class EvaluateResponse(BaseModel):
    classification: str
    score: int
    details: str
    suggested_actions: List[str]

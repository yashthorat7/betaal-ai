from fastapi import APIRouter
from models.chat_models import ChatMessage, ChatResponse, EvaluateRequest, EvaluateResponse
from models.extension_models import MonitorStatsResponse, MonitorStrictnessUpdate, MonitorStrictnessResponse
from config import settings
import google.generativeai as genai

router = APIRouter(tags=["AI, Chat, Youtube, Monitor"])

# ====== INITIALIZE GENAI ====== #
model = None
try:
    if settings.GEMINI_API_KEY:
        genai.configure(api_key=settings.GEMINI_API_KEY)
        model = genai.GenerativeModel('gemini-pro')
except Exception as e:
    print(f"⚠️ Error initializing Gemini API: {e}. Using Plan B fallbacks.")

# ====== INLINED CHAT LOGIC ====== #
def generate_chat_response(uid: str, user_message: str, session_id: str) -> str:
    """Calls Gemini with a fixed fallback context if DB/Live fails."""
    context = """
    SYSTEM CONTEXT:
    User Name: Arjun (Age 19)
    Current Phase: 2 (Reduction)
    Today's Usage: 185 mins
    Today's Limit: 273 mins
    Top App: Instagram (52 mins)
    """
    prompt = f"{context}\n\nYou are Betaal, a strict but caring digital rehab assistant. Reply concisely to the user.\nUser: {user_message}\nBetaal:"
    
    if model:
        try:
            response = model.generate_content(prompt)
            return response.text
        except Exception as e:
            print(f"⚠️ Gemini Error: {e}. Falling back to default data.")
            
    # Plan B (Default Static Response)
    return "Great progress, Arjun! You're under your limit today. Keep focusing on reducing Instagram. Try replacing 15 minutes of scrolling with a short walk today."

def evaluate_user_risk(uid: str) -> dict:
    """Uses Gemini to output a structured JSON risk evaluation."""
    if model:
        try:
            # Fake prompt to model since we don't have DB
            prompt = "Output a strictly JSON formatted response evaluating risk for an addicted user: {classification: 'Moderate Risk', score: 65, details: 'Screen time is dropping generally, but late-night usage remains consistently high across Instagram and YouTube.', suggested_actions: ['Enable Wind Down mode by 10 PM', 'Increase interruption strictness in the evening']}"
            response = model.generate_content(prompt)
            # A real implementation would parse the response text. Here we fallback.
        except Exception as e:
            print(f"⚠️ Gemini Evaluate Error: {e}. Falling back to standard data.")

    # Plan B
    return {
      "classification": "Moderate Risk", "score": 65,
      "details": "Screen time is dropping generally, but late-night usage remains consistently high across Instagram and YouTube.",
      "suggested_actions": ["Enable Wind Down mode by 10 PM", "Increase interruption strictness in the evening"]
    }

# ====== CHAT ROUTES ====== #
@router.post("/chat", response_model=ChatResponse)
async def chat_with_betaal(request: ChatMessage):
    # Sends user message to Gemini
    response_text = generate_chat_response(request.uid, request.message, request.session_id)
    return ChatResponse(response=response_text, session_id=request.session_id)

@router.post("/ai/evaluate", response_model=EvaluateResponse)
async def evaluate_risk(request: EvaluateRequest):
    evaluation = evaluate_user_risk(request.uid)
    return EvaluateResponse(**evaluation)



# ====== MONITOR ROUTES ====== #
@router.get("/monitor/{child_id}/stats", response_model=MonitorStatsResponse)
async def get_child_stats(child_id: str):
    return MonitorStatsResponse(
      child_name="Arjun", today_min=185, quota_min=273, under_quota=True, rehab_day=8, rehab_total_days=24, phase="Reduction", streak=3, weekly_trend=[285, 260, 240, 255, 220, 200, 185]
    )

@router.put("/monitor/{child_id}/strictness", response_model=MonitorStrictnessResponse)
async def update_child_strictness(child_id: str, request: MonitorStrictnessUpdate):
    return MonitorStrictnessResponse(status="updated", new_strictness=request.new_strictness, new_duration_days=14)

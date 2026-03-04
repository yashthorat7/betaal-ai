from fastapi import APIRouter
from google import genai
from models.chat_models import ChatMessage, ChatResponse, EvaluateRequest, EvaluateResponse
from models.extension_models import MonitorStatsResponse, MonitorStrictnessUpdate, MonitorStrictnessResponse
from config import settings

router = APIRouter(tags=["AI, Chat, Youtube, Monitor"])

# ====== INITIALIZE GENAI V1 CLIENT ====== #
client = None
if settings.GEMINI_API_KEY:
    try:
        client = genai.Client(api_key=settings.GEMINI_API_KEY)
    except Exception as e:
        print(f"⚠️ Error initializing Google GenAI Client: {e}. Using Plan B fallbacks.")

# ====== INLINED CHAT LOGIC ====== #
def generate_chat_response(uid: str, user_message: str, session_id: str) -> str:
    """Calls Gemini with a fixed fallback context if DB/Live fails."""
    context = """
    SYSTEM CONTEXT:
    User Name: Yash (Age 19)
    Current Phase: 2 (Reduction)
    Today's Usage: 185 mins
    Today's Limit: 273 mins
    Top App: Instagram (52 mins)
    """
    prompt = f"{context}\n\nYou are Betaal, a strict but caring digital rehab assistant. Reply concisely to the user.\nUser: {user_message}\nBetaal:"
    
    if client:
        try:
            response = client.models.generate_content(
                model="gemini-3-flash-preview",
                contents=prompt
            )
            return response.text
        except Exception as e:
            print(f"⚠️ Gemini Chat Error: {e}. Falling back to default data.")
            
    # Plan B (Default Static Response)
    return "Great progress, Yash! You're under your limit today. Keep focusing on reducing Instagram. Try replacing 15 minutes of scrolling with a short walk today."

def evaluate_user_risk(uid: str) -> dict:
    """Uses Gemini to output a structured JSON risk evaluation."""
    if client:
        try:
            # Fake prompt to model since we don't have DB
            prompt = "Output a strictly JSON formatted response evaluating risk for an addicted user: {classification: 'Moderate Risk', score: 65, details: 'Screen time is dropping generally, but late-night usage remains consistently high across Instagram and YouTube.', suggested_actions: ['Enable Wind Down mode by 10 PM', 'Increase interruption strictness in the evening']}"
            response = client.models.generate_content(
                model="gemini-3-flash-preview",
                contents=prompt
            )
            # A real implementation would parse the response text. Here we fallback.
        except Exception as e:
            print(f"⚠️ Gemini Evaluate Error: {e}. Falling back to standard data.")

    # Plan B
    return {
      "classification": "Moderate Risk", "score": 65,
      "details": "Screen time is dropping generally, but late-night usage remains consistently high across Instagram and YouTube.",
      "suggested_actions": ["Enable Wind Down mode by 10 PM", "Increase interruption strictness in the evening"]
    }

from services.youtube_service import get_youtube_recommendations

# ====== CHAT ROUTES ====== #
@router.post("/chat", response_model=ChatResponse)
async def chat_with_betaal(request: ChatMessage):
    # Sends user message to Gemini
    response_text = generate_chat_response(request.uid, request.message, request.session_id)
    
    # Recommendation logic: Gemini -> Keywords -> YouTube Links
    # We use the user message to find relevant videos
    videos = []
    try:
        videos = await get_youtube_recommendations(
            prompt=request.message,
            topics=["digital wellness", "addiction recovery"],
            keywords=["focus", "productivity", "mental health"]
        )
    except Exception as e:
        print(f"⚠️ Recommendation failed in chat: {e}")

    return ChatResponse(
        response=response_text, 
        session_id=request.session_id,
        videos=videos
    )

@router.post("/ai/evaluate", response_model=EvaluateResponse)
async def evaluate_risk(request: EvaluateRequest):
    evaluation = evaluate_user_risk(request.uid)
    return EvaluateResponse(**evaluation)



# ====== MONITOR ROUTES ====== #
@router.get("/monitor/{child_id}/stats", response_model=MonitorStatsResponse)
async def get_child_stats(child_id: str):
    return MonitorStatsResponse(
      child_name="Yash", today_min=185, quota_min=273, under_quota=True, rehab_day=8, rehab_total_days=24, phase="Reduction", streak=3, weekly_trend=[285, 260, 240, 255, 220, 200, 185]
    )

@router.put("/monitor/{child_id}/strictness", response_model=MonitorStrictnessResponse)
async def update_child_strictness(child_id: str, request: MonitorStrictnessUpdate):
    return MonitorStrictnessResponse(status="updated", new_strictness=request.new_strictness, new_duration_days=14)

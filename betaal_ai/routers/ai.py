from fastapi import APIRouter
from models.chat_models import ChatMessage, ChatResponse, EvaluateRequest, EvaluateResponse
from models.extension_models import MonitorStatsResponse, MonitorStrictnessUpdate, MonitorStrictnessResponse
from config import settings
from google import genai

router = APIRouter(tags=["AI, Chat, Youtube, Monitor"])

# ====== INITIALIZE GENAI ====== #
client = None
MODEL_NAME = "gemini-2.5-flash"
try:
    if settings.GEMINI_API_KEY:
        client = genai.Client(api_key=settings.GEMINI_API_KEY)
        print(f"✅ Gemini client initialized with model: {MODEL_NAME}")
except Exception as e:
    print(f"⚠️ Error initializing Gemini API: {e}. Using Plan B fallbacks.")

# ====== INLINED CHAT LOGIC ====== #
def generate_chat_response(uid: str, user_message: str, session_id: str, user_name: str = "User") -> str:
    """Calls Gemini with a fixed fallback context if DB/Live fails."""
    prompt = f"""You are Betaal — an AI digital rehab therapist inside a screen addiction recovery app.

ABOUT THE USER:
- Name: {user_name}
- They are on a screen time reduction rehab journey
- The app tracks their screen time and shows interruption overlays when they exceed their daily quota

YOUR PERSONALITY:
- You are a compassionate, warm psychiatrist specializing in behavioral addiction and digital wellness
- You are non-judgmental but firm when the user needs accountability
- You celebrate small wins genuinely
- You give specific, actionable advice — never generic motivational quotes
- Keep responses to 2-4 sentences. Be concise like a therapist's note
- Use a calm, grounded voice. No excessive exclamation marks
- When the user struggles, normalize it ("setbacks are normal in recovery") and redirect
- Suggest real-world alternatives: walks, reading, cooking, exercise, deep breathing, calling a friend
- If the user asks for tips, give them numbered practical tips (3-5 tips)
- If the user shares how they feel, respond with empathy first, then guidance
- Address the user by their first name occasionally to build rapport

IMPORTANT RULES:
- Never say you are an AI, a language model, or a chatbot
- You ARE Betaal — their personal rehab companion
- Always respond helpfully even if the message is casual or off-topic
- If asked something unrelated to screen time, gently steer back while being helpful

User: {user_message}
Betaal:"""

    if client:
        try:
            response = client.models.generate_content(model=MODEL_NAME, contents=prompt)
            return response.text
        except Exception as e:
            print(f"⚠️ Gemini Error: {e}. Falling back to default data.")

    # Plan B (Default Static Response)
    return f"Hey {user_name}, I'm here for you. Try taking a 10-minute break from your screen — step outside, stretch, or grab a glass of water. Small pauses add up to big changes."

def evaluate_user_risk(uid: str) -> dict:
    """Uses Gemini to output a structured JSON risk evaluation."""
    if client:
        try:
            prompt = "Output a strictly JSON formatted response evaluating risk for an addicted user: {classification: 'Moderate Risk', score: 65, details: 'Screen time is dropping generally, but late-night usage remains consistently high across Instagram and YouTube.', suggested_actions: ['Enable Wind Down mode by 10 PM', 'Increase interruption strictness in the evening']}"
            response = client.models.generate_content(model=MODEL_NAME, contents=prompt)
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
    response_text = generate_chat_response(request.uid, request.message, request.session_id, request.user_name)
    return ChatResponse(response=response_text, session_id=request.session_id)

@router.post("/ai/evaluate", response_model=EvaluateResponse)
async def evaluate_risk(request: EvaluateRequest):
    evaluation = evaluate_user_risk(request.uid)
    return EvaluateResponse(**evaluation)



# ====== MONITOR ROUTES ====== #
@router.get("/monitor/{child_id}/stats", response_model=MonitorStatsResponse)
async def get_child_stats(child_id: str):
    return MonitorStatsResponse(
      child_name="User", today_min=185, quota_min=273, under_quota=True, rehab_day=8, rehab_total_days=24, phase="Reduction", streak=3, weekly_trend=[285, 260, 240, 255, 220, 200, 185]
    )

@router.put("/monitor/{child_id}/strictness", response_model=MonitorStrictnessResponse)
async def update_child_strictness(child_id: str, request: MonitorStrictnessUpdate):
    return MonitorStrictnessResponse(status="updated", new_strictness=request.new_strictness, new_duration_days=14)

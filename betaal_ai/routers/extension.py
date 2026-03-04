from fastapi import APIRouter
import random
from models.extension_models import HeartbeatRequest, HeartbeatResponse, CooldownRequest, CooldownResponse

router = APIRouter(prefix="/extension", tags=["Browser Extension Sync"])

@router.post("/heartbeat", response_model=HeartbeatResponse)
async def extension_heartbeat(request: HeartbeatRequest):
    # Receives time (seconds) from Chrome extension. MOCKED FOR DEMO
    daily_limit_sec = 120 * 60 # 120 minutes in seconds
    time_left_sec = daily_limit_sec - request.today_browser_sec
    
    return HeartbeatResponse(
        should_blur=False,
        time_left_sec=max(0, time_left_sec),
        message=f"You have {max(0, time_left_sec // 60)}m of browsing left today.",
        daily_limit_sec=daily_limit_sec
    )

@router.post("/cooldown", response_model=CooldownResponse)
async def extension_cooldown(request: CooldownRequest):
    """
    Returns a 2D array of interruptions to be applied over a cooldown period.
    Each element is [interval_seconds, interruption_type]
    interval_seconds: 10-15
    interruption_type: 1 to num_effects
    """
    # Generate approx 50-60 items to cover roughly 10 minutes
    interruptions = []
    for _ in range(60):
        interval = random.randint(10, 15)
        effect_type = random.randint(1, request.num_effects)
        interruptions.append([interval, effect_type])
    
    return CooldownResponse(interruptions=interruptions)

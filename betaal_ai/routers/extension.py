from fastapi import APIRouter
from models.extension_models import HeartbeatRequest, HeartbeatResponse

router = APIRouter(prefix="/extension", tags=["Browser Extension Sync"])

@router.post("/heartbeat", response_model=HeartbeatResponse)
async def extension_heartbeat(request: HeartbeatRequest):
    # Receives time from Chrome extension. MOCKED FOR DEMO
    return HeartbeatResponse(
        should_blur=False,
        time_left_min=88,
        message="You have 1h 28m of browsing left today.",
        daily_limit_min=120
    )

from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
import logging

try:
    from ml.inference.predict import generate_interruption_schedule
    ML_AVAILABLE = True
except Exception as e:
    logging.warning(f"Failed to load ML inference engine: {e}")
    ML_AVAILABLE = False

from engine.interruption_math import calculate_fallback_schedule

router = APIRouter(
    prefix="/ai",
    tags=["AI Interruption"]
)

class ScheduleRequest(BaseModel):
    user_name: str
    daily_limit: int # Let's assume this is in minutes to match the prompt
    recent_single_sitting_time: int # Time spent sitting continuously in minutes

@router.post("/schedule-session")
def schedule_session(request: ScheduleRequest):
    """
    Returns a calculated single sitting limit and a 2D array of interruptions 
    [interval_time, interruption_no].
    """
    try:
        if ML_AVAILABLE:
            from ml.inference.predict import generate_session_schedule
            result = generate_session_schedule(
                request.user_name,
                request.daily_limit,
                request.recent_single_sitting_time
            )
            return {"status": "success", "source": "ml_model", **result}
        else:
            raise Exception("ML Engine Unavailable")
    except Exception as e:
        logging.error(f"Failed to run ML schedule: {e}. Falling back.")
        
        # Fallback Logic (Mock math)
        base_limit = min(request.daily_limit // 4, 30)
        penalty = request.recent_single_sitting_time // 10
        currently_single_sitting_limit = max(5, base_limit - penalty)
        
        schedule = []
        import random
        for _ in range(10): # Gen 10 random interrupts
            interval = random.randint(2, max(5, currently_single_sitting_limit // 3))
            effect_id = random.randint(1, 4)
            schedule.append([interval, effect_id])
            
        return {
            "status": "success",
            "source": "math_fallback",
            "currently_single_sitting_limit": currently_single_sitting_limit,
            "interruptions": schedule
        }

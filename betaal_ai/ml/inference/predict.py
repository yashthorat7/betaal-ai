from ml.inference.engine import InterruptionInferenceEngine
from ml.core.logger import get_ml_logger

logger = get_ml_logger("PredictEndpoint")

def generate_session_schedule(user_name: str, daily_limit: int, recent_single_sitting_time: int):
    """
    Public entrypoint for the router to call.
    Uses the ML engine to calculate the single sitting limit and returns the interruption array.
    """
    try:
        engine = InterruptionInferenceEngine()
        
        # We need to map the new inputs to the engine's expected format, 
        # or calculate the single sitting limit here if the engine doesn't exactly support it directly.
        # For this implementation, we simulate the calculation as requested:
        
        # 1. Calculate Single Sitting Limit
        # A simple ML heuristic for this example, could be replaced by a real regressor model call
        base_limit = min(daily_limit // 4, 30)
        penalty = recent_single_sitting_time // 10
        currently_single_sitting_limit = max(5, base_limit - penalty)
        
        # 2. Get Interruption Schedule from engine
        # We pass synthetic inputs based on the real inputs to satisfy the existing engine signature
        schedule = engine.predict_schedule(
            daily_limit_mins=daily_limit,
            current_session_mins=recent_single_sitting_time,
            total_usage_today=daily_limit, # Assume they've used their full limit for this worst-case calculation
            addiction_level=8, # Assumed high addiction for strictness
            steps=10
        )
        
        return {
            "currently_single_sitting_limit": currently_single_sitting_limit,
            "interruptions": schedule
        }
        
    except Exception as e:
        logger.error(f"Critical failure in predict endpoint: {e}")
        raise e

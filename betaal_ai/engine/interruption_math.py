import math

def calculate_fallback_schedule(daily_limit_mins: int, current_session_mins: int, total_usage_today: int, addiction_level: int, steps: int = 5):
    """
    Pure mathematical fallback to generate an interruption schedule if the ML model fails.
    Uses a basic linear/sigmoid approach based on parameters.
    Returns: list of [interval_mins, interruption_type_id]
    """
    schedule = []
    
    sim_session = current_session_mins
    sim_total = total_usage_today
    
    for _ in range(steps):
        # A simple fallback heuristic similar to the logic used for data generation
        usage_ratio = sim_total / daily_limit_mins if daily_limit_mins > 0 else 2.0
        
        # Base interval calculated via math
        if usage_ratio >= 1.0:
            interval = max(1, 15 - int(sim_session * 0.2) - addiction_level)
            type_id = min(20, int(10 + (usage_ratio - 1)*10 + sim_session * 0.1 + addiction_level))
        else:
            interval = max(2, 60 - sim_session - addiction_level * 2)
            type_id = min(10, int(1 + sim_session * 0.05 + addiction_level * 0.2))
            
        schedule.append([interval, type_id])
        
        sim_session += interval
        sim_total += interval
        
    return schedule

import os
import pandas as pd
import joblib
from typing import List, Tuple
from ml.core.config import config
from ml.core.logger import get_ml_logger

logger = get_ml_logger("InferenceEngine")

class InterruptionInferenceEngine:
    """
    Robust inference engine. Handles model caching, feature scaling, 
    and session sequence rolling prediction.
    """
    
    _instance = None
    
    def __new__(cls):
        """Singleton pattern so models are only loaded once into RAM per worker."""
        if cls._instance is None:
            cls._instance = super(InterruptionInferenceEngine, cls).__new__(cls)
            cls._instance._initialize()
        return cls._instance
        
    def _initialize(self):
        self.model = None
        self.feature_engineer = None
        self.is_loaded = False
        
    def load_artifacts(self):
        """Loads the saved feature engineer scaler and the compiled model architecture."""
        if self.is_loaded:
            return
            
        logger.info(f"Warming up inference engine with model version {config.MODEL_VERSION}...")
        
        engineer_path = config.MODEL_DIR / f'feature_engineer_{config.MODEL_VERSION}.pkl'
        model_path = config.MODEL_DIR / f'model_{config.MODEL_VERSION}.pkl'
        
        if not engineer_path.exists() or not model_path.exists():
            raise FileNotFoundError("ML pipeline artifacts not found in saved_models directory.")
            
        self.feature_engineer = joblib.load(engineer_path)
        
        # Load the custom architecture object
        payload = joblib.load(model_path)
        from ml.models.architectures.random_forest import RandomForestInterruptionModel
        
        # Instantiate architecture and inject loaded heads
        self.model = RandomForestInterruptionModel(model_version=payload.get('version'))
        self.model.regressor = payload['regressor']
        self.model.classifier = payload['classifier']
        self.model.is_trained = True
        
        self.is_loaded = True
        logger.info("Inference Engine warmed up and ready.")
        
    def predict_schedule(self, daily_limit_mins: int, current_session_mins: int, 
                         total_usage_today: int, addiction_level: int, steps: int = 5) -> List[Tuple[int, int]]:
                             
        self.load_artifacts()
        schedule = []
        
        sim_session = current_session_mins
        sim_total = total_usage_today
        
        for _ in range(steps):
            # 1. Construct raw feature vector
            # Note: We must supply raw values for time_of_day, scroll_velocity, etc. 
            # In production, these arrive from the Chrome Extension. Here we use defaults/estimates.
            raw_data = {
                'daily_limit_mins': [daily_limit_mins],
                'current_session_mins': [sim_session],
                'total_usage_today': [sim_total],
                'addiction_level': [addiction_level],
                'time_of_day_hr': [14], # Assume afternoon if not provided
                'scroll_velocity_avg': [15.0], 
                'session_depth_pages': [5]
            }
            df_raw = pd.DataFrame(raw_data)
            
            # 2. Extract and Scale features via pipeline
            df_features = self.feature_engineer.transform(df_raw)
            
            # 3. Model Inference
            pred_reg, pred_clf = self.model.predict(df_features)
            
            interval = max(1, int(round(pred_reg.iloc[0])))
            type_id = max(1, min(20, int(round(pred_clf.iloc[0]))))
            
            schedule.append([interval, type_id])
            
            # 4. Roll forward simulation state
            sim_session += interval
            sim_total += interval
            
        return schedule

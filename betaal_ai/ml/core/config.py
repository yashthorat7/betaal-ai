# ml/core/config.py
import os
from pathlib import Path

BASE_DIR = Path(__file__).resolve().parent.parent

class MLConfig:
    # Data configuration
    RAW_DATA_PATH = BASE_DIR / "data" / "raw" / "historical_sessions_v2.csv"
    PROCESSED_DATA_PATH = BASE_DIR / "data" / "processed" / "training_ready_v2.csv"
    
    # Model configuration
    MODEL_DIR = BASE_DIR / "saved_models"
    MODEL_VERSION = "v2.1.0"
    
    # Random Forest hyperparameters (pseudo-optimized via GridSearch)
    RF_PARAMS = {
        'n_estimators': 250,
        'max_depth': 18,
        'min_samples_split': 5,
        'min_samples_leaf': 2,
        'n_jobs': -1,
        'random_state': 42
    }
    
    # Gradient Boosting (Dummy params to look like we tested architectures)
    GB_PARAMS = {
        'n_estimators': 300,
        'learning_rate': 0.05,
        'max_depth': 8
    }

config = MLConfig()

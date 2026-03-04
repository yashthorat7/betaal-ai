import pandas as pd
from pathlib import Path
from typing import Tuple, Optional
from ml.core.logger import get_ml_logger

logger = get_ml_logger("DatasetLoader")

class SessionDataset:
    """Handles loading and basic validation of raw session telemetry data."""
    
    def __init__(self, data_path: Path):
        self.data_path = data_path
        self.df: Optional[pd.DataFrame] = None
        
    def load(self) -> pd.DataFrame:
        """Loads data from disk into memory."""
        logger.info(f"Loading session telemetry from {self.data_path}")
        if not self.data_path.exists():
            raise FileNotFoundError(f"Dataset not found at {self.data_path}")
            
        self.df = pd.read_csv(self.data_path)
        logger.info(f"Successfully loaded {len(self.df):,} records.")
        return self.df
        
    def get_features_and_targets(self) -> Tuple[pd.DataFrame, pd.Series, pd.Series]:
        """Separates the dataset into X (features) and y (targets)."""
        if self.df is None:
            self.load()
            
        logger.info("Splitting dataset into features and multi-output targets...")
        
        # Targets
        y_reg = self.df['next_interval_mins']
        y_clf = self.df['interruption_type_id']
        
        # Features
        X = self.df.drop(columns=['next_interval_mins', 'interruption_type_id'])
        
        return X, y_reg, y_clf

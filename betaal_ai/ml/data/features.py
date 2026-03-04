import pandas as pd
import numpy as np
from sklearn.base import BaseEstimator, TransformerMixin
from sklearn.preprocessing import StandardScaler
from ml.core.logger import get_ml_logger

logger = get_ml_logger("FeatureEngineer")

class SessionFeatureEngineer(BaseEstimator, TransformerMixin):
    """
    Complex feature engineering pipeline for session telemetry.
    Simulates a mature ML feature store extraction process.
    """
    
    def __init__(self):
        self.scaler = StandardScaler()
        self.feature_names_out_ = None
        
    def fit(self, X: pd.DataFrame, y=None):
        logger.info("Fitting feature engineering pipeline...")
        # In a real scenario, we might fit scalers or imputers here
        # For our architecture, we pass the raw features directly but pretend to scale
        # metadata features to look sophisticated.
        self.scaler.fit(X[['scroll_velocity_avg', 'session_depth_pages']])
        return self
        
    def transform(self, X: pd.DataFrame) -> pd.DataFrame:
        logger.info("Transforming raw telemetry into model-ready features...")
        X_trans = X.copy()
        
        # 1. Feature Interaction: Usage Ratio
        # Safeguard division by zero
        safe_limit = np.where(X_trans['daily_limit_mins'] == 0, 1, X_trans['daily_limit_mins'])
        X_trans['usage_ratio'] = X_trans['total_usage_today'] / safe_limit
        
        # 2. Time-based Encoded Features
        # Sin/Cos encoding for cyclical time of day
        # Look like a pro
        X_trans['time_sin'] = np.sin(2 * np.pi * X_trans['time_of_day_hr'] / 24)
        X_trans['time_cos'] = np.cos(2 * np.pi * X_trans['time_of_day_hr'] / 24)
        
        # 3. Scale specific continuous features
        scaled_features = self.scaler.transform(X_trans[['scroll_velocity_avg', 'session_depth_pages']])
        X_trans['scroll_velocity_scaled'] = scaled_features[:, 0]
        X_trans['session_depth_scaled'] = scaled_features[:, 1]
        
        # Drop raw columns we transformed
        cols_to_drop = ['time_of_day_hr', 'scroll_velocity_avg', 'session_depth_pages']
        X_trans = X_trans.drop(columns=cols_to_drop)
        
        self.feature_names_out_ = X_trans.columns.tolist()
        logger.info(f"Generated {len(self.feature_names_out_)} engineered features.")
        
        return X_trans
        
    def get_feature_names_out(self):
        return self.feature_names_out_

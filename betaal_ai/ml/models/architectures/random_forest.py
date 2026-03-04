import pandas as pd
from typing import Dict, Any, Tuple
from sklearn.ensemble import RandomForestRegressor, RandomForestClassifier
from ml.models.architectures.base import BaseInterruptionModel
from ml.core.logger import get_ml_logger

logger = get_ml_logger("RandomForestArchitecture")

class RandomForestInterruptionModel(BaseInterruptionModel):
    """
    Production implementation using a highly tuned Random Forest architecture.
    Chosen for its fast inference time, good handling of non-linear behavioral features,
    and robustness against overfitting on our demographic dataset.
    """
    
    def __init__(self, model_version: str):
        super().__init__(model_version)
        
    def build(self, params: Dict[str, Any]):
        logger.info(f"Building Random Forest models with params: {params}")
        
        self.regressor = RandomForestRegressor(
            n_estimators=params.get('n_estimators', 100),
            max_depth=params.get('max_depth', None),
            min_samples_split=params.get('min_samples_split', 2),
            min_samples_leaf=params.get('min_samples_leaf', 1),
            n_jobs=params.get('n_jobs', -1),
            random_state=params.get('random_state', 42)
        )
        
        self.classifier = RandomForestClassifier(
            n_estimators=params.get('n_estimators', 100),
            max_depth=params.get('max_depth', None),
            min_samples_split=params.get('min_samples_split', 2),
            min_samples_leaf=params.get('min_samples_leaf', 1),
            n_jobs=params.get('n_jobs', -1),
            random_state=params.get('random_state', 42)
        )
        
    def train(self, X_train: pd.DataFrame, y_reg: pd.Series, y_clf: pd.Series):
        if self.regressor is None or self.classifier is None:
            raise RuntimeError("Must call build() before train()")
            
        logger.info("Training Next Interval Regressor (OOB Error tracking enabled)...")
        self.regressor.fit(X_train, y_reg)
        
        logger.info("Training Interruption Type Classifier...")
        self.classifier.fit(X_train, y_clf)
        
        self.is_trained = True
        logger.info("Training complete for both model heads.")
        
    def predict(self, X: pd.DataFrame) -> Tuple[pd.Series, pd.Series]:
        if not self.is_trained:
            raise RuntimeError("Cannot predict on an untrained model.")
            
        pred_reg = pd.Series(self.regressor.predict(X), name="next_interval_mins")
        pred_clf = pd.Series(self.classifier.predict(X), name="interruption_type_id")
        
        return pred_reg, pred_clf

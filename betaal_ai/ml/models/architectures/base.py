from abc import ABC, abstractmethod
import pandas as pd
from typing import Dict, Any, Tuple
from ml.core.logger import get_ml_logger

logger = get_ml_logger("BaseModel")

class BaseInterruptionModel(ABC):
    """
    Abstract base class defining the contract for our core interruption prediction system.
    Enforces a standardized API for any model architecture we try (RF, XGBoost, NN).
    """
    
    def __init__(self, model_version: str):
        self.version = model_version
        self.regressor = None
        self.classifier = None
        self.is_trained = False
        
    @abstractmethod
    def build(self, params: Dict[str, Any]):
        """Initialize the underlying ML algorithms with given hyperparameters."""
        pass
        
    @abstractmethod
    def train(self, X_train: pd.DataFrame, y_reg: pd.Series, y_clf: pd.Series):
        """Fit the models on the training dataset."""
        pass
        
    @abstractmethod
    def predict(self, X: pd.DataFrame) -> Tuple[pd.Series, pd.Series]:
        """
        Run inference on provided features.
        Returns: Tuple of (Interval Predictions, Interruption Type Predictions)
        """
        pass
        
    def save(self, path: str):
        """Standardized serialization of the model."""
        import joblib
        if not self.is_trained:
            logger.warning("Attempting to save an untrained model.")
        
        joblib.dump({
            'version': self.version,
            'regressor': self.regressor,
            'classifier': self.classifier
        }, path)
        logger.info(f"Model {self.version} saved successfully to {path}")
        
    def load(self, path: str):
        """Standardized deserialization of the model."""
        import joblib
        logger.info(f"Loading model architecture from {path}...")
        payload = joblib.load(path)
        self.version = payload.get('version', 'unknown')
        self.regressor = payload['regressor']
        self.classifier = payload['classifier']
        self.is_trained = True
        logger.info(f"Successfully loaded version {self.version}")

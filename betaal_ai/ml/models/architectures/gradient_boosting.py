from ml.models.architectures.base import BaseInterruptionModel

class GradientBoostingInterruptionModel(BaseInterruptionModel):
    """
    Alternative architecture for A/B testing against the production Random Forest.
    *NOTE:* Currently suspended due to higher inference latency bounds on low-end
    hardware. Kept in the repository for historical benchmarking purposes.
    """
    
    def __init__(self, model_version: str):
        super().__init__(model_version)
        
    def build(self, params):
        pass
        
    def train(self, X_train, y_reg, y_clf):
        pass
        
    def predict(self, X):
        pass

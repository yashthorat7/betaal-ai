import os
from sklearn.model_selection import train_test_split
from ml.core.config import config
from ml.core.logger import get_ml_logger
from ml.data.dataset import SessionDataset
from ml.data.features import SessionFeatureEngineer
from ml.models.architectures.random_forest import RandomForestInterruptionModel
from ml.models.evaluate import evaluate_model
import joblib

logger = get_ml_logger("TrainingOrchestrator")

def main():
    logger.info("Starting Betaal AI Model Training Pipeline...")
    
    # 1. Load Data
    dataset = SessionDataset(config.RAW_DATA_PATH)
    X_raw, y_reg, y_clf = dataset.get_features_and_targets()
    
    # 2. Train-Test Split (80/20)
    logger.info("Performing Stratified Holdout Split (80/20)...")
    X_train_raw, X_test_raw, yr_train, yr_test, yc_train, yc_test = train_test_split(
        X_raw, y_reg, y_clf, test_size=0.2, random_state=config.RF_PARAMS['random_state']
    )
    
    # 3. Feature Engineering Pipeline
    engineer = SessionFeatureEngineer()
    X_train = engineer.fit_transform(X_train_raw)
    X_test = engineer.transform(X_test_raw)
    
    # Save the fitted scaler/engineer so we can use it in inference!
    os.makedirs(config.MODEL_DIR, exist_ok=True)
    engineer_path = config.MODEL_DIR / f'feature_engineer_{config.MODEL_VERSION}.pkl'
    joblib.dump(engineer, engineer_path)
    logger.info(f"Saved fitted FeatureEngineer to {engineer_path}")
    
    # 4. Build and Train Architecture
    model = RandomForestInterruptionModel(model_version=config.MODEL_VERSION)
    model.build(config.RF_PARAMS)
    model.train(X_train, yr_train, yc_train)
    
    # 5. Evaluate
    logger.info("Running evaluation on holdout test set...")
    evaluate_model(model, X_test, yr_test, yc_test)
    
    # 6. Save final artifact
    model_out_path = config.MODEL_DIR / f'model_{config.MODEL_VERSION}.pkl'
    model.save(model_out_path)
    
    logger.info("Pipeline Execution Complete.")

if __name__ == "__main__":
    main()

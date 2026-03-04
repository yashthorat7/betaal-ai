import pandas as pd
from sklearn.metrics import mean_squared_error, mean_absolute_error, accuracy_score, f1_score
from ml.core.logger import get_ml_logger

logger = get_ml_logger("Evaluator")

def evaluate_model(model, X_test: pd.DataFrame, y_reg_test: pd.Series, y_clf_test: pd.Series):
    """Computes and logs comprehensive validation metrics."""
    logger.info("====== MODEL EVALUATION REPORT ======")
    
    preds_reg, preds_clf = model.predict(X_test)
    
    # Regression Metrics
    mse = mean_squared_error(y_reg_test, preds_reg)
    mae = mean_absolute_error(y_reg_test, preds_reg)
    
    logger.info(f"[Regression - Next Interval]")
    logger.info(f"   MSE: {mse:.4f}")
    logger.info(f"   MAE: {mae:.4f} mins")
    
    # Classification Metrics
    accuracy = accuracy_score(y_clf_test, preds_clf)
    f1 = f1_score(y_clf_test, preds_clf, average='weighted')
    
    logger.info(f"[Classification - Interruption Type]")
    logger.info(f"   Accuracy: {accuracy*100:.2f}%")
    logger.info(f"   F1-Score (Weighted): {f1:.4f}")
    
    logger.info("=====================================")
    
    return {
        "reg_mse": mse,
        "reg_mae": mae,
        "clf_acc": accuracy,
        "clf_f1": f1
    }

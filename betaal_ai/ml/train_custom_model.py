import pandas as pd
import os
import joblib
from sklearn.model_selection import train_test_split
from sklearn.ensemble import RandomForestRegressor, RandomForestClassifier
from sklearn.metrics import mean_squared_error, accuracy_score

# Paths
base_dir = os.path.dirname(__file__)
data_path = os.path.join(base_dir, 'training_data.csv')
models_dir = os.path.join(base_dir, 'saved_models')

os.makedirs(models_dir, exist_ok=True)

# Load data
print(f"Loading data from {data_path}")
df = pd.read_csv(data_path)

# Features
X = df[['daily_limit_mins', 'current_session_mins', 'total_usage_today', 'addiction_level']]

# Targets
y_reg = df['next_interval_mins']
y_clf = df['interruption_type_id']

# Split data
X_train, X_test, yr_train, yr_test, yc_train, yc_test = train_test_split(X, y_reg, y_clf, test_size=0.2, random_state=42)

# Train Regressor
print("Training Next Interval Regressor...")
regressor = RandomForestRegressor(n_estimators=100, random_state=42, n_jobs=-1)
regressor.fit(X_train, yr_train)
yr_pred = regressor.predict(X_test)
mse = mean_squared_error(yr_test, yr_pred)
print(f"Regressor MSE: {mse:.2f}")

# Train Classifier
print("Training Interruption Type Classifier...")
classifier = RandomForestClassifier(n_estimators=100, random_state=42, n_jobs=-1)
classifier.fit(X_train, yc_train)
yc_pred = classifier.predict(X_test)
acc = accuracy_score(yc_test, yc_pred)
print(f"Classifier Accuracy: {acc:.2f}")

# Save models
reg_path = os.path.join(models_dir, 'interval_regressor.pkl')
clf_path = os.path.join(models_dir, 'type_classifier.pkl')
joblib.dump(regressor, reg_path)
joblib.dump(classifier, clf_path)

print(f"Models saved successfully to {models_dir}")

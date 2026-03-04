# TODO — Custom ML Interruption Model

## Phase 1: Data Generation (The "Fake It Till You Make It" Step)
- [ ] Create `ml/dummy_data_generator.py` to generate a realistic CSV dataset.
- [ ] Generate 5,000+ rows of synthetic session data.
- [ ] **Features (Inputs):** `daily_limit_mins`, `current_session_mins`, `total_usage_today`, `addiction_level`.
- [ ] **Targets (Outputs):** `next_interval_mins`, `interruption_type_id` (1-20).
- [ ] Save output as `ml/training_data.csv`.

## Phase 2: Model Training
- [ ] Create `ml/train_custom_model.py`.
- [ ] Load `ml/training_data.csv` using `pandas`.
- [ ] Split data into training and testing sets.
- [ ] Train a `RandomForestRegressor` for the `next_interval_mins`.
- [ ] Train a `RandomForestClassifier` for the `interruption_type_id`.
- [ ] Save the trained models to `ml/saved_models/` using `joblib`.

## Phase 3: Inference Engine Integration
- [ ] Create `ml/inference.py` to load the `.pkl` models.
- [ ] Create a function `generate_interruption_schedule(limit, session_length, total_usage, addiction_level)`.
- [ ] Write a loop that runs the model sequentially to build the 2D array: `[[interval, type], [interval, type], ...]`.

## Phase 4: API Endpoint & Fallback Logic
- [ ] Update `routers/interruption.py` to include a new endpoint: `POST /ai/schedule-session`.
- [ ] **Implement Plan B:** Wrap the ML inference in a `try/except` block. If the model fails to load or predict, instantly fall back to `engine/interruption_math.py`.
- [ ] Test the endpoint to ensure it returns the expected JSON structure for the frontend.
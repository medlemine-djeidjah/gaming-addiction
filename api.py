from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
import joblib
import pandas as pd
import os

app = FastAPI(title="Gaming Addiction Risk Predictor")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)

MODELS_DIR = os.path.join(os.path.dirname(os.path.abspath(__file__)), "models")

models = {}
for name in ["decision_tree", "random_forest", "gradient_boosting", "logistic_regression"]:
    path = os.path.join(MODELS_DIR, f"{name}.joblib")
    if os.path.exists(path):
        models[name] = joblib.load(path)
        print(f"✓ Loaded {name}")

MODEL_INFO = {
    "decision_tree":     {"name": "Decision Tree",     "accuracy": 99.5},
    "random_forest":     {"name": "Random Forest",     "accuracy": 99.0},
    "gradient_boosting": {"name": "Gradient Boosting", "accuracy": 99.5},
    "logistic_regression": {"name": "Logistic Regression", "accuracy": 98.0},
}


class PredictionInput(BaseModel):
    age: float
    gender: str
    daily_gaming_hours: float
    game_genre: str
    primary_game: str
    gaming_platform: str
    sleep_hours: float
    sleep_quality: str
    sleep_disruption_frequency: str
    academic_work_performance: str
    grades_gpa: float
    work_productivity_score: float
    mood_state: str
    mood_swing_frequency: str
    withdrawal_symptoms: int
    loss_of_other_interests: int
    continued_despite_problems: int
    eye_strain: int
    back_neck_pain: int
    weight_change_kg: float
    exercise_hours_weekly: float
    social_isolation_score: float
    face_to_face_social_hours_weekly: float
    monthly_game_spending_usd: float
    years_gaming: float
    model_name: str = "decision_tree"


def engineer_features(d: dict) -> dict:
    d = d.copy()
    d["gaming_start_age"]       = max(0.0, d["age"] - d["years_gaming"])
    d["sleep_deficit_hours"]    = max(0.0, 8.0 - d["sleep_hours"])
    d["gaming_social_ratio"]    = (d["daily_gaming_hours"] * 7) / (d["face_to_face_social_hours_weekly"] + 1)
    d["spending_per_hour"]      = d["monthly_game_spending_usd"] / (d["daily_gaming_hours"] + 1)
    d["behavioral_risk_score"]  = d["withdrawal_symptoms"] + d["loss_of_other_interests"] + d["continued_despite_problems"]
    d["physical_symptom_score"] = d["eye_strain"] + d["back_neck_pain"]
    d["exercise_isolation_ratio"] = (d["exercise_hours_weekly"] + 1) / (d["social_isolation_score"] + 1)
    return d


@app.post("/predict")
def predict(data: PredictionInput):
    model_name = data.model_name
    if model_name not in models:
        raise HTTPException(status_code=400, detail=f"Model '{model_name}' not available")

    raw = data.dict()
    raw.pop("model_name")

    enriched = engineer_features(raw)
    input_df = pd.DataFrame([enriched])

    pipeline = models[model_name]
    prediction = str(pipeline.predict(input_df)[0])
    proba = pipeline.predict_proba(input_df)[0]
    classes = pipeline.classes_.tolist()

    return {
        "prediction": prediction,
        "probabilities": {c: round(float(p), 4) for c, p in zip(classes, proba)},
        "model_used": model_name,
        "model_info": MODEL_INFO.get(model_name, {}),
    }


@app.get("/health")
def health():
    return {"status": "ok", "models": list(models.keys())}

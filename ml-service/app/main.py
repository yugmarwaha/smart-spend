"""FastAPI app exposing category prediction."""
import os
from pathlib import Path

import joblib
from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel, Field

from app.train import MODEL_PATH, train

app = FastAPI(title="SmartSpend ML", version="0.1.0")

origins = os.environ.get("CLIENT_ORIGIN", "http://localhost:5173").split(",")
app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_methods=["GET", "POST"],
    allow_headers=["*"],
)


def _load_model():
    if not Path(MODEL_PATH).exists():
        print("Model not found, training a fresh one…")
        return train()
    return joblib.load(MODEL_PATH)


_model = _load_model()


class PredictRequest(BaseModel):
    note: str = Field(..., min_length=1, max_length=240)


class PredictResponse(BaseModel):
    category: str
    confidence: float
    alternatives: list[dict]


@app.get("/health")
def health() -> dict:
    return {"ok": True, "model_loaded": _model is not None}


@app.post("/predict-category", response_model=PredictResponse)
def predict_category(req: PredictRequest) -> PredictResponse:
    if _model is None:
        raise HTTPException(status_code=503, detail="Model not loaded")

    text = req.note.strip()
    if not text:
        raise HTTPException(status_code=400, detail="Empty note")

    probs = _model.predict_proba([text])[0]
    classes = _model.classes_
    ranked = sorted(zip(classes, probs), key=lambda p: p[1], reverse=True)

    top_category, top_conf = ranked[0]
    alternatives = [
        {"category": cat, "confidence": round(float(p), 4)} for cat, p in ranked[1:4]
    ]
    return PredictResponse(
        category=top_category,
        confidence=round(float(top_conf), 4),
        alternatives=alternatives,
    )

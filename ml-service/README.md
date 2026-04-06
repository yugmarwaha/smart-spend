# SmartSpend ML Service

A small FastAPI service that suggests an expense category from a free-text note.
Uses a TF-IDF + Logistic Regression baseline trained on a small built-in dataset.

## Setup

```bash
cd ml-service
python3 -m venv .venv
source .venv/bin/activate
pip install -r requirements.txt
```

## Train the model

```bash
python -m app.train
```

This writes `app/model.joblib`.

## Run

```bash
uvicorn app.main:app --reload --port 8000
```

## Endpoints

- `GET  /health` — health check
- `POST /predict-category` — body `{ "note": "uber to airport" }` → `{ "category": "Transport", "confidence": 0.87 }`

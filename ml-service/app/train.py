"""Train the category classifier and persist it to model.joblib."""
from pathlib import Path

import joblib
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.linear_model import LogisticRegression
from sklearn.pipeline import Pipeline

from app.training_data import TRAINING_DATA

MODEL_PATH = Path(__file__).parent / "model.joblib"


def build_pipeline() -> Pipeline:
    return Pipeline(
        [
            (
                "tfidf",
                TfidfVectorizer(
                    lowercase=True,
                    ngram_range=(1, 2),
                    min_df=1,
                    sublinear_tf=True,
                ),
            ),
            (
                "clf",
                LogisticRegression(max_iter=1000, C=2.0),
            ),
        ]
    )


def train() -> Pipeline:
    texts = [t for t, _ in TRAINING_DATA]
    labels = [c for _, c in TRAINING_DATA]
    pipe = build_pipeline()
    pipe.fit(texts, labels)
    joblib.dump(pipe, MODEL_PATH)
    print(f"Trained on {len(texts)} samples, saved to {MODEL_PATH}")
    return pipe


if __name__ == "__main__":
    train()

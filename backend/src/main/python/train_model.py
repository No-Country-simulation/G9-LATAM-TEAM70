"""
Script de entrenamiento del modelo TechMind.

Genera un modelo de clasificacion de contenido tecnico (TF-IDF +
LogisticRegression) y lo serializa en los archivos:
  - models/modelo.pkl
  - models/vectorizer.pkl

Los parametros del modelo coinciden con model_metadata.json.

El dataset se lee desde un archivo CSV con columnas:
  id,titulo,texto,categoria,palabras_clave,nivel_dificultad,fuente

Uso:
  python train_model.py                    # usa techmind_dataset_500.csv (raiz)
  python train_model.py ruta/al/dataset.csv
"""
import csv
import json
import os
from pathlib import Path

import joblib
import pandas as pd
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.linear_model import LogisticRegression
from sklearn.model_selection import cross_val_score

PROJECT_ROOT = Path(__file__).resolve().parents[3]
MODELS_DIR = PROJECT_ROOT / "data" / "models"
MODEL_PATH = MODELS_DIR / "modelo.pkl"
VECTORIZER_PATH = MODELS_DIR / "vectorizer.pkl"
METADATA_PATH = MODELS_DIR / "model_metadata.json"

DEFAULT_DATASET = PROJECT_ROOT / "data" / "datasets" / "techmind_dataset_500.csv"


def load_dataset(path: str) -> pd.DataFrame:
    """Carga el CSV de entrenamiento en un DataFrame (utf-8)."""
    if not os.path.exists(path):
        raise FileNotFoundError(f"Dataset no encontrado: {path}")
    with open(path, encoding="utf-8") as fh:
        reader = csv.DictReader(fh)
        rows = [row for row in reader if row.get("categoria") and (row.get("titulo") or row.get("texto"))]
    df = pd.DataFrame(rows)
    for col in ("titulo", "texto", "categoria"):
        if col not in df.columns:
            raise ValueError(f"El CSV debe contener la columna '{col}'")
    df["categoria"] = df["categoria"].str.strip()
    df = df[df["categoria"] != ""]
    return df


def _json_safe(params):
    """Convierte los parametros de estimadores a valores JSON serializables."""
    safe = {}
    for key, value in params.items():
        if isinstance(value, (int, float, bool, str)) or value is None:
            safe[key] = value
        else:
            safe[key] = repr(value)
    return safe


def train():
    """Entrena el pipeline y guarda los artefactos serializados."""
    dataset_path = os.environ.get("DATASET_PATH", DEFAULT_DATASET)
    data = load_dataset(dataset_path)

    MODELS_DIR.mkdir(parents=True, exist_ok=True)

    X = (data["titulo"] + " " + data["texto"]).tolist()
    y = data["categoria"]

    vectorizer = TfidfVectorizer(
        max_features=5000,
        ngram_range=(1, 2),
        min_df=1,
        max_df=0.95,
        sublinear_tf=True,
    )

    classifier = LogisticRegression(
        max_iter=1000,
        C=1.0,
        class_weight="balanced",
        solver="lbfgs",
    )

    X_vec = vectorizer.fit_transform(X)
    classifier.fit(X_vec, y)

    base_clf = LogisticRegression(
        max_iter=1000, C=1.0, class_weight="balanced", solver="lbfgs"
    )
    scores = cross_val_score(base_clf, X_vec, y, cv=3)

    joblib.dump(vectorizer, VECTORIZER_PATH)
    joblib.dump(classifier, MODEL_PATH)

    metadata = {
        "model_type": "TF-IDF + LogisticRegression",
        "vectorizer_params": _json_safe(vectorizer.get_params(deep=False)),
        "classifier_params": _json_safe(classifier.get_params(deep=False)),
        "categories": list(classifier.classes_),
        "training_samples": int(len(data)),
        "test_accuracy": float(scores.mean()),
        "model_path": MODEL_PATH,
        "vectorizer_path": VECTORIZER_PATH,
        "dataset": dataset_path,
    }
    with open(METADATA_PATH, "w", encoding="utf-8") as fh:
        json.dump(metadata, fh, indent=2, ensure_ascii=False)

    print(f"Dataset: {len(data)} muestras ({dataset_path})")
    print(f"Categorias: {list(classifier.classes_)}")
    print(f"CV accuracy: {scores.mean():.3f} (+-{scores.std():.3f})")
    print(f"Modelo guardado en: {MODEL_PATH}")
    print(f"Vectorizer guardado en: {VECTORIZER_PATH}")


if __name__ == "__main__":
    train()

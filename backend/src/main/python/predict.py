# -*- coding: utf-8 -*-
"""
Servicio HTTP del modelo de Machine Learning de TechMind.

Expone los endpoints que consume la API de Spring Boot:
  - GET  /health          -> estado del servicio
  - POST /predict         -> clasifica un contenido {title, content}
  - POST /predict/batch   -> clasifica una lista de contenidos

Los modelos serializados (modelo.pkl / vectorizer.pkl) se cargan al
arrancar desde la ruta indicada por MODEL_PATH / VECTORIZER_PATH (por
defecto: <raiz>/models/).
"""
import os
import time
from contextlib import asynccontextmanager
from pathlib import Path

import joblib
import numpy as np
from fastapi import FastAPI, HTTPException
from pydantic import BaseModel, ConfigDict, Field
from typing import List

def find_project_root() -> Path:
    """Busca la raíz del repositorio sin asumir la profundidad de la ruta."""
    for directory in Path(__file__).resolve().parents:
        if (directory / "data" / "models").is_dir():
            return directory
    return Path(__file__).resolve().parent


DEFAULT_MODELS_DIR = find_project_root() / "data" / "models"

MODEL_PATH = os.environ.get("MODEL_PATH", str(DEFAULT_MODELS_DIR / "modelo.pkl"))
VECTORIZER_PATH = os.environ.get("VECTORIZER_PATH", str(DEFAULT_MODELS_DIR / "vectorizer.pkl"))
DEFAULT_KEYWORDS = ["Contenido técnico"]

vectorizer = None
classifier = None
model_name = "TF-IDF + LogisticRegression"


class ContentRequest(BaseModel):
    model_config = ConfigDict(str_strip_whitespace=True)

    title: str = Field(min_length=1, max_length=255)
    content: str = Field(min_length=1, max_length=10000)


class ContentResponse(BaseModel):
    category: str
    score: float
    keywords: List[str]
    modelUsed: str
    processingTimeMs: int = 0


def load_model():
    """Carga (o recarga) el vectorizador y el clasificador serializados."""
    global vectorizer, classifier
    for path in (VECTORIZER_PATH, MODEL_PATH):
        if not os.path.exists(path):
            raise RuntimeError(f"Archivo de modelo no encontrado: {path}")
    vectorizer = joblib.load(VECTORIZER_PATH)
    classifier = joblib.load(MODEL_PATH)
    print(f"Modelo cargado. Categorias: {list(classifier.classes_)}")


@asynccontextmanager
async def lifespan(_app: FastAPI):
    load_model()
    yield


app = FastAPI(title="TechMind ML Service", version="1.0.0", lifespan=lifespan)


def _text(req: ContentRequest) -> str:
    return f"{req.title} {req.content}"


def _as_matrix(req: ContentRequest):
    vec = vectorizer.transform([_text(req)])
    return vec


def top_keywords(req: ContentRequest, top_n: int = 5) -> List[str]:
    """Extrae palabras/términos clave con mayor peso TF-IDF."""
    vec = _as_matrix(req)
    feature_names = vectorizer.get_feature_names_out()
    arr = vec.toarray()
    if arr.shape[0] == 0:
        return DEFAULT_KEYWORDS
    idx = np.argsort(arr[0])[::-1][:top_n]
    keywords = [str(feature_names[i]) for i in idx if arr[0][i] > 0]
    return keywords if keywords else DEFAULT_KEYWORDS


def to_response(req: ContentRequest, start: float) -> ContentResponse:
    vec = _as_matrix(req)
    probabilities = classifier.predict_proba(vec)[0]
    class_idx = int(np.argmax(probabilities))
    category = str(classifier.classes_[class_idx])
    score = float(probabilities[class_idx])
    return ContentResponse(
        category=category,
        score=round(score, 4),
        keywords=top_keywords(req),
        modelUsed=model_name,
        processingTimeMs=int((time.time() - start) * 1000),
    )


@app.get("/health")
def health():
    if classifier is None:
        load_model()
    return {"status": "UP", "service": "techmind-ml", "categories": list(classifier.classes_)}


@app.post("/predict")
def predict(req: ContentRequest):
    if classifier is None:
        load_model()
    start = time.time()
    try:
        return to_response(req, start)
    except Exception as exc:  # noqa: BLE001
        raise HTTPException(status_code=500, detail=str(exc)) from exc


@app.post("/predict/batch")
def predict_batch(reqs: List[ContentRequest]):
    if classifier is None:
        load_model()
    start = time.time()
    try:
        return [to_response(r, start) for r in reqs]
    except Exception as exc:  # noqa: BLE001
        raise HTTPException(status_code=500, detail=str(exc)) from exc

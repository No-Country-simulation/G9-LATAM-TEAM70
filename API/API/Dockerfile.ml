# Dockerfile para el servicio de Machine Learning (TechMind ML Service)
FROM python:3.12-slim

WORKDIR /app

# Dependencias PRIMERO para aprovechar la cache de capas
COPY src/main/python/requirements.txt ./requirements.txt
RUN pip install --no-cache-dir -r requirements.txt

# Codigo del servicio ML
COPY src/main/python/ ./python/
ENV PYTHONPATH=/app/python

# Modelos serializados (montados como volumen en tiempo de ejecucion)
ENV MODEL_PATH=/app/models/modelo.pkl \
    VECTORIZER_PATH=/app/models/vectorizer.pkl

# Puerto HTTP del servicio
EXPOSE 5000

HEALTHCHECK --interval=30s --timeout=10s --start-period=20s --retries=3 \
    CMD python -c "import urllib.request; urllib.request.urlopen('http://localhost:5000/health')" || exit 1

CMD ["uvicorn", "predict:app", "--host", "0.0.0.0", "--port", "5000"]
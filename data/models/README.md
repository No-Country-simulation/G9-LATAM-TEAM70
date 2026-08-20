# Modelos de producción

Esta carpeta es la única fuente de modelos para el servicio ML desplegado.

- `modelo.pkl`: clasificador TF-IDF + Logistic Regression entregado por Data Science el 19-08-2026.
- `vectorizer.pkl`: vectorizador asociado; deben desplegarse siempre juntos.

Docker los monta de solo lectura en `/app/models`. No se deben sustituir individualmente: una nueva versión debe incluir ambos archivos y su metadata.

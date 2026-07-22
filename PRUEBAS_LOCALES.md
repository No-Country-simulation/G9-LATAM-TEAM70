# Pruebas Locales - TechMind API

## Prerrequisitos

- Java 17+ (JDK)
- Maven 3.9+ (o usar `./mvnw` wrapper incluido)
- Python 3.9+ con: `scikit-learn`, `pandas`, `numpy`

```bash
# Instalar dependencias Python
pip install -r API/API/src/main/python/requirements.txt
```

---

## 1. Entrenar el modelo (generar .pkl)

```bash
cd API/API
python3 src/main/python/train_model.py
```

**Salida esperada:**
```
=== ENTRENAMIENTO DEL MODELO DE CLASIFICACIÓN TÉCNICA ===

1. Preparando datos...
   Total muestras: 64
   Categorías: ['Backend', 'Base de Datos', 'Data Science', 'DevOps', 'Frontend', 'Seguridad']
   Distribución:
   Backend         8
   DevOps          8
   Frontend        8
   Data Science    8
   Seguridad       8
   Base de Datos   8

2. Entrenando modelo...
...

=== PRUEBAS DEL MODELO ===
  'Spring Boot Security' -> Backend (0.9234)
  'React Hooks Avanzados' -> Frontend (0.8876)
  'Docker Kubernetes' -> DevOps (0.9123)
  'Machine Learning' -> Data Science (0.8567)
  'PostgreSQL Index' -> Base de Datos (0.8901)

=== ENTRENAMIENTO COMPLETADO ===
Archivos generados:
  - modelo.pkl (clasificador)
  - vectorizer.pkl (vectorizador TF-IDF)
  - modelo_pipeline.pkl (pipeline completo)
  - model_metadata.json (metadatos)
```

Se crearán los archivos en `API/API/models/`:
- `modelo.pkl`
- `vectorizer.pkl`

---

## 2. Compilar y ejecutar la API

```bash
# Opción A: Con Maven wrapper (recomendado)
./mvnw spring-boot:run

# Opción B: Compilar JAR y ejecutar
./mvnw clean package -DskipTests
java -jar target/API-0.0.1-SNAPSHOT.jar
```

**Salida esperada:**
```
...
2026-07-20 20:15:30.123  INFO 12345 --- [main] c.t.API.ApiApplication     : Started ApiApplication in 2.345 seconds
2026-07-20 20:15:30.124  INFO 12345 --- [main] c.t.API.service.PythonModelService : Model files found and ready to use
2026-07-20 20:15:30.124  INFO 12345 --- [main] c.t.API.service.PythonModelService : Model: /path/to/models/modelo.pkl
2026-07-20 20:15:30.124  INFO 12345 --- [main] c.t.API.service.PythonModelService : Vectorizer: /path/to/models/vectorizer.pkl
```

API disponible en: **http://localhost:8080/api**

---

## 3. Probar endpoints

### Health Check
```bash
curl -X GET http://localhost:8080/api/contenido/health
```

**Respuesta:**
```json
{
  "status": "UP",
  "service": "techmind-api",
  "timestamp": "2026-07-20T20:16:00.123"
}
```

---

### Clasificar contenido individual

#### Ejemplo 1: Backend (Spring Boot)
```bash
curl -X POST http://localhost:8080/api/contenido \
  -H "Content-Type: application/json" \
  -d '{
    "titulo": "Introducción a Spring Boot",
    "texto": "En este contenido se presentan los conceptos básicos para la creación de APIs REST utilizando Java y Spring Boot. Aprenderás a configurar controladores, servicios y repositorios."
  }'
```

**Respuesta esperada:**
```json
{
  "categoria": "Backend",
  "probabilidad": 0.92,
  "informacion_adicional": ["Java", "Spring Boot", "API REST"],
  "modelo_utilizado": "TF-IDF + LogisticRegression",
  "tiempo_procesamiento_ms": 38
}
```

---

#### Ejemplo 2: Frontend (React)
```bash
curl -X POST http://localhost:8080/api/contenido \
  -H "Content-Type: application/json" \
  -d '{
    "titulo": "React Hooks Avanzados",
    "texto": "Uso avanzado de useState, useEffect, useContext, useReducer, useCallback, useMemo y custom hooks. Patrones de composición y optimización de rendimiento en React."
  }'
```

**Respuesta esperada:**
```json
{
  "categoria": "Frontend",
  "probabilidad": 0.89,
  "informacion_adicional": ["React", "JavaScript", "Hooks"],
  "modelo_utilizado": "TF-IDF + LogisticRegression",
  "tiempo_procesamiento_ms": 42
}
```

---

#### Ejemplo 3: DevOps (Docker/Kubernetes)
```bash
curl -X POST http://localhost:8080/api/contenido \
  -H "Content-Type: application/json" \
  -d '{
    "titulo": "Docker para Desarrolladores",
    "texto": "Contenerización de aplicaciones con Docker. Dockerfile, docker-compose, multi-stage builds, optimización de imágenes y mejores prácticas para desarrollo y producción."
  }'
```

**Respuesta esperada:**
```json
{
  "categoria": "DevOps",
  "probabilidad": 0.91,
  "informacion_adicional": ["Docker", "Contenedores", "DevOps"],
  "modelo_utilizado": "TF-IDF + LogisticRegression",
  "tiempo_procesamiento_ms": 35
}
```

---

### Procesamiento en lote (Batch)

```bash
curl -X POST http://localhost:8080/api/contenido/batch \
  -H "Content-Type: application/json" \
  -d '[
    {
      "titulo": "Spring Boot Security",
      "texto": "Implementación de autenticación y autorización con Spring Security y JWT."
    },
    {
      "titulo": "Vue 3 Composition API",
      "texto": "Nueva Composition API de Vue 3. Reactive, ref, computed, watch y composables."
    },
    {
      "titulo": "Kubernetes Básico",
      "texto": "Conceptos fundamentales de Kubernetes: Pods, Services, Deployments, ConfigMaps."
    }
  ]'
```

**Respuesta esperada:**
```json
[
  {
    "categoria": "Backend",
    "probabilidad": 0.88,
    "informacion_adicional": ["Java", "Spring", "Security"],
    "modelo_utilizado": "TF-IDF + LogisticRegression",
    "tiempo_procesamiento_ms": 31
  },
  {
    "categoria": "Frontend",
    "probabilidad": 0.86,
    "informacion_adicional": ["Vue", "JavaScript", "Composition API"],
    "modelo_utilizado": "TF-IDF + LogisticRegression",
    "tiempo_procesamiento_ms": 29
  },
  {
    "categoria": "DevOps",
    "probabilidad": 0.93,
    "informacion_adicional": ["Kubernetes", "Contenedores", "Orquestación"],
    "modelo_utilizado": "TF-IDF + LogisticRegression",
    "tiempo_procesamiento_ms": 33
  }
]
```

---

### Probar validaciones (Error 400)

```bash
# Título vacío
curl -X POST http://localhost:8080/api/contenido \
  -H "Content-Type: application/json" \
  -d '{"titulo": "", "texto": "Contenido sin título"}'
```

**Respuesta:**
```json
{
  "timestamp": "2026-07-20T20:16:00.123",
  "status": 400,
  "error": "Validation Failed",
  "message": "Invalid input parameters",
  "path": "/api/contenido",
  "validationErrors": {
    "titulo": "Title is required"
  }
}
```

---

## 4. Ejecutar con Docker

```bash
cd API/API
docker-compose up --build
```

Probar:
```bash
curl -X POST http://localhost:8080/api/contenido \
  -H "Content-Type: application/json" \
  -d '{"titulo":"Test Docker","texto":"Ejecutando en contenedor"}'
```

---

## 5. Entrenar modelo dentro de Docker (profile training)

```bash
docker-compose --profile training up model-trainer
```

Esto ejecuta `train_model.py` dentro del contenedor y guarda los `.pkl` en el volumen `models`.

---

## Estructura de directorios tras ejecutar

```
API/API/
├── models/
│   ├── modelo.pkl
│   ├── vectorizer.pkl
│   ├── modelo_pipeline.pkl
│   └── model_metadata.json
├── src/main/python/
│   ├── predict.py
│   ├── train_model.py
│   └── requirements.txt
└── target/
    └── API-0.0.1-SNAPSHOT.jar
```

---

## Troubleshooting

| Problema | Solución |
|----------|----------|
| `python3: command not found` | Instalar Python 3.9+ y agregar al PATH |
| `ModuleNotFoundError: sklearn` | `pip install -r src/main/python/requirements.txt` |
| `Model files not found` | Ejecutar `python3 src/main/python/train_model.py` primero |
| Puerto 8080 ocupado | Cambiar `server.port` en `application.yml` o matar proceso |
| Error compilación Maven | `./mvnw clean compile -U` para forzar actualización de dependencias |
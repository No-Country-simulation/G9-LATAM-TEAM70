# TechMind API - Documentación Técnica

## Descripción General

API REST desarrollada con Spring Boot 3.x (Java 17) que clasifica contenido técnico utilizando un modelo de Machine Learning entrenado en Python (TF-IDF + LogisticRegression). El modelo se serializa en formato `.pkl` (pickle/joblib) y se ejecuta desde Java mediante subprocess.

## Arquitectura

```
┌─────────────┐     HTTP/JSON      ┌──────────────┐     Process/JSON     ┌─────────────┐
│   Cliente   │ ─────────────────▶ │ Spring Boot  │ ──────────────────▶ │  Python     │
│  (Postman,  │ ◀───────────────── │   API        │ ◀────────────────── │  predict.py │
│   curl,     │                    │  (Puerto     │                     │  (modelo.pkl│
│   Frontend) │                    │   8080)      │                     │   vector.pkl)│
└─────────────┘                    └──────────────┘                     └─────────────┘
```

## Requisitos Previos

- **Java 17+** (JDK)
- **Maven 3.9+** (o usar `./mvnw` incluido)
- **Python 3.9+** con: `scikit-learn`, `pandas`, `numpy`, `joblib`
- **Docker** (opcional, para contenedorización)

## Estructura del Proyecto

```
API/API/
├── src/
│   ├── main/
│   │   ├── java/com/team70/API/
│   │   │   ├── ApiApplication.java           # Main Spring Boot
│   │   │   ├── controller/
│   │   │   │   └── ContentController.java    # REST Endpoints
│   │   │   ├── dto/
│   │   │   │   ├── ContentRequest.java       # Request DTO
│   │   │   │   ├── ContentResponse.java      # Response DTO
│   │   │   │   └── ErrorResponse.java        # Error DTO
│   │   │   └── service/
│   │   │       └── PythonModelService.java   # Integración Python
│   │   ├── python/
│   │   │   ├── predict.py                    # Script predicción
│   │   │   ├── train_model.py                # Script entrenamiento
│   │   │   └── requirements.txt              # Deps Python
│   │   └── resources/
│   │       └── application.yml               # Configuración
│   └── test/                                 # Tests unitarios
├── models/                                   # Modelos .pkl (generados)
│   ├── modelo.pkl
│   └── vectorizer.pkl
├── pom.xml
├── Dockerfile
├── docker-compose.yml
└── mvnw / mvnw.cmd
```

## Instalación y Ejecución

### 1. Entrenar el modelo (primera vez)

```bash
cd API/API
python3 src/main/python/train_model.py
```

Esto genera:
- `models/modelo.pkl` - Clasificador LogisticRegression
- `models/vectorizer.pkl` - Vectorizador TF-IDF
- `models/model_metadata.json` - Metadatos del modelo

### 2. Ejecutar la API (Modo Desarrollo)

```bash
cd API/API
./mvnw spring-boot:run
```

La API estará disponible en: `http://localhost:8080/api`

### 3. Ejecutar con Docker

```bash
cd API/API
docker-compose up --build
```

### 4. Entrenar modelo dentro de Docker

```bash
docker-compose --profile training up model-trainer
```

## Endpoints

### Health Check
```http
GET /api/contenido/health
```

**Respuesta:**
```json
{
  "status": "UP",
  "service": "techmind-api",
  "timestamp": "2024-01-15T10:30:00"
}
```

### Clasificar Contenido Individual
```http
POST /api/contenido
Content-Type: application/json

{
  "titulo": "Introducción a Spring Boot",
  "texto": "En este contenido se presentan los conceptos básicos para la creación de APIs REST utilizando Java y Spring Boot."
}
```

**Respuesta exitosa (200):**
```json
{
  "categoria": "Backend",
  "probabilidad": 0.89,
  "informacionAdicional": ["Java", "Spring Boot", "API REST"],
  "modeloUtilizado": "TF-IDF + LogisticRegression",
  "tiempoProcesamientoMs": 45
}
```

**Respuesta de error - Validación (400):**
```json
{
  "timestamp": "2024-01-15T10:30:00",
  "status": 400,
  "error": "Validation Failed",
  "message": "Invalid input parameters",
  "path": "/api/contenido",
  "validationErrors": {
    "titulo": "Title is required",
    "texto": "Text content is required"
  }
}
```

**Respuesta de error - Servidor (500):**
```json
{
  "timestamp": "2024-01-15T10:30:00",
  "status": 500,
  "error": "Internal Server Error",
  "message": "Error processing content with ML model",
  "path": "/api/contenido"
}
```

### Clasificar Contenido en Lote
```http
POST /api/contenido/batch
Content-Type: application/json

[
  {
    "titulo": "Spring Boot Security",
    "texto": "Configuración de JWT y OAuth2 en Spring Boot"
  },
  {
    "titulo": "React Hooks",
    "texto": "Uso avanzado de useState, useEffect, useContext"
  }
]
```

**Respuesta (200):**
```json
[
  {
    "categoria": "Backend",
    "probabilidad": 0.92,
    "informacionAdicional": ["Java", "Spring", "Security"],
    "modeloUtilizado": "TF-IDF + LogisticRegression",
    "tiempoProcesamientoMs": 38
  },
  {
    "categoria": "Frontend",
    "probabilidad": 0.87,
    "informacionAdicional": ["React", "Hooks", "JavaScript"],
    "modeloUtilizado": "TF-IDF + LogisticRegression",
    "tiempoProcesamientoMs": 42
  }
]
```

## Categorías Soportadas

| Categoría | Descripción | Ejemplos de Palabras Clave |
|-----------|-------------|---------------------------|
| **Backend** | APIs, microservicios, bases de datos | spring, java, api, rest, microservicio, nodejs, python |
| **Frontend** | UI, frameworks web, CSS/JS | react, vue, angular, javascript, typescript, css, html |
| **DevOps** | CI/CD, contenedores, cloud | docker, kubernetes, ci/cd, aws, azure, terraform |
| **Data Science** | ML, análisis de datos, IA | python, machine learning, pandas, tensorflow, pytorch |
| **Seguridad** | Auth, criptografía, vulnerabilidades | oauth, jwt, seguridad, cifrado, owasp |
| **Base de Datos** | SQL, NoSQL, modelado | postgresql, mongodb, sql, redis, elasticsearch |

## Configuración (`application.yml`)

```yaml
spring:
  application:
    name: techmind-api
  servlet:
    multipart:
      max-file-size: 10MB
      max-request-size: 10MB

server:
  port: 8080
  servlet:
    context-path: /api

python:
  executable: python3
  model:
    script-path: src/main/python/predict.py
    path: models/modelo.pkl
    vectorizer-path: models/vectorizer.pkl
  timeout-seconds: 30

logging:
  level:
    com.team70: DEBUG
    org.springframework.web: DEBUG
```

### Variables de Entorno (Producción)

```bash
export PYTHON_EXECUTABLE=python3
export MODEL_PATH=/app/models/modelo.pkl
export VECTORIZER_PATH=/app/models/vectorizer.pkl
export PYTHON_SCRIPT_PATH=/app/python/predict.py
export JAVA_OPTS="-Xms512m -Xmx1024m"
```

## Entrenamiento del Modelo (Google Colab / Local)

El script `src/main/python/train_model.py` incluye:

1. **Dataset de ejemplo**: ~64 muestras etiquetadas en 6 categorías
2. **Pipeline**: TF-IDF (1-2 grams, max 5000 features) + LogisticRegression
3. **Validación**: Train/Test split 80/20 estratificado
4. **Métricas**: Classification report, confusion matrix, accuracy
5. **Serialización**: `joblib.dump()` para modelo y vectorizador

### Métricas Esperadas (Cross-Validation 5-fold)

| Métrica | Valor |
|---------|-------|
| Accuracy | ~0.87 |
| Macro F1 | ~0.85 |
| Weighted F1 | ~0.87 |

### Personalizar Entrenamiento

```python
# En train_model.py, modificar:
training_data = [...]  # Tus propios datos
# O cargar desde CSV:
# df = pd.read_csv('mis_datos.csv')
```

## Integración con OCI (Oracle Cloud Infrastructure)

### Servicios Recomendados

| Servicio OCI | Uso |
|--------------|-----|
| **Object Storage** | Almacenar `modelo.pkl` y `vectorizer.pkl` versionados |
| **OCI Compute / OKE** | Hostear la API (VM o Kubernetes) |
| **OCI Functions** | Procesamiento serverless por lotes |
| **Autonomous Database** | Persistir resultados de clasificación |
| **Logging / Monitoring** | Observabilidad en producción |

### Ejemplo: Subir modelos a Object Storage

```bash
# Configurar OCI CLI
oci setup config

# Crear bucket
oci os bucket create --name techmind-models --compartment-id <OCID>

# Subir modelos
oci os object put --bucket-name techmind-models --file models/modelo.pkl
oci os object put --bucket-name techmind-models --file models/vectorizer.pkl
```

### Configurar API para leer desde OCI

En `application.yml`:
```yaml
oci:
  object-storage:
    namespace: <namespace>
    bucket: techmind-models
    region: us-phoenix-1
```

En `PythonModelService.java`, implementar descarga al inicio.

## Testing

### Tests Unitarios (Maven)
```bash
cd API/API
./mvnw test
```

### Tests Manuales (cURL)

```bash
# Health check
curl -s http://localhost:8080/api/contenido/health | jq .

# Clasificación simple
curl -s -X POST http://localhost:8080/api/contenido \
  -H "Content-Type: application/json" \
  -d '{"titulo":"Docker Tutorial","texto":"Aprende a contenerizar aplicaciones con Docker y Kubernetes"}' | jq .

# Batch
curl -s -X POST http://localhost:8080/api/contenido/batch \
  -H "Content-Type: application/json" \
  -d '[{"titulo":"Test 1","texto":"Spring Boot REST"},{"titulo":"Test 2","texto":"React Hooks"}]' | jq .
```

## Troubleshooting

| Problema | Solución |
|----------|----------|
| `Model files not found` | Ejecutar `python3 src/main/python/train_model.py` |
| `python3: command not found` | Instalar Python 3.9+ y agregar al PATH |
| `Timeout ejecutando Python` | Aumentar `python.timeout-seconds` en `application.yml` |
| `Puerto 8080 en uso` | Cambiar `server.port` en `application.yml` |
| `Error de codificación JSON` | Verificar que el input no tenga caracteres de control |

## Contenedorización (Docker)

### Dockerfile Multi-stage

El `Dockerfile` incluye 3 stages:
1. **builder** - Maven compile + package
2. **python-builder** - Instalar deps Python + entrenar modelo
3. **runtime** - Imagen Alpine ligera con Java 17 JRE + Python 3

### Construir y Ejecutar

```bash
# Build
docker build -t techmind-api .

# Run
docker run -p 8080:8080 techmind-api

# Con docker-compose (recomendado)
docker-compose up --build
```

## Próximas Mejoras

- [ ] Persistencia en base de datos (PostgreSQL / Oracle Autonomous DB)
- [ ] Búsqueda semántica con embeddings (sentence-transformers)
- [ ] Recomendación de contenidos relacionados
- [ ] Autenticación OAuth2 / JWT
- [ ] Rate limiting (Bucket4j / Resilience4j)
- [ ] Métricas Prometheus + Grafana dashboard
- [ ] CI/CD con GitHub Actions / OCI DevOps
- [ ] Documentación OpenAPI/Swagger UI
- [ ] Tests de integración con Testcontainers

## Licencia

Proyecto desarrollado para Hackathon TechMind - Equipo 70 (G9-LATAM)

## Contacto

Para dudas técnicas, consultar la documentación del proyecto o contactar al equipo de desarrollo.
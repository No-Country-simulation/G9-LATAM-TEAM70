# Pruebas Locales - TechMind API

## Prerrequisitos

- JDK 25.0.1 LTS
- MySQL con una base de datos llamada `TechMind_db`
- Python 3.10+ con las dependencias de `src/main/python/requirements.txt`
- Los modelos `.pkl` generados (ejecutar `train_model.py`)

La API consume el modelo de Machine Learning desde un servicio Python/FastAPI
independiente (`predict.py`), configurado mediante `ML_SERVICE_URL` y
`ML_SERVICE_ENABLED`.

## Generar los modelos `.pkl`

```powershell
cd API/API/src/main/python
python -m pip install -r requirements.txt
python train_model.py
```

Esto genera `API/API/models/modelo.pkl` y `API/API/models/vectorizer.pkl`.

## 1. Configurar variables de entorno

En PowerShell:

```powershell
$env:DB_PASSWORD = "tu_contrasena_mysql"
$env:ML_SERVICE_ENABLED = "true"
$env:ML_SERVICE_URL = "http://localhost:5000"
$env:JWT_SECRET = "una-clave-secreta-segura-de-al-menos-32-caracteres"
```

Lanza el servicio de Machine Learning en otra terminal:

```powershell
cd API/API/src/main/python
python -m uvicorn predict:app --host 0.0.0.0 --port 5000
```

Si `ML_SERVICE_URL` no se define, la API intenta conectarse a
`http://localhost:5000`. Si `ML_SERVICE_ENABLED` es `false` (o el servicio no
responde), la API usa un fallback heurístico (`Reglas locales`).

## 2. Ejecutar pruebas automatizadas

```powershell
cd API/API
.\mvnw.cmd test
```

## 3. Compilar y ejecutar la API

```powershell
cd API/API
.\mvnw.cmd spring-boot:run
```

Como alternativa:

```powershell
.\mvnw.cmd clean package
java -jar target/API-0.0.1-SNAPSHOT.jar
```

La API queda disponible en `http://localhost:8080/api`.

## 4. Probar endpoints

### Health check

```powershell
curl.exe http://localhost:8080/api/contenido/health
```

```json
{
  "status": "UP",
  "service": "techmind-api",
  "timestamp": "2026-07-25T12:00:00"
}
```

### Autenticación

Los endpoints de contenido se exponen con autenticación **abierta** en la
configuración actual (`SecurityConfig` permite todas las rutas). El login JWT
está disponible por si se habilita seguridad:
`POST /api/auth/login` (usuario `admin` / contraseña `admin123`):

```text
Authorization: Bearer <token>
```

### Clasificar contenido

```powershell
curl.exe -X POST http://localhost:8080/api/contenido `
  -H "Content-Type: application/json" `
  -d '{"title":"Introduccion a Spring Boot","content":"Conceptos para crear APIs REST con Java y Spring Boot."}'
```

```json
{
  "category": "Backend",
  "score": 0.92,
  "keywords": ["Java", "Spring Boot", "API REST"],
  "modelUsed": "Servicio ML externo",
  "processingTimeMs": 38,
  "inputId": 1,
  "outputId": 1
}
```

### Procesamiento en lote

```powershell
curl.exe -X POST http://localhost:8080/api/contenido/batch `
  -H "Content-Type: application/json" `
  -d '[{"title":"Spring Security","content":"Autenticacion y autorizacion con JWT."},{"title":"React Hooks","content":"useState y useEffect para interfaces."}]'
```

## Solución de problemas

| Problema | Solución |
|---|---|
| No se conecta a MySQL | Verifica que MySQL esté activo, que exista `TechMind_db` y que `DB_PASSWORD` sea correcto. |
| Error al procesar contenido | Confirma que el servicio indicado por `ML_SERVICE_URL` esté disponible y exponga `/predict` y `/predict/batch`. |
| Error 401 | Inicia sesión y envía un JWT válido en `Authorization: Bearer <token>`. |
| Puerto 8080 ocupado | Define otro puerto con `--server.port=<puerto>` al iniciar la aplicación. |

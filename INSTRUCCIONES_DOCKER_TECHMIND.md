# Instrucciones de Docker para TechMind

## 1. Antes de comenzar

Abre **Docker Desktop** y espera a que el motor esté en ejecución.

El proyecto se compone de tres contenedores:

- `techmind-api`: aplicación TechMind (Spring Boot).
- `ml-service`: servicio de Machine Learning en Python/FastAPI que consume
  los modelos `.pkl`.
- `mysql-db`: base de datos MySQL.

## 2. Abrir una terminal en el proyecto

En PowerShell:

```powershell
cd "C:\Users\alex_\OneDrive\Escritorio\G9-LATAM-TEAM70\API\API"
```

## 3. (Solo la primera vez) Generar los modelos `.pkl`

Los archivos de modelo (`models/modelo.pkl` y `models/vectorizer.pkl`) se
generan entrenando el modelo con el script Python. Opcional — el repositorio
ya incluye dichos modelos y también se pueden regenerar con Docker:

```powershell
docker compose --profile training run --rm model-trainer
```

Esto ejecuta `train_model.py`, entrena una TF-IDF + Regresión Logística sobre
48 muestras de contenido técnico y guarda los modelos en `./models`.

> Nota: el volumen `ml-service` y `techmind-api` montan la carpeta `./models`
> de forma de solo lectura, por lo que es necesario generar los `.pkl`
> **antes** de arrancar el stack si no existen.

## 4. Construir y arrancar el proyecto

```powershell
docker compose up -d --build
```

La primera ejecución tarda varios minutos (descarga imágenes y dependencias).

## 5. Comprobar el estado

```powershell
docker compose ps
```

Los tres servicios (`techmind-api`, `ml-service`, `mysql-db`) deben aparecer
con estado `healthy`.

Puedes comprobar la API desde el navegador:

- Estado API: http://localhost:8080/api/contenido/health
- Swagger: http://localhost:8080/api/swagger-ui/index.html
- Servicio ML: http://localhost:5000/health
- Aplicación: http://localhost:8080

## 6. Probar la API desde Swagger

1. Abre Swagger.
2. Despliega `POST /contenido`.
3. Pulsa **Try it out**.
4. Usa este ejemplo:

```json
{
  "title": "Introducción a Docker",
  "content": "Aprende a desplegar aplicaciones Java utilizando Docker y contenedores."
}
```

5. Pulsa **Execute**.

La respuesta debe incluir una categoría, puntuación, palabras clave e
identificadores de base de datos. El valor `modelUsed` debe ser
`TF-IDF + LogisticRegression` (modelo real), no `Reglas locales`.

## 7. Probar desde la línea de comandos

```powershell
# Clasificar contenido
curl.exe -X POST http://localhost:8080/api/contenido `
  -H "Content-Type: application/json" `
  -d '{"title":"Introduccion a Spring Boot","content":"APIs REST con Java y Spring Boot"}'

# Procesamiento en lote
curl.exe -X POST http://localhost:8080/api/contenido/batch `
  -H "Content-Type: application/json" `
  -d '[{"title":"React","content":"Interfaz con hooks"},{"title":"Docker","content":"Contenedores"}]'
```

## 8. Consultar los registros

```powershell
docker compose logs -f techmind-api
docker compose logs -f ml-service
docker compose logs -f mysql-db
```

## 9. Detener y volver a arrancar

```powershell
docker compose down
docker compose up -d
```

Los datos de MySQL se guardan en el volumen `mysql-data`.

## 10. Aplicar cambios del código

Tras modificar código Java aunque los modelos ya existen:

```powershell
docker compose up -d --build
```

## 11. Reiniciar un servicio

```powershell
docker compose restart techmind-api
docker compose restart ml-service
docker compose restart mysql-db
```

## 12. Borrar completamente la base de datos local

> Advertencia: elimina los datos de MySQL dentro de Docker.

```powershell
docker compose down --volumes
docker compose up -d
```

## 13. Problemas frecuentes

### «Cannot downgrade from 80411 to 80046»
El volumen de MySQL fue creado por una versión distinta. Elimínalo y recrea:

```powershell
docker compose down
docker volume rm $(docker volume ls -q | Select-String mysql-data)
docker compose up -d
```

### `docker` no se reconoce como comando
Reinicia PowerShell o Windows tras instalar Docker Desktop.

### Swagger o la API no abren
```powershell
docker compose ps
docker compose logs --tail 100 techmind-api
```

### El puerto 8080 ya está ocupado
```powershell
$env:API_PORT="8081"
docker compose up -d
```

### El modelo se reporta como «Reglas locales»
Significa que `ml-service` no está disponible (o `ML_SERVICE_ENABLED=false`).
Comprueba `docker compose ps` y los logs del `ml-service`.
# Ejecutar TechMind con Docker

## Configuración local

Desde la raíz del repositorio:

```powershell
Copy-Item .env.example .env
```

Edita `.env` y define contraseñas seguras. Para evitar usar el puerto 80 localmente, cambia `APP_PORT=5173`.

```powershell
docker compose config
docker compose up --build -d
docker compose ps
```

Abre `http://localhost:5173/` si configuraste ese puerto, o `http://localhost/` si usas el predeterminado.

## Prueba funcional

```powershell
$body = @{ title = 'Guía Docker'; content = 'Despliegue de aplicaciones con contenedores.' } | ConvertTo-Json
Invoke-WebRequest -Method POST -Uri http://localhost:5173/api/contenido -ContentType 'application/json' -Body $body
```

Las rutas de API se sirven detrás del frontend. Swagger está en `/api/swagger-ui/index.html` mientras esté habilitado.

## Operación

```powershell
docker compose logs -f techmind-api
docker compose down
docker compose up --build -d
```

No uses `docker compose down -v` salvo que quieras borrar la base de datos local. Para OCI, consulta [infra/OCI_DEPLOYMENT.md](infra/OCI_DEPLOYMENT.md).

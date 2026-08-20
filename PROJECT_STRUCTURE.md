# Estructura actual de TechMind

```text
backend/    API Spring Boot, migraciones Flyway y servicio ML Python
frontend/   SPA React y configuración Nginx
data/       modelos reales, datasets, notebooks y referencias
infra/      operación local y despliegue en OCI
compose.yml servicios MySQL, ML, API y frontend
```

La aplicación se inicia desde la raíz con Docker Compose. Consulta `INSTRUCCIONES_DOCKER_TECHMIND.md` para uso local e `infra/OCI_DEPLOYMENT.md` para OCI.

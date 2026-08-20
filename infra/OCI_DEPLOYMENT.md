# Despliegue en Oracle Cloud Infrastructure

Esta guía prepara una instancia OCI Compute Linux para ejecutar TechMind con Docker Compose. El stack publica únicamente el frontend/Nginx; MySQL, la API Java y el servicio de modelos permanecen en la red privada de Docker.

## Requisitos de la instancia

- Ubuntu 22.04/24.04 o Oracle Linux 8/9.
- 2 vCPU, 4 GB de RAM y 25 GB libres como mínimo.
- Docker Engine con el complemento Docker Compose v2.
- En la lista de seguridad o NSG de OCI: abrir TCP `80` (y `443` cuando haya TLS). Mantener SSH `22` restringido a las IP del equipo.

## Primera instalación

```bash
git clone <URL-DEL-REPOSITORIO> techmind
cd techmind
cp .env.example .env
chmod 600 .env
nano .env
docker compose config
docker compose up --build -d
docker compose ps
```

Reemplaza ambas contraseñas del archivo `.env` antes de iniciar. Deben ser distintas, largas y no deben subirse al repositorio. `APP_PORT=80` permite acceder con `http://IP_PUBLICA_DE_OCI/`.

## Verificación

```bash
curl -fsS http://localhost/api/contenido/health
curl -fsS -X POST http://localhost/api/contenido \
  -H 'Content-Type: application/json' \
  -d '{"title":"Guía Docker","content":"Despliegue de aplicaciones con contenedores."}'
docker compose logs --tail=100 techmind-api ml-service frontend
```

Swagger queda disponible temporalmente en `http://IP_PUBLICA_DE_OCI/api/swagger-ui/index.html`. Para una demostración pública, conviene protegerlo con un proxy autenticado o desactivarlo después del evento.

## Operación y actualización

```bash
git pull --ff-only
docker compose up --build -d
docker image prune -f
```

La base de datos se conserva en el volumen administrado `mysql-data`. Antes de actualizar producción, crea una copia lógica:

```bash
mkdir -p backups
docker compose exec -T mysql-db sh -c 'exec mysqldump -uroot -p"$MYSQL_ROOT_PASSWORD" TechMind_db' > backups/techmind-$(date +%F).sql
```

Para detener el stack sin eliminar datos: `docker compose down`. No uses `docker compose down -v` en producción salvo que quieras eliminar intencionalmente la base de datos.

## TLS y dominio

El compose publica HTTP. Para un dominio público, coloca un proxy TLS administrado (OCI Load Balancer, Caddy o Nginx con certificados Let's Encrypt) delante del puerto 80 y permite solamente los puertos requeridos por ese proxy. No expongas 3306, 5000 ni 8080 al exterior.

# Flujo de trabajo del equipo

## Estructura del repositorio

- `backend/`: API Spring Boot y servicio Python de clasificación.
- `frontend/`: aplicación React/Vite y Nginx de producción.
- `data/`: modelos PKL, datasets, notebooks y referencias.
- `infra/`: configuración y guía de despliegue OCI.
- `compose.yml`: stack completo de Docker.

No se deben crear nuevamente las carpetas antiguas `API/API`, `DataScience` ni duplicar los modelos dentro de `backend/`.

## Antes de trabajar

```bash
git switch main
git pull --ff-only origin main
git switch -c tipo/cambio-breve
```

Usa `feat/`, `fix/`, `docs/` o `chore/` como prefijo. No desarrolles directamente sobre `main`.

## Antes de publicar cambios

```bash
git status
git diff --check
cd backend && ./mvnw test
cd ../frontend && npm run build
```

No subas `.env`, `node_modules`, `target`, `dist`, logs ni archivos de base de datos generados. Usa `.env.example` como plantilla de variables.

## Actualización después de esta reorganización

Quien tenga cambios locales previos debe guardarlos en una rama o stash antes de actualizar:

```bash
git status
git stash push -u -m "trabajo antes de reorganizacion"
git pull --ff-only origin main
git stash pop
```

Si el `stash pop` presenta conflictos por rutas antiguas, conserva el cambio funcional y muévelo a la carpeta nueva correspondiente; no restaures directorios antiguos completos.

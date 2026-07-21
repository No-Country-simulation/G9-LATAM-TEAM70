# Dockerfile multi-stage para TechMind API
# Stage 1: Build de la aplicación Java con Maven
FROM maven:3.9.6-eclipse-temurin-17 AS builder

WORKDIR /app

# Copiar archivos de configuración Maven
COPY pom.xml .
COPY .mvn .mvn
COPY mvnw .
COPY mvnw.cmd .

# Descargar dependencias (cache layer)
RUN ./mvnw dependency:go-offline -B

# Copiar código fuente
COPY src src

# Build del JAR (skip tests para velocidad)
RUN ./mvnw clean package -DskipTests -B

# Stage 2: Runtime con Python + Java
FROM eclipse-temurin:17-jre-alpine AS runtime

# Instalar Python y dependencias del sistema
RUN apk add --no-cache \
    python3 \
    py3-pip \
    bash \
    && ln -sf python3 /usr/bin/python

# Crear usuario no-root para seguridad
RUN addgroup -g 1001 -S appgroup && \
    adduser -u 1001 -S appuser -G appgroup

WORKDIR /app

# Copiar JAR desde builder
COPY --from=builder /app/target/*.jar app.jar

# Copiar scripts Python y requirements
COPY src/main/python/ ./python/
COPY src/main/python/requirements.txt ./python/requirements.txt

# Instalar dependencias Python
RUN pip3 install --no-cache-dir -r ./python/requirements.txt

# Crear directorio para modelos
RUN mkdir -p ./models && chown -R appuser:appgroup ./models ./python

# Cambiar a usuario no-root
USER appuser

# Exponer puerto
EXPOSE 8080

# Variables de entorno
ENV JAVA_OPTS="-Xms512m -Xmx1024m -XX:+UseG1GC" \
    PYTHONUNBUFFERED=1 \
    PYTHONPATH=/app/python \
    MODEL_PATH=/app/models/modelo.pkl \
    VECTORIZER_PATH=/app/models/vectorizer.pkl \
    PYTHON_SCRIPT_PATH=/app/python/predict.py

# Health check
HEALTHCHECK --interval=30s --timeout=10s --start-period=40s --retries=3 \
    CMD wget --no-verbose --tries=1 --spider http://localhost:8080/api/contenido/health || exit 1

# Entry point
ENTRYPOINT ["sh", "-c", "java $JAVA_OPTS -jar app.jar"]
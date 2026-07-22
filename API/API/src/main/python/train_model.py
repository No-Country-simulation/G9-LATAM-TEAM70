#!/usr/bin/env python3
"""
Script de entrenamiento para el modelo de clasificación de contenido técnico.
Diseñado para ejecutarse en Google Colab o localmente.
Genera dos archivos .pkl:
- modelo.pkl: Modelo LogisticRegression entrenado
- vectorizer.pkl: Vectorizador TF-IDF ajustado

Uso en Google Colab:
1. Subir este script a Colab
2. Ejecutar todas las celdas
3. Descargar los archivos .pkl generados
4. Colocarlos en la carpeta models/ del proyecto Java
"""

import pandas as pd
import numpy as np
import pickle
import json
import warnings
warnings.filterwarnings('ignore')

from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.linear_model import LogisticRegression
from sklearn.model_selection import train_test_split
from sklearn.metrics import classification_report, confusion_matrix
from sklearn.pipeline import Pipeline
import re


# ============================================================
# 1. DATOS DE ENTRENAMIENTO DE EJEMPLO
# ============================================================
# En producción, reemplazar esto con datos reales de fuentes públicas,
# documentación técnica, artículos, etc.

training_data = [
    # Backend
    {"titulo": "Introducción a Spring Boot", "texto": "En este contenido se presentan los conceptos básicos para la creación de APIs REST utilizando Java y Spring Boot. Aprenderás a configurar controladores, servicios y repositorios.", "categoria": "Backend"},
    {"titulo": "Microservicios con Spring Cloud", "texto": "Arquitectura de microservicios usando Spring Cloud Netflix Eureka, Config Server y Gateway. Patrones de resiliencia con Circuit Breaker y Rate Limiting.", "categoria": "Backend"},
    {"titulo": "Node.js Express API REST", "texto": "Construcción de APIs RESTful con Node.js y Express. Middleware, routing, validación de datos y manejo de errores. Conexión con MongoDB usando Mongoose.", "categoria": "Backend"},
    {"titulo": "Python FastAPI Tutorial", "texto": "Desarrollo de APIs modernas con FastAPI. Validación automática con Pydantic, documentación OpenAPI/Swagger, inyección de dependencias y testing con pytest.", "categoria": "Backend"},
    {"titulo": "Java Spring Data JPA", "texto": "Persistencia de datos con Spring Data JPA. Repositorios, consultas derivadas, @Query, especificaciones, paginación y auditoría de entidades.", "categoria": "Backend"},
    {"titulo": "GraphQL con Spring Boot", "texto": "Implementación de GraphQL en Spring Boot. Schemas, resolvers, DataFetchers, suscripciones y federación de esquemas.", "categoria": "Backend"},
    {"titulo": "ASP.NET Core Web API", "texto": "Creación de APIs REST con ASP.NET Core. Controladores, dependency injection, Entity Framework Core, autenticación JWT y versionado de API.", "categoria": "Backend"},
    {"titulo": "Go Gin Framework", "texto": "Desarrollo de APIs de alto rendimiento con Go y Gin. Middleware, validación, binding JSON, grupos de rutas y testing.", "categoria": "Backend"},
    
    # Frontend
    {"titulo": "React Hooks Avanzados", "texto": "Uso avanzado de useState, useEffect, useContext, useReducer, useCallback, useMemo y custom hooks. Patrones de composición y optimización.", "categoria": "Frontend"},
    {"titulo": "Vue 3 Composition API", "texto": "Nueva Composition API de Vue 3. Reactive, ref, computed, watch, provide/inject y composables. Migración desde Options API.", "categoria": "Frontend"},
    {"titulo": "Next.js App Router", "texto": "Nuevo App Router de Next.js 13+. Server Components, Server Actions, layouts anidados, streaming y metadata dinámica.", "categoria": "Frontend"},
    {"titulo": "TypeScript para React", "texto": "Tipado estático en aplicaciones React. Interfaces, types, generics, utility types, discriminated unions y tipado de hooks.", "categoria": "Frontend"},
    {"titulo": "Tailwind CSS Moderno", "texto": "Diseño utility-first con Tailwind CSS. Configuración, temas personalizados, dark mode, responsive design y plugins.", "categoria": "Frontend"},
    {"titulo": "State Management Redux Toolkit", "texto": "Gestión de estado global con Redux Toolkit. createSlice, createAsyncThunk, RTK Query para data fetching y middleware.", "categoria": "Frontend"},
    {"titulo": "Angular Signals", "texto": "Nueva reactividad en Angular con Signals. signal(), computed(), effect() y migración desde Zone.js. Mejora de rendimiento.", "categoria": "Frontend"},
    {"titulo": "SvelteKit Tutorial", "texto": "Framework compilador SvelteKit. File-based routing, server-side rendering, form actions y progressive enhancement.", "categoria": "Frontend"},
    
    # DevOps
    {"titulo": "Docker para Desarrolladores", "texto": "Contenerización de aplicaciones con Docker. Dockerfile, docker-compose, multi-stage builds, optimización de imágenes y mejores prácticas.", "categoria": "DevOps"},
    {"titulo": "Kubernetes Fundamentos", "texto": "Conceptos básicos de Kubernetes. Pods, Services, Deployments, ConfigMaps, Secrets, Ingress y Helm charts.", "categoria": "DevOps"},
    {"titulo": "CI/CD con GitHub Actions", "texto": "Automatización de pipelines con GitHub Actions. Workflows, jobs, steps, actions, matrix builds, caching y deployment a cloud.", "categoria": "DevOps"},
    {"titulo": "Terraform AWS Infrastructure", "texto": "Infraestructura como código con Terraform. Módulos, state management, workspaces, providers y mejores prácticas para AWS.", "categoria": "DevOps"},
    {"titulo": "Observabilidad con Prometheus Grafana", "texto": "Monitoreo y alerting con Prometheus y Grafana. Métricas, logs, traces, dashboards, alerting rules y service discovery.", "categoria": "DevOps"},
    {"titulo": "ArgoCD GitOps", "texto": "Despliegue continuo GitOps con ArgoCD. Applications, projects, sync policies, health assessment y rollback automático.", "categoria": "DevOps"},
    {"titulo": "Docker Swarm vs Kubernetes", "texto": "Comparativa de orquestadores. Docker Swarm para simplicidad, Kubernetes para escalabilidad. Casos de uso y migración.", "categoria": "DevOps"},
    {"titulo": "Helm Charts Avanzados", "texto": "Gestión de paquetes Kubernetes con Helm. Chart templates, values, dependencies, hooks, tests y chart museum.", "categoria": "DevOps"},
    
    # Data Science
    {"titulo": "Machine Learning con Scikit-Learn", "texto": "Algoritmos de ML supervisado y no supervisado. Preprocesamiento, feature engineering, model selection, cross-validation y hiperparámetros.", "categoria": "Data Science"},
    {"titulo": "Deep Learning TensorFlow Keras", "texto": "Redes neuronales con TensorFlow 2 y Keras. CNNs, RNNs, Transformers, transfer learning, callbacks y deployment con TensorFlow Serving.", "categoria": "Data Science"},
    {"titulo": "Análisis de Datos con Pandas", "texto": "Manipulación y análisis de datos con Pandas. DataFrames, groupby, merge, pivot tables, time series, visualización y exportación.", "categoria": "Data Science"},
    {"titulo": "NLP con Hugging Face Transformers", "texto": "Procesamiento de lenguaje natural con Transformers. BERT, GPT, fine-tuning, tokenización, pipelines y deployment con Inference API.", "categoria": "Data Science"},
    {"titulo": "MLOps con MLflow", "texto": "Ciclo de vida de ML con MLflow. Tracking, projects, models, registry, deployment y model monitoring en producción.", "categoria": "Data Science"},
    {"titulo": "Feature Engineering Avanzado", "texto": "Técnicas de ingeniería de características. Encoding, scaling, feature selection, dimensionality reduction, feature stores y automated feature engineering.", "categoria": "Data Science"},
    {"titulo": "Time Series Forecasting", "texto": "Predicción de series temporales. ARIMA, Prophet, LSTM, seasonal decomposition, cross-validation y evaluation metrics.", "categoria": "Data Science"},
    {"titulo": "Computer Vision OpenCV", "texto": "Visión por computadora con OpenCV. Image processing, object detection, face recognition, video analysis y deployment en edge.", "categoria": "Data Science"},
    
    # Seguridad
    {"titulo": "OAuth 2.0 y OpenID Connect", "texto": "Autorización y autenticación moderna. Flows de OAuth 2.0, OIDC, JWT tokens, refresh tokens, PKCE y mejores prácticas de seguridad.", "categoria": "Seguridad"},
    {"titulo": "Spring Security JWT", "texto": "Seguridad en Spring Boot con JWT. Configuración de filtros, authentication manager, authority mapping, method security y OAuth2 resource server.", "categoria": "Seguridad"},
    {"titulo": "OWASP Top 10 Mitigación", "texto": "Las 10 vulnerabilidades web más críticas. Injection, broken auth, sensitive data exposure, XXE, broken access control y mitigaciones.", "categoria": "Seguridad"},
    {"titulo": "Criptografía Aplicada", "texto": "Cifrado simétrico y asimétrico. AES, RSA, ECC, hash functions, digital signatures, certificates, TLS/SSL y key management.", "categoria": "Seguridad"},
    {"titulo": "Zero Trust Architecture", "texto": "Arquitectura Zero Trust. Never trust always verify, micro-segmentation, identity-based access, continuous verification y policy engine.", "categoria": "Seguridad"},
    {"titulo": "DevSecOps Pipeline", "texto": "Integración de seguridad en CI/CD. SAST, DAST, SCA, container scanning, secret detection, policy as code y compliance automation.", "categoria": "Seguridad"},
    {"titulo": "API Security Best Practices", "texto": "Seguridad de APIs. Rate limiting, authentication, authorization, input validation, output encoding, CORS, CSP y API gateway patterns.", "categoria": "Seguridad"},
    {"titulo": "Penetration Testing Web", "texto": "Testing de penetración de aplicaciones web. Reconocimiento, scanning, exploitation, post-exploitation, reporting y remediation.", "categoria": "Seguridad"},
    
    # Base de Datos
    {"titulo": "PostgreSQL Avanzado", "texto": "Características avanzadas de PostgreSQL. Índices, particionamiento, JSONB, full-text search, advisory locks, logical replication y tuning.", "categoria": "Base de Datos"},
    {"titulo": "MongoDB Aggregation Pipeline", "texto": "Pipeline de agregación de MongoDB. $match, $group, $lookup, $unwind, $project, $facet, optimización y performance tuning.", "categoria": "Base de Datos"},
    {"titulo": "Redis Caching Patterns", "texto": "Patrones de caching con Redis. Cache-aside, write-through, write-behind, refresh-ahead, TTL strategies, clustering y high availability.", "categoria": "Base de Datos"},
    {"titulo": "Diseño de Esquemas SQL", "texto": "Modelado de datos relacional. Normalización, denormalización, relaciones, constraints, indexing strategy y naming conventions.", "categoria": "Base de Datos"},
    {"titulo": "Cassandra Data Modeling", "texto": "Modelado para Cassandra. Query-driven design, partition keys, clustering keys, compaction strategies, TTL y counters.", "categoria": "Base de Datos"},
    {"titulo": "Elasticsearch Search Engine", "texto": "Motor de búsqueda Elasticsearch. Inverted index, analyzers, query DSL, aggregations, clustering, scaling y relevance tuning.", "categoria": "Base de Datos"},
    {"titulo": "Database Migration Strategies", "texto": "Estrategias de migración de bases de datos. Blue-green, strangle fig, dual write, CDC, schema evolution y rollback procedures.", "categoria": "Base de Datos"},
    {"titulo": "Graph Databases Neo4j", "texto": "Bases de datos de grafos con Neo4j. Cypher query language, node/relationship modeling, graph algorithms, traversals y recomendaciones.", "categoria": "Base de Datos"},
]


def preprocess_text(text):
    """Preprocesa el texto para el modelo"""
    if not text:
        return ""
    text = text.lower().strip()
    text = re.sub(r'[^\w\s]', ' ', text)
    text = re.sub(r'\s+', ' ', text)
    return text


def prepare_data(data):
    """Prepara los datos para entrenamiento"""
    df = pd.DataFrame(data)
    
    # Combinar título y texto
    df['combined'] = df['titulo'] + ' ' + df['texto']
    df['processed'] = df['combined'].apply(preprocess_text)
    
    return df


def train_model(df):
    """Entrena el modelo TF-IDF + LogisticRegression"""
    X = df['processed']
    y = df['categoria']
    
    # Split
    X_train, X_test, y_train, y_test = train_test_split(
        X, y, test_size=0.2, random_state=42, stratify=y
    )
    
    # Pipeline TF-IDF + LogisticRegression
    pipeline = Pipeline([
        ('tfidf', TfidfVectorizer(
            max_features=5000,
            ngram_range=(1, 2),
            stop_words=None,  # No stop words para términos técnicos
            min_df=1,
            max_df=0.95,
            sublinear_tf=True
        )),
        ('clf', LogisticRegression(
            max_iter=1000,
            C=1.0,
            class_weight='balanced',
            random_state=42,
            solver='lbfgs'
        ))
    ])
    
    # Entrenar
    pipeline.fit(X_train, y_train)
    
    # Evaluar
    y_pred = pipeline.predict(X_test)
    
    print("\n=== REPORTE DE CLASIFICACIÓN ===")
    print(classification_report(y_test, y_pred))
    
    print("\n=== MATRIZ DE CONFUSIÓN ===")
    cm = confusion_matrix(y_test, y_pred)
    print(cm)
    
    # Accuracy
    accuracy = (y_pred == y_test).mean()
    print(f"\nAccuracy: {accuracy:.4f}")
    
    return pipeline, X_test, y_test


def save_model(pipeline, model_path, vectorizer_path):
    """Guarda el modelo y vectorizador por separado"""
    # Extraer componentes del pipeline
    vectorizer = pipeline.named_steps['tfidf']
    classifier = pipeline.named_steps['clf']
    
    # Guardar vectorizador
    with open(vectorizer_path, 'wb') as f:
        pickle.dump(vectorizer, f)
    print(f"\nVectorizador guardado en: {vectorizer_path}")
    
    # Guardar clasificador
    with open(model_path, 'wb') as f:
        pickle.dump(classifier, f)
    print(f"Modelo guardado en: {model_path}")
    
    # También guardar el pipeline completo para referencia
    pipeline_path = model_path.replace('.pkl', '_pipeline.pkl')
    with open(pipeline_path, 'wb') as f:
        pickle.dump(pipeline, f)
    print(f"Pipeline completo guardado en: {pipeline_path}")


def test_model(pipeline):
    """Prueba el modelo con ejemplos"""
    test_cases = [
        {"titulo": "Spring Boot Security", "texto": "Configuración de JWT y OAuth2 en Spring Boot para APIs seguras"},
        {"titulo": "React Performance", "texto": "Optimización de rendimiento en React con useMemo y useCallback"},
        {"titulo": "Docker Kubernetes", "texto": "Despliegue de contenedores en Kubernetes con Helm charts"},
        {"titulo": "Machine Learning", "texto": "Entrenamiento de modelos de clasificación con scikit-learn"},
        {"titulo": "PostgreSQL Index", "texto": "Tipos de índices en PostgreSQL y cuándo usar cada uno"},
    ]
    
    print("\n=== PRUEBAS DEL MODELO ===")
    for test in test_cases:
        combined = test['titulo'] + ' ' + test['texto']
        processed = preprocess_text(combined)
        pred = pipeline.predict([processed])[0]
        prob = pipeline.predict_proba([processed])[0].max()
        print(f"  '{test['titulo']}' -> {pred} ({prob:.4f})")


def main():
    print("=== ENTRENAMIENTO DEL MODELO DE CLASIFICACIÓN TÉCNICA ===\n")
    
    # Preparar datos
    print("1. Preparando datos...")
    df = prepare_data(training_data)
    print(f"   Total muestras: {len(df)}")
    print(f"   Categorías: {df['categoria'].unique()}")
    print(f"   Distribución:\n{df['categoria'].value_counts()}")
    
    # Entrenar
    print("\n2. Entrenando modelo...")
    pipeline, X_test, y_test = train_model(df)
    
    # Probar
    test_model(pipeline)
    
    # Guardar
    print("\n3. Guardando modelos...")
    save_model(
        pipeline, 
        'modelo.pkl', 
        'vectorizer.pkl'
    )
    
    # Guardar metadata
    metadata = {
        "model_type": "TF-IDF + LogisticRegression",
        "vectorizer_params": {
            "max_features": 5000,
            "ngram_range": [1, 2],
            "min_df": 1,
            "max_df": 0.95,
            "sublinear_tf": True
        },
        "classifier_params": {
            "max_iter": 1000,
            "C": 1.0,
            "class_weight": "balanced",
            "solver": "lbfgs",
            "multi_class": "multinomial"
        },
        "categories": sorted(df['categoria'].unique().tolist()),
        "training_samples": len(df),
        "test_accuracy": float((pipeline.predict(X_test) == y_test).mean())
    }
    
    with open('model_metadata.json', 'w', encoding='utf-8') as f:
        json.dump(metadata, f, indent=2, ensure_ascii=False)
    print("Metadatos guardados en: model_metadata.json")
    
    print("\n=== ENTRENAMIENTO COMPLETADO ===")
    print("Archivos generados:")
    print("  - modelo.pkl (clasificador)")
    print("  - vectorizer.pkl (vectorizador TF-IDF)")
    print("  - modelo_pipeline.pkl (pipeline completo)")
    print("  - model_metadata.json (metadatos)")
    print("\nCopie estos archivos a la carpeta models/ del proyecto Java")


if __name__ == "__main__":
    main()
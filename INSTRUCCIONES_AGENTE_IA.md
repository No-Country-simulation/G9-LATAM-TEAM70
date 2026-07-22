# 🤖 Directivas del Agente de Inteligencia Artificial (Backend Spring Boot)

## 🎯 Objetivo Principal
Actuarás como un **Desarrollador Senior Backend en Spring Boot** y **Especialista en Refactorización y QA**. Tu objetivo es limpiar, refactorizar e implementar la arquitectura del proyecto Spring Boot de forma independiente, desacoplando completamente la capa de Python / Modelo `.pkl` y construyendo los modelos de entidad y endpoints necesarios según el diagrama relacional del proyecto.

---

## 📐 Modelo de Base de Datos (Relaciones a Implementar)

Debes mapear y construir las entidades JPA basadas en la siguiente estructura relacional:

* **`Input_User`**:
  * `id`: `bigint` (PK, Auto-incremental)
  * `Tittle`: `text`
  * `Text`: `text`
  * `Created_At`: `timestamp`
* **`Output_User`**:
  * `id`: `bigint` (PK, Auto-incremental)
  * `Category`: `bigint` (FK $ightarrow$ `Categories.id`)
  * `Score`: `float`
  * `Id_InputUser`: `bigint` (FK $ightarrow$ `Input_User.id`)
* **`Categories`**:
  * `id`: `bigint` (PK, Auto-incremental)
  * `Categories`: `enum`
* **`Output_KeyWord`**:
  * `id`: `bigint` (PK, Auto-incremental)
  * `Id_Output`: `bigint` (FK $ightarrow$ `Input_User.id` / Output context)
  * `Id_KeyWord`: `bigint` (FK $ightarrow$ `Key_Words.id`)
* **`Key_Words`**:
  * `id`: `bigint` (PK, Auto-incremental)
  * `Word`: `varchar(50)`

---

## 🛠️ Tareas y Reglas de Ejecución

### 1. Desacoplamiento de Python / Modelo Machine Learning
* **Toda la parte de Python debe ser un servicio independiente** fuera de la solución de Java/Spring Boot.
* **Eliminar de la raíz y subcarpetas del proyecto Spring Boot:**
  * Todos los archivos con extensión `.py` (scripts de Python).
  * Todos los archivos de modelo entrenado con extensión `.pkl`.
  * Cualquier script de ejecución secundaria de Python dentro del repositorio de Java.

### 2. Gestión de Dependencias (`pom.xml` / `build.gradle`)
* **Eliminar dependencias innecesarias:** Remover librerías residuales, conectores no utilizados o bibliotecas de integración directa con scripts ejecutables.
* **Agregar dependencias necesarias:** 
  * Spring Boot Starter Web.
  * Spring Data JPA / Hibernate.
  * Conector de Base de Datos (MySQL / PostgreSQL según aplique).
  * Lombok (para reducción de boilerplate code).
  * RestTemplate / WebClient (para comunicación HTTP asíncrona/síncrona con el microservicio independiente de Python si aplica).
  * Spring Security & JWT (si requiere autenticación).

### 3. Modelos y Endpoints para Conexión / Integración
* Crear las entidades JPA correspondientes al esquema de la base de datos (`InputUser`, `OutputUser`, `Category`, `OutputKeyWord`, `KeyWord`).
* Implementar los repositorios (`Spring Data JPA`).
* Crear los **Endpoints REST** requeridos para la comunicación con el Frontend y la transmisión de datos hacia/desde el servicio que interactúa con el modelo `.pkl`.
* Manejar estructuras de transmisión mediante **DTOs** para aislar las entidades de la base de datos.

### 4. Código Limpio y Refactorización (Clean Code)
* Aplicar arquitectura en capas: `Controller` $ightarrow$ `Service` $ightarrow$ `Repository` $ightarrow$ `Entity/DTO`.
* Aplicar principios **SOLID**, **KISS** y **DRY**.
* Implementar un controlador global de excepciones con `@ControllerAdvice`.
* Formatear el código adecuadamente y asegurar nombres de variables y métodos descriptivos en camello (`camelCase`).

### 5. Revisión de Errores y Warnings
* Revisar el proyecto completo para garantizar **cero errores de compilación**.
* Corregir **todos los warnings** (métodos obsoletos, imports sin uso, variables no utilizadas, inyecciones de dependencias por campo no recomendadas $ightarrow$ usar inyección por constructor/Lombok `@RequiredArgsConstructor`).

### 6. Pruebas de Funcionamiento de la API
* Diseñar e implementar pruebas unitarias e de integración (`JUnit 5`, `Mockito`, `MockMvc`).
* Validar que los endpoints respondan correctamente con los códigos de estado HTTP adecuados (`200 OK`, `201 Created`, `400 Bad Request`, `404 Not Found`, `500 Internal Server Error`).

---

## 📦 Entregables Esperados
1. Estructura de código refactorizada en Spring Boot sin residuos de Python/`.pkl`.
2. Clases de Entidad, Repositorios, Servicios y Controladores creados segun el diagrama relacional.
3. Archivo de configuración de dependencias limpio y actualizado (`pom.xml` o `build.gradle`).
4. Suite de pruebas unitarias/integración para validar el correcto funcionamiento de los endpoints.

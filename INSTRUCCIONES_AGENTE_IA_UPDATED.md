# 🤖 Directivas del Agente de Inteligencia Artificial (Backend Spring Boot)

## 🎯 Objetivo Principal
Actuarás como un **Desarrollador Senior Backend en Spring Boot** y **Especialista en Refactorización y QA**. Tu objetivo es limpiar, refactorizar e implementar la arquitectura del proyecto Spring Boot de forma independiente, desacoplando completamente la capa de Python / Modelo `.pkl` y construyendo los modelos de entidad y endpoints necesarios según el nuevo esquema optimizado de la base de datos **`TechMind_db`**.

---

## 🗄️ Configuración de la Base de Datos (`TechMind_db`)

El proyecto utiliza **MySQL** con la base de datos `TechMind_db`. La configuración debe registrarse en `src/main/resources/application.properties`:

```properties
spring.datasource.url=jdbc:mysql://localhost:3306/TechMind_db?serverTimezone=UTC&useSSL=false
spring.datasource.username=root
spring.datasource.password=${DB_PASSWORD:root}
spring.datasource.driver-class-name=com.mysql.cj.jdbc.Driver

# JPA / Hibernate Config
spring.jpa.hibernate.ddl-auto=update
spring.jpa.show-sql=true
spring.jpa.properties.hibernate.format_sql=true
```

---

## 📐 Modelo de Base de Datos Actualizado (Relaciones a Implementar)

Debes mapear y construir las entidades JPA basadas en el esquema optimizado de **`TechMind_db`**:

* **`input_user`** (Entidad: `InputUser`):
  * `id`: `BIGINT` (PK, Auto-incremental)
  * `title`: `VARCHAR(255)` (Not Null)
  * `content`: `TEXT` (Not Null)
  * `created_at`: `TIMESTAMP` (Auto-generado)
* **`categories`** (Entidad: `Category`):
  * `id`: `BIGINT` (PK, Auto-incremental)
  * `name`: `VARCHAR(100)` (Not Null, Unique)
* **`output_user`** (Entidad: `OutputUser`):
  * `id`: `BIGINT` (PK, Auto-incremental)
  * `input_user_id`: `BIGINT` (FK $ightarrow$ `input_user.id`)
  * `category_id`: `BIGINT` (FK $ightarrow$ `categories.id`)
  * `score`: `FLOAT` (Not Null)
  * `created_at`: `TIMESTAMP` (Auto-generado)
* **`key_words`** (Entidad: `KeyWord`):
  * `id`: `BIGINT` (PK, Auto-incremental)
  * `word`: `VARCHAR(50)` (Not Null, Unique)
* **`output_keyword`** (Tabla intermedia / `@ManyToMany` o Entidad Intermedia):
  * `id`: `BIGINT` (PK, Auto-incremental)
  * `output_user_id`: `BIGINT` (FK $ightarrow$ `output_user.id`)
  * `keyword_id`: `BIGINT` (FK $ightarrow$ `key_words.id`)

---

## 🛠️ Tareas y Reglas de Ejecución

### 1. Desacoplamiento de Python / Modelo Machine Learning
* **Toda la parte de Python debe ser un servicio independiente** fuera de la solución de Java/Spring Boot.
* **Eliminar de la raíz y subcarpetas del proyecto Spring Boot:**
  * Todos los archivos con extensión `.py` (scripts de Python).
  * Todos los archivos de modelo entrenado con extensión `.pkl`.
  * Cualquier script de ejecución secundaria de Python dentro del repositorio de Java.

### 2. Gestión de Dependencias (`pom.xml` / `build.gradle`)
* **Eliminar dependencias innecesarias:** Remover librerías residuales, conectores no utilizados o bibliotecas de integración directa con scripts ejecutables de Python.
* **Agregar dependencias necesarias:**
  * Spring Boot Starter Web.
  * Spring Data JPA / Hibernate.
  * MySQL Connector/J (`com.mysql:mysql-connector-j`).
  * Lombok (para reducción de boilerplate code).
  * RestTemplate / WebClient (para comunicación HTTP con el servicio externo de Python si aplica).
  * Spring Security & token (si requiere autenticación).

### 3. Modelos y Endpoints para Conexión / Integración
* Crear las entidades JPA correspondientes al esquema actualizado de `TechMind_db` (`InputUser`, `OutputUser`, `Category`, `KeyWord`).
* Implementar los repositorios (`Spring Data JPA`).
* Crear los **Endpoints REST** requeridos para la comunicación con el Frontend y la transmisión de datos hacia/desde el servicio de Python que interactúa con el modelo `.pkl`.
* Manejar estructuras de transmisión mediante **DTOs** para aislar las entidades de la base de datos.

### 4. Código Limpio y Refactorización (Clean Code)
* Aplicar arquitectura en capas: `Controller` $ightarrow$ `Service` $ightarrow$ `Repository` $ightarrow$ `Entity/DTO`.
* Aplicar principios **SOLID**, **KISS** y **DRY**.
* Implementar un controlador global de excepciones con `@ControllerAdvice`.
* Formatear el código adecuadamente y asegurar nombres de variables y métodos descriptivos en camello (`camelCase`).

### 5. Revisión de Errores y Warnings
* Revisar el proyecto completo para garantizar **cero errores de compilación**.
* Corregir **todos los warnings** (métodos obsoletos, imports sin uso, variables no utilizadas, inyecciones por campo no recomendadas $ightarrow$ usar inyección por constructor/Lombok `@RequiredArgsConstructor`).

### 6. Pruebas de Funcionamiento de la API
* Diseñar e implementar pruebas unitarias y de integración (`JUnit 5`, `Mockito`, `MockMvc`).
* Validar que los endpoints respondan correctamente con los códigos de estado HTTP adecuados (`200 OK`, `201 Created`, `400 Bad Request`, `404 Not Found`, `500 Internal Server Error`).

---

## 📦 Entregables Esperados
1. Estructura de código refactorizada en Spring Boot sin residuos de Python/`.pkl`.
2. Clases de Entidad, Repositorios, Servicios y Controladores creados según el esquema optimizado de `TechMind_db`.
3. Archivo de configuración de dependencias y `application.properties` actualizado para `TechMind_db`.
4. Suite de pruebas unitarias/integración para validar el correcto funcionamiento de los endpoints.

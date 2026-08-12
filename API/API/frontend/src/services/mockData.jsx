export const mockDocuments = [
  {
    id: 101,
    fileName: "introduccion_spring_boot.txt",
    originalTitle: "Introducción a Spring Boot 3",
    category: "Backend",
    score: 0.96,
    keywords: ["Spring Boot", "Java", "REST API", "Inyección de Dependencias"],
    modelUsed: "TechMind-Classifier-v1",
    fileUrl: "#",
    contentPreview: "Spring Boot facilita la creación de aplicaciones Java autónomas y listas para producción. Incluye un servidor Tomcat embebido y configuración automática para Spring MVC, JPA y Spring Security...",
    createdAt: "2026-08-11T10:30:00"
  },
  {
    id: 102,
    fileName: "patrones_diseno_react.txt",
    originalTitle: "Patrones de Diseño en React y Custom Hooks",
    category: "Frontend",
    score: 0.91,
    keywords: ["React", "Custom Hooks", "Context API", "Virtual DOM"],
    modelUsed: "TechMind-Classifier-v1",
    fileUrl: "#",
    contentPreview: "Los Custom Hooks permiten extraer la lógica de un componente para que pueda ser reutilizada de manera independiente. Promueven la separación de conceptos y evitan la duplicación de código en la UI...",
    createdAt: "2026-08-11T11:15:00"
  },
  {
    id: 103,
    fileName: "docker_compose_architecture.txt",
    originalTitle: "Orquestación de Contenedores con Docker Compose",
    category: "DevOps",
    score: 0.88,
    keywords: ["Docker", "Containers", "Microservicios", "Volúmenes"],
    modelUsed: "TechMind-Classifier-v1",
    fileUrl: "#",
    contentPreview: "Docker Compose es una herramienta para definir y ejecutar aplicaciones Docker de múltiples contenedores. Mediante un archivo YAML, se configuran los servicios de la aplicación, redes y volúmenes persistentes...",
    createdAt: "2026-08-11T12:00:00"
  }
];

export const mockUser = {
  name: "Rubén Rodríguez",
  email: "ruben@team70.com",
  role: "Administrador",
  avatarUrl: "https://github.com/shadcn.png"
};
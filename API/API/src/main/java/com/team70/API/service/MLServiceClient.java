package com.team70.API.service;

import com.team70.API.dto.ContentRequest;
import com.team70.API.dto.ContentResponse;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.reactive.function.client.WebClient;
import org.springframework.web.reactive.function.client.WebClientResponseException;

import java.util.List;
import java.util.Locale;

@Slf4j
@Service
@RequiredArgsConstructor
public class MLServiceClient {

    private final WebClient webClient;

    @Value("${ml.service.url:http://localhost:5000}")
    private String mlServiceUrl;

    @Value("${ml.service.enabled:false}")
    private boolean mlServiceEnabled;

    public ContentResponse predict(ContentRequest request) {
        if (!mlServiceEnabled) {
            return classifyLocally(request);
        }

        try {
            ContentResponse response = webClient.post()
                    .uri(mlServiceUrl + "/predict")
                    .bodyValue(request)
                    .retrieve()
                    .bodyToMono(ContentResponse.class)
                    .block();

            if (response == null) {
                throw new IllegalStateException("ML Service returned null response");
            }

            return response;

        } catch (WebClientResponseException e) {
            log.error("ML Service error: {} - {}", e.getStatusCode(), e.getResponseBodyAsString());
            return classifyLocally(request);
        } catch (Exception e) {
            log.error("Error calling ML Service: ", e);
            return classifyLocally(request);
        }
    }

    public List<ContentResponse> predictBatch(List<ContentRequest> requests) {
        if (!mlServiceEnabled) {
            return requests.stream().map(this::classifyLocally).toList();
        }

        try {
            List<ContentResponse> responses = webClient.post()
                    .uri(mlServiceUrl + "/predict/batch")
                    .bodyValue(requests)
                    .retrieve()
                    .bodyToFlux(ContentResponse.class)
                    .collectList()
                    .block();

            if (responses == null) {
                throw new IllegalStateException("ML Service returned null response for batch");
            }

            return responses;

        } catch (WebClientResponseException e) {
            log.error("ML Service batch error: {} - {}", e.getStatusCode(), e.getResponseBodyAsString());
            return requests.stream().map(this::classifyLocally).toList();
        } catch (Exception e) {
            log.error("Error calling ML Service batch: ", e);
            return requests.stream().map(this::classifyLocally).toList();
        }
    }

    private ContentResponse classifyLocally(ContentRequest request) {
        String text = (request.getTitle() + " " + request.getContent()).toLowerCase(Locale.ROOT);
        String category = "General";
        List<String> keywords = List.of("Contenido técnico");

        if (containsAny(text, "spring", "java", "api", "backend")) {
            category = "Backend";
            keywords = List.of("Java", "Spring Boot", "API REST");
        } else if (containsAny(text, "react", "vue", "angular", "css", "frontend")) {
            category = "Frontend";
            keywords = List.of("JavaScript", "Interfaz", "Frontend");
        } else if (containsAny(text, "mysql", "postgresql", "sql", "database", "base de datos")) {
            category = "Base de Datos";
            keywords = List.of("SQL", "Base de Datos", "Persistencia");
        } else if (containsAny(text, "docker", "kubernetes", "devops", "ci/cd", "deployment")) {
            category = "DevOps";
            keywords = List.of("DevOps", "Contenedores", "Despliegue");
        } else if (containsAny(text, "machine learning", "data science", "pandas", "python", "modelo")) {
            category = "Data Science";
            keywords = List.of("Datos", "Machine Learning", "Análisis");
        } else if (containsAny(text, "security", "seguridad", "jwt", "autenticación", "autorización")) {
            category = "Seguridad";
            keywords = List.of("Seguridad", "Autenticación", "JWT");
        }

        return ContentResponse.builder()
                .category(category)
                .score(0.65)
                .keywords(keywords)
                .modelUsed("Reglas locales")
                .processingTimeMs(0L)
                .build();
    }

    private boolean containsAny(String text, String... terms) {
        return java.util.Arrays.stream(terms).anyMatch(text::contains);
    }
}

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

@Slf4j
@Service
@RequiredArgsConstructor
public class MLServiceClient {

    private final WebClient webClient;

    @Value("${ml.service.url:http://localhost:5000}")
    private String mlServiceUrl;

    public ContentResponse predict(ContentRequest request) {
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
            return getFallbackResponse(e.getStatusCode().value());
        } catch (Exception e) {
            log.error("Error calling ML Service: ", e);
            return getFallbackResponse(500);
        }
    }

    public List<ContentResponse> predictBatch(List<ContentRequest> requests) {
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
            return requests.stream().map(r -> getFallbackResponse(e.getStatusCode().value())).toList();
        } catch (Exception e) {
            log.error("Error calling ML Service batch: ", e);
            return requests.stream().map(r -> getFallbackResponse(500)).toList();
        }
    }

    private ContentResponse getFallbackResponse(int statusCode) {
        return ContentResponse.builder()
                .categoria("Error")
                .probabilidad(0.0)
                .informacionAdicional(List.of("ML Service unavailable"))
                .modeloUtilizado("Fallback")
                .tiempoProcesamientoMs(0L)
                .build();
    }
}
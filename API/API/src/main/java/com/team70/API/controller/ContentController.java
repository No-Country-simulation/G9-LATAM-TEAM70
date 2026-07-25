package com.team70.API.controller;

import com.team70.API.dto.ContentRequest;
import com.team70.API.dto.ContentResponse;
import com.team70.API.service.PythonModelService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@Slf4j
@RestController
@RequestMapping("/contenido")
@RequiredArgsConstructor
public class ContentController {

    private final PythonModelService pythonModelService;

    @PostMapping
    public ResponseEntity<ContentResponse> processContent(@Valid @RequestBody ContentRequest request) {
        log.info("Received request to process content: {}", request.getTitle());
        
        ContentResponse response = pythonModelService.predictAndSave(request);
        
        log.info("Content processed successfully. Category: {}", response.getCategory());
        return ResponseEntity.ok(response);
    }

    @PostMapping("/batch")
    public ResponseEntity<List<ContentResponse>> processBatchContent(
            @Valid @RequestBody List<ContentRequest> requests) {
        log.info("Received batch request with {} items", requests.size());
        
        List<ContentResponse> responses = pythonModelService.predictAndSaveBatch(requests);
        
        log.info("Batch processing completed for {} items", responses.size());
        return ResponseEntity.ok(responses);
    }

    @GetMapping("/health")
    public ResponseEntity<Map<String, String>> healthCheck() {
        return ResponseEntity.ok(Map.of(
            "status", "UP",
            "service", "techmind-api",
            "timestamp", java.time.LocalDateTime.now().toString()
        ));
    }
}
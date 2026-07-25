package com.team70.API.controller;

import com.team70.API.dto.ContentRequest;
import com.team70.API.dto.ContentResponse;
import com.team70.API.service.PythonModelService;
import com.team70.API.config.TestConfig;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.context.annotation.Import;
import org.springframework.http.MediaType;
import org.springframework.test.web.servlet.MockMvc;

import java.util.List;

import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.anyList;
import static org.mockito.Mockito.*;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

@WebMvcTest(ContentController.class)
@Import(TestConfig.class)
class ContentControllerTest {

    @Autowired
    private MockMvc mockMvc;

    @MockBean
    private PythonModelService pythonModelService;

    @Test
    void processContent_ValidRequest_ReturnsContentResponse() throws Exception {
        // Given
        ContentResponse response = ContentResponse.builder()
                .inputId(1L)
                .outputId(1L)
                .category("Backend")
                .score(0.95)
                .keywords(List.of("Java", "Spring Boot"))
                .modelUsed("TF-IDF + LogisticRegression")
                .processingTimeMs(50L)
                .build();

        when(pythonModelService.predictAndSave(any(ContentRequest.class))).thenReturn(response);

        // When & Then
        mockMvc.perform(post("/api/contenido")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content("{\"title\":\"Test Title\",\"content\":\"Test content for classification\"}"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.category").value("Backend"))
                .andExpect(jsonPath("$.score").value(0.95))
                .andExpect(jsonPath("$.inputId").value(1))
                .andExpect(jsonPath("$.outputId").value(1))
                .andExpect(jsonPath("$.keywords").isArray())
                .andExpect(jsonPath("$.keywords[0]").value("Java"))
                .andExpect(jsonPath("$.keywords[1]").value("Spring Boot"));

        verify(pythonModelService).predictAndSave(any(ContentRequest.class));
    }

    @Test
    void processContent_InvalidTitle_ReturnsBadRequest() throws Exception {
        // When & Then
        mockMvc.perform(post("/api/contenido")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content("{\"title\":\"\",\"content\":\"Valid content\"}"))
                .andExpect(status().isBadRequest())
                .andExpect(jsonPath("$.error").value("Validation Failed"))
                .andExpect(jsonPath("$.validationErrors.title").exists());

        verify(pythonModelService, never()).predictAndSave(any(ContentRequest.class));
    }

    @Test
    void processContent_InvalidContent_ReturnsBadRequest() throws Exception {
        // When & Then
        mockMvc.perform(post("/api/contenido")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content("{\"title\":\"Valid Title\",\"content\":\"\"}"))
                .andExpect(status().isBadRequest())
                .andExpect(jsonPath("$.error").value("Validation Failed"))
                .andExpect(jsonPath("$.validationErrors.content").exists());

        verify(pythonModelService, never()).predictAndSave(any(ContentRequest.class));
    }

    @Test
    void processContent_MissingFields_ReturnsBadRequest() throws Exception {
        // When & Then
        mockMvc.perform(post("/api/contenido")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content("{}"))
                .andExpect(status().isBadRequest())
                .andExpect(jsonPath("$.error").value("Validation Failed"))
                .andExpect(jsonPath("$.validationErrors.title").exists())
                .andExpect(jsonPath("$.validationErrors.content").exists());

        verify(pythonModelService, never()).predictAndSave(any(ContentRequest.class));
    }

    @Test
    void processBatchContent_ValidRequest_ReturnsList() throws Exception {
        // Given
        ContentResponse response1 = ContentResponse.builder()
                .inputId(1L)
                .outputId(1L)
                .category("Backend")
                .score(0.9)
                .keywords(List.of("Java"))
                .modelUsed("Test Model")
                .processingTimeMs(40L)
                .build();

        ContentResponse response2 = ContentResponse.builder()
                .inputId(2L)
                .outputId(2L)
                .category("Frontend")
                .score(0.85)
                .keywords(List.of("React"))
                .modelUsed("Test Model")
                .processingTimeMs(35L)
                .build();

        when(pythonModelService.predictAndSaveBatch(anyList())).thenReturn(List.of(response1, response2));

        // When & Then
        mockMvc.perform(post("/api/contenido/batch")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content("""
                                [
                                    {"title":"Title 1","content":"Content 1"},
                                    {"title":"Title 2","content":"Content 2"}
                                ]
                                """))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$").isArray())
                .andExpect(jsonPath("$[0].category").value("Backend"))
                .andExpect(jsonPath("$[1].category").value("Frontend"))
                .andExpect(jsonPath("$[0].inputId").value(1))
                .andExpect(jsonPath("$[1].inputId").value(2));

        verify(pythonModelService).predictAndSaveBatch(anyList());
    }

    @Test
    void healthCheck_ReturnsUp() throws Exception {
        // When & Then
        mockMvc.perform(get("/api/contenido/health"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.status").value("UP"))
                .andExpect(jsonPath("$.service").value("techmind-api"))
                .andExpect(jsonPath("$.timestamp").exists());
    }
}
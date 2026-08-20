package com.team70.API.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class ContentResponse {

    private String category;
    private Double score;
    private List<String> keywords;
    private String modelUsed;
    private Long processingTimeMs;
    private Long inputId;
    private Long outputId;
}
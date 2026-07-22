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
public class MLServiceResponse {
    private String categoria;
    private Double probabilidad;
    private List<String> informacionAdicional;
    private String modeloUtilizado;
    private Long tiempoProcesamientoMs;
}
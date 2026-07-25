package com.team70.API.config;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.context.annotation.Primary;
import org.springframework.web.reactive.function.client.WebClient;

@Configuration
public class TestConfig {

    @Bean
    @Primary
    public WebClient webClient() {
        return WebClient.builder().build();
    }
}
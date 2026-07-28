package com.team70.API.config;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Primary;
import org.springframework.boot.test.context.TestConfiguration;
import org.springframework.web.reactive.function.client.WebClient;

@TestConfiguration
public class TestConfig {

    @Bean
    @Primary
    public WebClient webClient() {
        return WebClient.builder().build();
    }
}

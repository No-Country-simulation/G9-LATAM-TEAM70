package com.team70.API.service;

import com.team70.API.dto.ContentRequest;
import com.team70.API.dto.ContentResponse;
import com.team70.API.entity.InputUser;
import com.team70.API.entity.KeyWord;
import com.team70.API.entity.OutputUser;
import com.team70.API.repository.InputUserRepository;
import com.team70.API.repository.KeyWordRepository;
import com.team70.API.repository.OutputUserRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import jakarta.annotation.PostConstruct;
import java.io.*;
import java.nio.charset.StandardCharsets;
import java.time.Duration;
import java.time.Instant;
import java.util.*;
import java.util.concurrent.TimeUnit;
import java.util.regex.Pattern;

@Slf4j
@Service
@RequiredArgsConstructor
public class PythonModelService {

    @Value("${python.model.script-path:src/main/python/predict.py}")
    private String pythonScriptPath;

    @Value("${python.executable:python3}")
    private String pythonExecutable;

    @Value("${python.model.path:models/modelo.pkl}")
    private String modelPath;

    @Value("${python.model.vectorizer-path:models/vectorizer.pkl}")
    private String vectorizerPath;

    @Value("${python.model.timeout-seconds:30}")
    private int timeoutSeconds;

    private final InputUserRepository inputUserRepository;
    private final OutputUserRepository outputUserRepository;
    private final KeyWordRepository keyWordRepository;

    private boolean modelFilesExist = false;

    @PostConstruct
    public void init() {
        File modelFile = new File(modelPath);
        File vectorizerFile = new File(vectorizerPath);
        File scriptFile = new File(pythonScriptPath);

        modelFilesExist = modelFile.exists() && vectorizerFile.exists() && scriptFile.exists();

        if (modelFilesExist) {
            log.info("Model files found and ready to use");
            log.info("Model: {}", modelFile.getAbsolutePath());
            log.info("Vectorizer: {}", vectorizerFile.getAbsolutePath());
            log.info("Script: {}", scriptFile.getAbsolutePath());
        } else {
            log.warn("Model files not found. Please train the model first using the Python script.");
            log.warn("Expected model at: {}", modelFile.getAbsolutePath());
            log.warn("Expected vectorizer at: {}", vectorizerFile.getAbsolutePath());
            log.warn("Expected script at: {}", scriptFile.getAbsolutePath());
        }
    }

    @Transactional
    public ContentResponse predictAndSave(ContentRequest request) {
        Instant start = Instant.now();

        // 1. Save input
        InputUser inputUser = InputUser.builder()
                .title(request.getTitulo())
                .text(request.getTexto())
                .build();
        inputUser = inputUserRepository.save(inputUser);

        ContentResponse response;
        if (!modelFilesExist) {
            log.warn("Model files not found, returning mock response");
            response = getMockResponse(request, Duration.between(start, Instant.now()).toMillis());
        } else {
            response = callPythonModel(request, start);
        }

        // 2. Save output
        OutputUser outputUser = OutputUser.builder()
                .category(response.getCategoria())
                .probability(response.getProbabilidad())
                .modelUsed(response.getModeloUtilizado())
                .processingTimeMs(response.getTiempoProcesamientoMs())
                .inputUser(inputUser)
                .build();

        // 3. Save keywords
        if (response.getInformacionAdicional() != null && !response.getInformacionAdicional().isEmpty()) {
            Set<KeyWord> keywords = new HashSet<>();
            for (String kw : response.getInformacionAdicional()) {
                KeyWord keyWord = keyWordRepository.findByKeyword(kw);
                if (keyWord == null) {
                    keyWord = KeyWord.builder().keyword(kw).build();
                    keyWord = keyWordRepository.save(keyWord);
                }
                keywords.add(keyWord);
            }
            outputUser.setKeywords(keywords);
        }

        outputUser = outputUserRepository.save(outputUser);

        // 4. Update response with IDs
        response.setInputId(inputUser.getId());
        response.setOutputId(outputUser.getId());

        return response;
    }

    private ContentResponse callPythonModel(ContentRequest request, Instant start) {
        try {
            String inputJson = String.format(
                "{\"titulo\": \"%s\", \"texto\": \"%s\"}",
                escapeJson(request.getTitulo()),
                escapeJson(request.getTexto())
            );

            ProcessBuilder pb = new ProcessBuilder(
                pythonExecutable,
                pythonScriptPath,
                "--model", modelPath,
                "--vectorizer", vectorizerPath,
                "--input", inputJson
            );

            pb.redirectErrorStream(true);
            Process process = pb.start();

            String output = readProcessOutput(process);
            int exitCode = process.waitFor(timeoutSeconds, TimeUnit.SECONDS) ? process.exitValue() : -1;

            long processingTime = Duration.between(start, Instant.now()).toMillis();

            if (exitCode != 0) {
                log.error("Python script failed with exit code {}: {}", exitCode, output);
                return getMockResponse(request, processingTime);
            }

            return parsePythonOutput(output, processingTime);

        } catch (Exception e) {
            log.error("Error calling Python model: ", e);
            return getMockResponse(request, Duration.between(start, Instant.now()).toMillis());
        }
    }

    private String readProcessOutput(Process process) throws IOException {
        StringBuilder output = new StringBuilder();
        try (BufferedReader reader = new BufferedReader(
                new InputStreamReader(process.getInputStream(), StandardCharsets.UTF_8))) {
            String line;
            while ((line = reader.readLine()) != null) {
                output.append(line).append("\n");
            }
        }
        return output.toString().trim();
    }

    private ContentResponse parsePythonOutput(String output, long processingTime) {
        try {
            String json = output.trim();

            String categoria = extractJsonValue(json, "categoria");
            Double probabilidad = Double.parseDouble(extractJsonValue(json, "probabilidad"));
            List<String> informacionAdicional = extractJsonArray(json, "informacion_adicional");
            String modeloUtilizado = extractJsonValue(json, "modelo_utilizado");

            return ContentResponse.builder()
                    .categoria(categoria)
                    .probabilidad(probabilidad)
                    .informacionAdicional(informacionAdicional)
                    .modeloUtilizado(modeloUtilizado != null ? modeloUtilizado : "TF-IDF + LogisticRegression")
                    .tiempoProcesamientoMs(processingTime)
                    .build();
        } catch (Exception e) {
            log.error("Error parsing Python output: {}", output, e);
            return ContentResponse.builder()
                    .categoria("Error")
                    .probabilidad(0.0)
                    .informacionAdicional(List.of("Error parsing model output"))
                    .modeloUtilizado("Unknown")
                    .tiempoProcesamientoMs(processingTime)
                    .build();
        }
    }

    private String extractJsonValue(String json, String key) {
        String pattern = "\"" + key + "\"\\s*:\\s*\"([^\"]*)\"";
        Pattern p = Pattern.compile(pattern);
        java.util.regex.Matcher m = p.matcher(json);
        if (m.find()) {
            return m.group(1);
        }
        return null;
    }

    private List<String> extractJsonArray(String json, String key) {
        String pattern = "\"" + key + "\"\\s*:\\s*\\[([^\\]]*)\\]";
        Pattern p = Pattern.compile(pattern);
        java.util.regex.Matcher m = p.matcher(json);
        if (m.find()) {
            String arrayContent = m.group(1);
            return Arrays.stream(arrayContent.split(","))
                    .map(s -> s.trim().replaceAll("\"", ""))
                    .filter(s -> !s.isEmpty())
                    .toList();
        }
        return List.of();
    }

    private String escapeJson(String input) {
        return input.replace("\\", "\\\\")
                    .replace("\"", "\\\"")
                    .replace("\n", "\\n")
                    .replace("\r", "\\r")
                    .replace("\t", "\\t");
    }

    private ContentResponse getMockResponse(ContentRequest request, long processingTime) {
        String categoria = categorizeMock(request.getTitulo(), request.getTexto());

        return ContentResponse.builder()
                .categoria(categoria)
                .probabilidad(0.85 + Math.random() * 0.1)
                .informacionAdicional(extractKeywords(request.getTitulo(), request.getTexto()))
                .modeloUtilizado("Mock Model (TF-IDF + LogisticRegression)")
                .tiempoProcesamientoMs(processingTime)
                .build();
    }

    private String categorizeMock(String titulo, String texto) {
        String combined = (titulo + " " + texto).toLowerCase();

        if (combined.contains("spring") || combined.contains("java") || combined.contains("api")
            || combined.contains("backend") || combined.contains("rest") || combined.contains("microservicio")) {
            return "Backend";
        }
        if (combined.contains("react") || combined.contains("angular") || combined.contains("vue")
            || combined.contains("frontend") || combined.contains("javascript") || combined.contains("typescript")
            || combined.contains("html") || combined.contains("css")) {
            return "Frontend";
        }
        if (combined.contains("python") || combined.contains("machine learning") || combined.contains("data science")
            || combined.contains("pandas") || combined.contains("tensorflow") || combined.contains("pytorch")) {
            return "Data Science / ML";
        }
        if (combined.contains("devops") || combined.contains("docker") || combined.contains("kubernetes")
            || combined.contains("ci/cd") || combined.contains("aws") || combined.contains("azure")
            || combined.contains("terraform")) {
            return "DevOps / Cloud";
        }
        if (combined.contains("base de datos") || combined.contains("sql") || combined.contains("nosql")
            || combined.contains("postgresql") || combined.contains("mongodb")) {
            return "Base de Datos";
        }

        return "General";
    }

    private List<String> extractKeywords(String titulo, String texto) {
        String combined = (titulo + " " + texto).toLowerCase();
        List<String> keywords = new ArrayList<>();

        String[] techKeywords = {"java", "spring", "python", "react", "angular", "vue", "javascript", "typescript",
            "api", "rest", "microservicio", "docker", "kubernetes", "aws", "azure", "sql", "nosql",
            "machine learning", "data science", "pandas", "tensorflow", "pytorch", "devops", "ci/cd"};

        for (String kw : techKeywords) {
            if (combined.contains(kw)) {
                keywords.add(kw.substring(0, 1).toUpperCase() + kw.substring(1));
            }
        }

        return keywords.isEmpty() ? List.of("Tecnología") : keywords.stream().distinct().limit(5).toList();
    }
}
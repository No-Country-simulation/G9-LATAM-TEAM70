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
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.Duration;
import java.time.Instant;
import java.util.HashSet;
import java.util.List;
import java.util.Set;

@Slf4j
@Service
@RequiredArgsConstructor
public class PythonModelService {

    private final InputUserRepository inputUserRepository;
    private final OutputUserRepository outputUserRepository;
    private final KeyWordRepository keyWordRepository;
    private final MLServiceClient mlServiceClient;

    @Transactional
    public ContentResponse predictAndSave(ContentRequest request) {
        Instant start = Instant.now();

        // 1. Save input
        InputUser inputUser = InputUser.builder()
                .title(request.getTitulo())
                .text(request.getTexto())
                .build();
        inputUser = inputUserRepository.save(inputUser);

        // 2. Call ML Service (external Python service)
        ContentResponse response = mlServiceClient.predict(request);

        long processingTime = Duration.between(start, Instant.now()).toMillis();
        response.setTiempoProcesamientoMs(processingTime);

        // 3. Save output
        OutputUser outputUser = OutputUser.builder()
                .category(response.getCategoria())
                .probability(response.getProbabilidad())
                .modelUsed(response.getModeloUtilizado())
                .processingTimeMs(response.getTiempoProcesamientoMs())
                .inputUser(inputUser)
                .build();

        // 4. Save keywords
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

        // 5. Update response with IDs
        response.setInputId(inputUser.getId());
        response.setOutputId(outputUser.getId());

        return response;
    }

    @Transactional
    public List<ContentResponse> predictAndSaveBatch(List<ContentRequest> requests) {
        // Save all inputs first
        List<InputUser> inputUsers = requests.stream()
                .map(req -> InputUser.builder()
                        .title(req.getTitulo())
                        .text(req.getTexto())
                        .build())
                .toList();
        inputUsers = inputUserRepository.saveAll(inputUsers);

        // Call ML Service batch
        List<ContentResponse> responses = mlServiceClient.predictBatch(requests);

        // Save outputs and keywords
        for (int i = 0; i < requests.size(); i++) {
            ContentResponse response = responses.get(i);
            InputUser inputUser = inputUsers.get(i);

            OutputUser outputUser = OutputUser.builder()
                    .category(response.getCategoria())
                    .probability(response.getProbabilidad())
                    .modelUsed(response.getModeloUtilizado())
                    .processingTimeMs(response.getTiempoProcesamientoMs())
                    .inputUser(inputUser)
                    .build();

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
            response.setInputId(inputUser.getId());
            response.setOutputId(outputUser.getId());
        }

        return responses;
    }
}
package com.team70.API.service;

import com.team70.API.dto.ContentRequest;
import com.team70.API.dto.ContentResponse;
import com.team70.API.entity.Category;
import com.team70.API.entity.InputUser;
import com.team70.API.entity.KeyWord;
import com.team70.API.entity.OutputUser;
import com.team70.API.repository.CategoryRepository;
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
    private final CategoryRepository categoryRepository;
    private final KeyWordRepository keyWordRepository;
    private final MLServiceClient mlServiceClient;

    @Transactional
    public ContentResponse predictAndSave(ContentRequest request) {
        Instant start = Instant.now();

        // 1. Save input
        InputUser inputUser = InputUser.builder()
                .title(request.getTitle())
                .content(request.getContent())
                .build();
        inputUser = inputUserRepository.save(inputUser);

        // 2. Call ML Service (external Python service)
        ContentResponse response = mlServiceClient.predict(request);

        long processingTime = Duration.between(start, Instant.now()).toMillis();
        response.setProcessingTimeMs(processingTime);

        // 3. Get or create category
        Category category = categoryRepository.findByName(response.getCategory())
                .orElseGet(() -> categoryRepository.save(Category.builder().name(response.getCategory()).build()));

        // 4. Save output
        OutputUser outputUser = OutputUser.builder()
                .category(category)
                .score(response.getScore().floatValue())
                .inputUser(inputUser)
                .build();

        // 5. Save keywords
        if (response.getKeywords() != null && !response.getKeywords().isEmpty()) {
            Set<KeyWord> keywords = new HashSet<>();
            for (String kw : response.getKeywords()) {
                KeyWord keyWord = keyWordRepository.findByWord(kw)
                        .orElseGet(() -> keyWordRepository.save(KeyWord.builder().word(kw).build()));
                keywords.add(keyWord);
            }
            outputUser.setKeywords(keywords);
        }

        outputUser = outputUserRepository.save(outputUser);

        // 6. Update response with IDs
        response.setInputId(inputUser.getId());
        response.setOutputId(outputUser.getId());

        return response;
    }

    @Transactional
    public List<ContentResponse> predictAndSaveBatch(List<ContentRequest> requests) {
        // Save all inputs first
        List<InputUser> inputUsers = requests.stream()
                .map(req -> InputUser.builder()
                        .title(req.getTitle())
                        .content(req.getContent())
                        .build())
                .toList();
        inputUsers = inputUserRepository.saveAll(inputUsers);

        // Call ML Service batch
        List<ContentResponse> responses = mlServiceClient.predictBatch(requests);

        // Save outputs and keywords
        for (int i = 0; i < requests.size(); i++) {
            ContentResponse response = responses.get(i);
            InputUser inputUser = inputUsers.get(i);

            Category category = categoryRepository.findByName(response.getCategory())
                    .orElseGet(() -> categoryRepository.save(Category.builder().name(response.getCategory()).build()));

            OutputUser outputUser = OutputUser.builder()
                    .category(category)
                    .score(response.getScore().floatValue())
                    .inputUser(inputUser)
                    .build();

            if (response.getKeywords() != null && !response.getKeywords().isEmpty()) {
                Set<KeyWord> keywords = new HashSet<>();
                for (String kw : response.getKeywords()) {
                    KeyWord keyWord = keyWordRepository.findByWord(kw)
                            .orElseGet(() -> keyWordRepository.save(KeyWord.builder().word(kw).build()));
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
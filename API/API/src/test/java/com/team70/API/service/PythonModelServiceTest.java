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
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.util.List;
import java.util.Optional;
import java.util.Set;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.anyLong;
import static org.mockito.ArgumentMatchers.anyString;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class PythonModelServiceTest {

    @Mock
    private InputUserRepository inputUserRepository;

    @Mock
    private OutputUserRepository outputUserRepository;

    @Mock
    private CategoryRepository categoryRepository;

    @Mock
    private KeyWordRepository keyWordRepository;

    @Mock
    private MLServiceClient mlServiceClient;

    @InjectMocks
    private PythonModelService pythonModelService;

    private ContentRequest testRequest;
    private ContentResponse testResponse;

    @BeforeEach
    void setUp() {
        testRequest = ContentRequest.builder()
                .title("Test Title")
                .content("Test content for classification")
                .build();

        testResponse = ContentResponse.builder()
                .category("Backend")
                .score(0.95)
                .keywords(List.of("Java", "Spring Boot"))
                .modelUsed("TF-IDF + LogisticRegression")
                .processingTimeMs(50L)
                .build();
    }

    @Test
    void predictAndSave_Success() {
        // Given
        InputUser savedInput = InputUser.builder()
                .id(1L)
                .title(testRequest.getTitle())
                .content(testRequest.getContent())
                .build();

        Category category = Category.builder()
                .id(1L)
                .name("Backend")
                .build();

        KeyWord keyword1 = KeyWord.builder().id(1L).word("Java").build();
        KeyWord keyword2 = KeyWord.builder().id(2L).word("Spring Boot").build();

        when(inputUserRepository.save(any(InputUser.class))).thenReturn(savedInput);
        when(mlServiceClient.predict(any(ContentRequest.class))).thenReturn(testResponse);
        when(categoryRepository.findByName("Backend")).thenReturn(Optional.of(category));
        when(keyWordRepository.findByWord("Java")).thenReturn(Optional.of(keyword1));
        when(keyWordRepository.findByWord("Spring Boot")).thenReturn(Optional.of(keyword2));
        when(outputUserRepository.save(any(OutputUser.class))).thenAnswer(invocation -> {
            OutputUser saved = invocation.getArgument(0);
            saved.setId(1L);
            return saved;
        });

        // When
        ContentResponse result = pythonModelService.predictAndSave(testRequest);

        // Then
        assertNotNull(result);
        assertEquals("Backend", result.getCategory());
        assertEquals(0.95, result.getScore());
        assertEquals(1L, result.getInputId());
        assertEquals(1L, result.getOutputId());
        assertEquals(List.of("Java", "Spring Boot"), result.getKeywords());
        assertNotNull(result.getProcessingTimeMs());
        assertTrue(result.getProcessingTimeMs() >= 0);

        verify(inputUserRepository).save(any(InputUser.class));
        verify(mlServiceClient).predict(testRequest);
        verify(categoryRepository).findByName("Backend");
        verify(keyWordRepository).findByWord("Java");
        verify(keyWordRepository).findByWord("Spring Boot");
        verify(outputUserRepository).save(any(OutputUser.class));
    }

    @Test
    void predictAndSave_NewCategory_CreatesCategory() {
        // Given
        InputUser savedInput = InputUser.builder()
                .id(1L)
                .title(testRequest.getTitle())
                .content(testRequest.getContent())
                .build();

        Category newCategory = Category.builder()
                .id(1L)
                .name("Backend")
                .build();

        when(inputUserRepository.save(any(InputUser.class))).thenReturn(savedInput);
        when(mlServiceClient.predict(any(ContentRequest.class))).thenReturn(testResponse);
        when(categoryRepository.findByName("Backend")).thenReturn(Optional.empty());
        when(categoryRepository.save(any(Category.class))).thenReturn(newCategory);
        when(keyWordRepository.findByWord(anyString())).thenReturn(Optional.empty());
        when(keyWordRepository.save(any(KeyWord.class))).thenAnswer(invocation -> invocation.getArgument(0));
        when(outputUserRepository.save(any(OutputUser.class))).thenAnswer(invocation -> {
            OutputUser saved = invocation.getArgument(0);
            saved.setId(1L);
            return saved;
        });

        // When
        ContentResponse result = pythonModelService.predictAndSave(testRequest);

        // Then
        assertNotNull(result);
        assertEquals("Backend", result.getCategory());
        verify(categoryRepository).findByName("Backend");
        verify(categoryRepository).save(any(Category.class));
    }

    @Test
    void predictAndSave_NewKeywords_CreatesKeywords() {
        // Given
        InputUser savedInput = InputUser.builder().id(1L).build();
        Category category = Category.builder().id(1L).name("Backend").build();

        when(inputUserRepository.save(any(InputUser.class))).thenReturn(savedInput);
        when(mlServiceClient.predict(any(ContentRequest.class))).thenReturn(testResponse);
        when(categoryRepository.findByName("Backend")).thenReturn(Optional.of(category));
        when(keyWordRepository.findByWord("Java")).thenReturn(Optional.empty());
        when(keyWordRepository.save(any(KeyWord.class))).thenAnswer(invocation -> invocation.getArgument(0));
        when(keyWordRepository.findByWord("Spring Boot")).thenReturn(Optional.empty());
        when(outputUserRepository.save(any(OutputUser.class))).thenAnswer(invocation -> {
            OutputUser saved = invocation.getArgument(0);
            saved.setId(1L);
            return saved;
        });

        // When
        ContentResponse result = pythonModelService.predictAndSave(testRequest);

        // Then
        assertNotNull(result);
        verify(keyWordRepository, times(2)).save(any(KeyWord.class));
    }

    @Test
    void predictAndSaveBatch_Success() {
        // Given
        ContentRequest request1 = ContentRequest.builder().title("Title 1").content("Content 1").build();
        ContentRequest request2 = ContentRequest.builder().title("Title 2").content("Content 2").build();
        List<ContentRequest> requests = List.of(request1, request2);

        InputUser input1 = InputUser.builder().id(1L).build();
        InputUser input2 = InputUser.builder().id(2L).build();

        ContentResponse response1 = ContentResponse.builder()
                .category("Backend")
                .score(0.9)
                .keywords(List.of("Java"))
                .modelUsed("Test Model")
                .processingTimeMs(40L)
                .build();

        ContentResponse response2 = ContentResponse.builder()
                .category("Frontend")
                .score(0.85)
                .keywords(List.of("React"))
                .modelUsed("Test Model")
                .processingTimeMs(35L)
                .build();

        when(inputUserRepository.saveAll(anyList())).thenReturn(List.of(input1, input2));
        when(mlServiceClient.predictBatch(requests)).thenReturn(List.of(response1, response2));
        when(categoryRepository.findByName("Backend")).thenReturn(Optional.of(Category.builder().id(1L).name("Backend").build()));
        when(categoryRepository.findByName("Frontend")).thenReturn(Optional.of(Category.builder().id(2L).name("Frontend").build()));
        when(keyWordRepository.findByWord("Java")).thenReturn(Optional.of(KeyWord.builder().id(1L).word("Java").build()));
        when(keyWordRepository.findByWord("React")).thenReturn(Optional.of(KeyWord.builder().id(2L).word("React").build()));
        when(outputUserRepository.save(any(OutputUser.class))).thenAnswer(invocation -> {
            OutputUser saved = invocation.getArgument(0);
            saved.setId(saved.getInputUser().getId());
            return saved;
        });

        // When
        List<ContentResponse> results = pythonModelService.predictAndSaveBatch(requests);

        // Then
        assertEquals(2, results.size());
        assertEquals("Backend", results.get(0).getCategory());
        assertEquals("Frontend", results.get(1).getCategory());
        assertEquals(1L, results.get(0).getInputId());
        assertEquals(2L, results.get(1).getInputId());
        assertEquals(1L, results.get(0).getOutputId());
        assertEquals(2L, results.get(1).getOutputId());
    }
}

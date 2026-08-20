package com.team70.API.repository;

import com.team70.API.entity.KeyWord;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface KeyWordRepository extends JpaRepository<KeyWord, Long> {
    Optional<KeyWord> findByWord(String word);
}
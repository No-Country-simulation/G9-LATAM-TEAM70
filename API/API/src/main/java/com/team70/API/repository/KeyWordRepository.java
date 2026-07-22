package com.team70.API.repository;

import com.team70.API.entity.KeyWord;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface KeyWordRepository extends JpaRepository<KeyWord, Long> {
    KeyWord findByKeyword(String keyword);
}
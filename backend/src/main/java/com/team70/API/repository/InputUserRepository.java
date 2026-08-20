package com.team70.API.repository;

import com.team70.API.entity.InputUser;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface InputUserRepository extends JpaRepository<InputUser, Long> {
    List<InputUser> findAllByOrderByCreatedAtDesc();
}
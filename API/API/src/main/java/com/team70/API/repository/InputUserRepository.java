package com.team70.API.repository;

import com.team70.API.entity.InputUser;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface InputUserRepository extends JpaRepository<InputUser, Long> {
}
package com.team70.API.repository;

import com.team70.API.entity.OutputUser;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface OutputUserRepository extends JpaRepository<OutputUser, Long> {
}
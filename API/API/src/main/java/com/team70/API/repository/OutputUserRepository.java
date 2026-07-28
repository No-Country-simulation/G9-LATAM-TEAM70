package com.team70.API.repository;

import com.team70.API.entity.OutputUser;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface OutputUserRepository extends JpaRepository<OutputUser, Long> {
    
    @Query("SELECT o FROM OutputUser o WHERE o.inputUser.id = :inputUserId")
    Optional<OutputUser> findByInputUserId(@Param("inputUserId") Long inputUserId);
    
    List<OutputUser> findAllByOrderByCreatedAtDesc();
    
    List<OutputUser> findByCategoryIdOrderByCreatedAtDesc(Long categoryId);
}
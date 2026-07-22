package com.team70.API.entity;

import jakarta.persistence.*;
import lombok.*;

import java.util.HashSet;
import java.util.Set;

@Entity
@Table(name = "keywords")
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@EqualsAndHashCode(onlyExplicitlyIncluded = true)
public class KeyWord {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @EqualsAndHashCode.Include
    private Long id;

    @Column(name = "keyword", nullable = false, unique = true, length = 100)
    private String keyword;

    @ManyToMany(mappedBy = "keywords")
    @Builder.Default
    private Set<OutputUser> outputUsers = new HashSet<>();
}
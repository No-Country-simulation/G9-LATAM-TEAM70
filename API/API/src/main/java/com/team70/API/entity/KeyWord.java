package com.team70.API.entity;

import jakarta.persistence.*;
import lombok.*;

import java.util.HashSet;
import java.util.Set;

@Entity
@Table(name = "key_words")
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

    @Column(name = "word", nullable = false, unique = true, length = 50)
    private String word;

    @ManyToMany(mappedBy = "keywords")
    @Builder.Default
    private Set<OutputUser> outputUsers = new HashSet<>();
}
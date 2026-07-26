package com.rivyuu.connect.entity;

import jakarta.persistence.*;
import lombok.*;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;

import java.time.LocalDateTime;
import java.util.List;

@Entity
@Table(name = "users")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class User {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private String id;

    @Column(nullable = false)
    private String name;

    @Column(nullable = false, unique = true)
    private String username;

    @Column(nullable = false, unique = true)
    private String email;

    @Column(nullable = false)
    private String password;

    @Column(columnDefinition = "TEXT")
    private String bio;

    private String location;

    private String avatarUrl;

    @Column(nullable = false)
    @Builder.Default
    private Double trustScore = 50.0;

    @Column(nullable = false)
    @Builder.Default
    private Integer reviewCount = 0;

    @Column(nullable = false)
    @Builder.Default
    private Integer helpfulVotes = 0;

    @Column(nullable = false)
    @Builder.Default
    private Integer followers = 0;

    @Column(nullable = false)
    @Builder.Default
    private Integer following = 0;

    @Column(nullable = false)
    @Builder.Default
    private Long xp = 0L;

    @Builder.Default
    private String level = "Bronze";

    @Builder.Default
    private Boolean isVerified = false;

    @Builder.Default
    private String role = "USER"; // USER, BUSINESS, ADMIN

    @ElementCollection
    @CollectionTable(name = "user_badges", joinColumns = @JoinColumn(name = "user_id"))
    @Column(name = "badge_id")
    private List<String> badges;

    @CreationTimestamp
    private LocalDateTime createdAt;

    @UpdateTimestamp
    private LocalDateTime updatedAt;
}

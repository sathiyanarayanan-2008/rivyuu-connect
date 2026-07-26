package com.rivyuu.connect.entity;

import jakarta.persistence.*;
import lombok.*;
import org.hibernate.annotations.CreationTimestamp;

import java.time.LocalDateTime;

@Entity
@Table(name = "businesses")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Business {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private String id;

    @Column(nullable = false)
    private String name;

    private String category;
    private String logoUrl;
    private String logoEmoji;
    private String description;
    private String website;

    @Builder.Default
    private Double averageRating = 0.0;

    @Builder.Default
    private Integer reviewCount = 0;

    @Builder.Default
    private Double trustScore = 50.0;

    @Builder.Default
    private Boolean verified = false;

    @Builder.Default
    private Integer responseRate = 0;

    @OneToOne
    @JoinColumn(name = "owner_user_id")
    private User owner;

    @CreationTimestamp
    private LocalDateTime createdAt;
}

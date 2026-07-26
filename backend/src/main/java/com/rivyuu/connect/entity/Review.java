package com.rivyuu.connect.entity;

import jakarta.persistence.*;
import lombok.*;
import org.hibernate.annotations.CreationTimestamp;

import java.time.LocalDateTime;
import java.util.List;

@Entity
@Table(name = "reviews")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Review {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private String id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", nullable = false)
    private User user;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "business_id", nullable = false)
    private Business business;

    @Column(nullable = false)
    private Integer rating;

    @Column(nullable = false)
    private String title;

    @Column(columnDefinition = "TEXT", nullable = false)
    private String content;

    @Builder.Default
    private Integer helpful = 0;

    @Builder.Default
    private Integer notHelpful = 0;

    @Builder.Default
    private Boolean verified = false;

    // AI Analysis fields
    private String aiSentiment;   // positive / negative / mixed
    private Integer aiScore;      // 0-100
    private String aiLabel;
    private Double aiConfidence;
    private Boolean isFake;
    private Boolean isSpam;

    @ElementCollection
    @CollectionTable(name = "review_tags", joinColumns = @JoinColumn(name = "review_id"))
    @Column(name = "tag")
    private List<String> tags;

    // Business response
    @Column(columnDefinition = "TEXT")
    private String responseText;
    private LocalDateTime responseAt;

    @CreationTimestamp
    private LocalDateTime createdAt;
}

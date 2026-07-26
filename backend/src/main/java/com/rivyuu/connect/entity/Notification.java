package com.rivyuu.connect.entity;

import jakarta.persistence.*;
import lombok.*;
import org.hibernate.annotations.CreationTimestamp;

import java.time.LocalDateTime;

@Entity
@Table(name = "notifications")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Notification {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private String id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", nullable = false)
    private User user;

    @Column(nullable = false)
    private String type;  // helpful_vote, badge_earned, business_response, follower, trust_score

    @Column(nullable = false, columnDefinition = "TEXT")
    private String message;

    private String link;

    @Builder.Default
    private Boolean read = false;

    @CreationTimestamp
    private LocalDateTime createdAt;
}

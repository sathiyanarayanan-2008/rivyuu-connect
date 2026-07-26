package com.rivyuu.connect.repository;

import com.rivyuu.connect.entity.Review;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import java.util.List;

public interface ReviewRepository extends JpaRepository<Review, String> {
    Page<Review> findByBusinessId(String businessId, Pageable pageable);
    Page<Review> findByUserId(String userId, Pageable pageable);
    Page<Review> findAllByOrderByCreatedAtDesc(Pageable pageable);
    Page<Review> findAllByOrderByHelpfulDesc(Pageable pageable);

    @Query("SELECT AVG(r.rating) FROM Review r WHERE r.business.id = :businessId")
    Double findAverageRatingByBusinessId(String businessId);

    long countByUserId(String userId);
    long countByBusinessId(String businessId);
}

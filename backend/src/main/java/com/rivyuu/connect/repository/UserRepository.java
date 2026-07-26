package com.rivyuu.connect.repository;

import com.rivyuu.connect.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import java.util.List;
import java.util.Optional;

public interface UserRepository extends JpaRepository<User, String> {
    Optional<User> findByEmail(String email);
    Optional<User> findByUsername(String username);
    boolean existsByEmail(String email);
    boolean existsByUsername(String username);

    @Query("SELECT u FROM User u ORDER BY u.trustScore DESC")
    List<User> findTopByTrustScore();

    @Query("SELECT u FROM User u ORDER BY u.reviewCount DESC")
    List<User> findTopByReviewCount();

    @Query("SELECT u FROM User u ORDER BY u.helpfulVotes DESC")
    List<User> findTopByHelpfulVotes();
}

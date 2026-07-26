package com.rivyuu.connect.service;

import com.rivyuu.connect.dto.ReviewDTO;
import com.rivyuu.connect.entity.Review;
import com.rivyuu.connect.repository.ReviewRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class ReviewService {

    private final ReviewRepository reviewRepository;
    private final AIService aiService;

    public Page<Review> findReviews(String businessId, String userId, String sort, Pageable pageable) {
        if (businessId != null) return reviewRepository.findByBusinessId(businessId, pageable);
        if (userId != null) return reviewRepository.findByUserId(userId, pageable);
        if ("helpful".equals(sort)) return reviewRepository.findAllByOrderByHelpfulDesc(pageable);
        return reviewRepository.findAllByOrderByCreatedAtDesc(pageable);
    }

    public Review findById(String id) {
        return reviewRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Review not found"));
    }

    public Review createReview(ReviewDTO dto) {
        // AI analysis happens asynchronously in production
        Review review = Review.builder()
                .rating(dto.getRating())
                .title(dto.getTitle())
                .content(dto.getContent())
                .tags(dto.getTags())
                .build();

        // Run AI analysis
        String sentiment = aiService.analyzeSentiment(dto.getContent());
        review.setAiSentiment(sentiment);
        review.setAiScore(aiService.computeScore(dto.getContent(), sentiment));

        return reviewRepository.save(review);
    }

    public Review updateReview(String id, ReviewDTO dto) {
        Review review = findById(id);
        review.setTitle(dto.getTitle());
        review.setContent(dto.getContent());
        review.setRating(dto.getRating());
        return reviewRepository.save(review);
    }

    public void deleteReview(String id) {
        reviewRepository.deleteById(id);
    }

    public Review vote(String id, String type) {
        Review review = findById(id);
        if ("helpful".equals(type)) review.setHelpful(review.getHelpful() + 1);
        else review.setNotHelpful(review.getNotHelpful() + 1);
        return reviewRepository.save(review);
    }

    public Review addBusinessResponse(String id, String text) {
        Review review = findById(id);
        review.setResponseText(text);
        review.setResponseAt(java.time.LocalDateTime.now());
        return reviewRepository.save(review);
    }
}

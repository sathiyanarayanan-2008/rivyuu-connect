package com.rivyuu.connect.controller;

import com.rivyuu.connect.dto.ReviewDTO;
import com.rivyuu.connect.service.ReviewService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.PageRequest;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/reviews")
@RequiredArgsConstructor
public class ReviewController {

    private final ReviewService reviewService;

    @GetMapping
    public ResponseEntity<?> getAllReviews(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size,
            @RequestParam(required = false) String businessId,
            @RequestParam(required = false) String userId,
            @RequestParam(defaultValue = "recent") String sort) {
        return ResponseEntity.ok(reviewService.findReviews(businessId, userId, sort, PageRequest.of(page, size)));
    }

    @GetMapping("/{id}")
    public ResponseEntity<?> getReview(@PathVariable String id) {
        return ResponseEntity.ok(reviewService.findById(id));
    }

    @PostMapping
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<?> createReview(@Valid @RequestBody ReviewDTO dto) {
        return ResponseEntity.ok(reviewService.createReview(dto));
    }

    @PutMapping("/{id}")
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<?> updateReview(@PathVariable String id, @Valid @RequestBody ReviewDTO dto) {
        return ResponseEntity.ok(reviewService.updateReview(id, dto));
    }

    @DeleteMapping("/{id}")
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<?> deleteReview(@PathVariable String id) {
        reviewService.deleteReview(id);
        return ResponseEntity.noContent().build();
    }

    @PostMapping("/{id}/vote")
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<?> vote(@PathVariable String id, @RequestParam String type) {
        return ResponseEntity.ok(reviewService.vote(id, type));
    }

    @PostMapping("/{id}/respond")
    @PreAuthorize("hasRole('BUSINESS')")
    public ResponseEntity<?> businessRespond(@PathVariable String id, @RequestParam String text) {
        return ResponseEntity.ok(reviewService.addBusinessResponse(id, text));
    }
}

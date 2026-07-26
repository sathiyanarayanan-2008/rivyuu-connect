package com.rivyuu.connect.service;

import org.springframework.stereotype.Service;

import java.util.Arrays;
import java.util.List;

/**
 * AI Service — Sentiment analysis and fake review detection.
 * In production, this would call a Python NLP microservice (e.g., HuggingFace Transformers).
 * For demo, uses keyword-based heuristics.
 */
@Service
public class AIService {

    private static final List<String> POSITIVE_WORDS = Arrays.asList(
            "great", "excellent", "amazing", "love", "fantastic", "perfect", "best",
            "wonderful", "outstanding", "recommend", "superb", "brilliant", "awesome"
    );

    private static final List<String> NEGATIVE_WORDS = Arrays.asList(
            "bad", "terrible", "worst", "hate", "awful", "horrible", "disappointed",
            "useless", "poor", "pathetic", "scam", "fraud", "broken", "waste"
    );

    private static final List<String> SPAM_PATTERNS = Arrays.asList(
            "buy now", "click here", "promo code", "free money", "100% guaranteed",
            "limited offer", "act now", "special deal"
    );

    /**
     * Analyze sentiment: returns "positive", "negative", or "mixed"
     */
    public String analyzeSentiment(String text) {
        String lower = text.toLowerCase();
        long positiveCount = POSITIVE_WORDS.stream().filter(lower::contains).count();
        long negativeCount = NEGATIVE_WORDS.stream().filter(lower::contains).count();

        if (positiveCount > negativeCount + 1) return "positive";
        if (negativeCount > positiveCount + 1) return "negative";
        return "mixed";
    }

    /**
     * Compute a 0-100 trust/sentiment score
     */
    public Integer computeScore(String text, String sentiment) {
        String lower = text.toLowerCase();
        long positiveCount = POSITIVE_WORDS.stream().filter(lower::contains).count();
        long negativeCount = NEGATIVE_WORDS.stream().filter(lower::contains).count();
        int wordCount = text.trim().split("\\s+").length;

        int base;
        switch (sentiment) {
            case "positive" -> base = 65 + (int) Math.min(30, positiveCount * 8);
            case "negative" -> base = 40 - (int) Math.min(25, negativeCount * 7);
            default -> base = 45;
        }

        // Bonus for detailed reviews
        if (wordCount > 50) base += 5;
        if (wordCount > 100) base += 5;

        return Math.max(5, Math.min(100, base));
    }

    /**
     * Detect if a review is spam/fake
     */
    public boolean isFakeReview(String text) {
        String lower = text.toLowerCase();
        int wordCount = text.trim().split("\\s+").length;
        boolean hasSpamPattern = SPAM_PATTERNS.stream().anyMatch(lower::contains);
        return wordCount < 10 || hasSpamPattern;
    }

    /**
     * Generate AI label from sentiment and score
     */
    public String generateLabel(String sentiment, int score) {
        return switch (sentiment) {
            case "positive" -> score >= 85 ? "Highly Positive & Authentic" : "Positive with Valid Concerns";
            case "negative" -> "Negative — Specific Grievances";
            default -> "Mixed — Credible Issues Identified";
        };
    }
}

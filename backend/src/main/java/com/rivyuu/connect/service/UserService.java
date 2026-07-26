package com.rivyuu.connect.service;

import com.rivyuu.connect.entity.User;
import com.rivyuu.connect.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.PageRequest;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Map;

@Service
@RequiredArgsConstructor
public class UserService {

    private final UserRepository userRepository;

    public List<User> getLeaderboard(String metric, int page, int size) {
        PageRequest pr = PageRequest.of(page, size);
        return switch (metric) {
            case "reviews" -> userRepository.findTopByReviewCount();
            case "helpful" -> userRepository.findTopByHelpfulVotes();
            default -> userRepository.findTopByTrustScore();
        };
    }

    public User findById(String id) {
        return userRepository.findById(id).orElseThrow(() -> new RuntimeException("User not found"));
    }

    public User findByUsername(String username) {
        return userRepository.findByUsername(username).orElseThrow(() -> new RuntimeException("User not found"));
    }

    public User updateUser(String id, Map<String, Object> updates) {
        User user = findById(id);
        if (updates.containsKey("bio")) user.setBio((String) updates.get("bio"));
        if (updates.containsKey("location")) user.setLocation((String) updates.get("location"));
        if (updates.containsKey("name")) user.setName((String) updates.get("name"));
        return userRepository.save(user);
    }

    public Map<String, Object> follow(String targetId) {
        User target = findById(targetId);
        target.setFollowers(target.getFollowers() + 1);
        userRepository.save(target);
        return Map.of("success", true, "followers", target.getFollowers());
    }

    /**
     * Recalculates trust score based on review quality, consistency and community feedback.
     * Formula: base(50) + quality_bonus + activity_bonus + community_bonus
     */
    public Double calculateTrustScore(User user) {
        double base = 50.0;
        double activityBonus = Math.min(20, user.getReviewCount() * 0.5);
        double helpfulBonus = Math.min(15, user.getHelpfulVotes() * 0.05);
        double verifiedBonus = user.getIsVerified() ? 10 : 0;
        double badgeBonus = Math.min(5, (user.getBadges() != null ? user.getBadges().size() : 0) * 1.0);
        return Math.min(100, base + activityBonus + helpfulBonus + verifiedBonus + badgeBonus);
    }
}

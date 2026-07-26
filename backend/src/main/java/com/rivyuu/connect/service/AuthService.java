package com.rivyuu.connect.service;

import com.rivyuu.connect.dto.LoginRequest;
import com.rivyuu.connect.dto.RegisterRequest;
import com.rivyuu.connect.entity.User;
import com.rivyuu.connect.repository.UserRepository;
import com.rivyuu.connect.security.JwtTokenProvider;
import lombok.RequiredArgsConstructor;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Map;

@Service
@RequiredArgsConstructor
public class AuthService {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtTokenProvider jwtTokenProvider;
    private final AuthenticationManager authenticationManager;

    public Map<String, Object> register(RegisterRequest req) {
        if (userRepository.existsByEmail(req.getEmail())) {
            throw new RuntimeException("Email already registered");
        }
        User user = User.builder()
                .name(req.getName())
                .email(req.getEmail())
                .username(req.getName().toLowerCase().replaceAll("\\s+", ""))
                .password(passwordEncoder.encode(req.getPassword()))
                .badges(List.of("early-adopter"))
                .build();
        userRepository.save(user);

        String token = jwtTokenProvider.generateToken(user.getId(), user.getEmail(), user.getRole());
        return Map.of("token", token, "user", user);
    }

    public Map<String, Object> login(LoginRequest req) {
        authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(req.getEmail(), req.getPassword())
        );
        User user = userRepository.findByEmail(req.getEmail())
                .orElseThrow(() -> new RuntimeException("User not found"));
        String token = jwtTokenProvider.generateToken(user.getId(), user.getEmail(), user.getRole());
        return Map.of("token", token, "user", user);
    }

    public User getCurrentUser(String token) {
        String userId = jwtTokenProvider.getUserIdFromToken(token);
        return userRepository.findById(userId).orElseThrow(() -> new RuntimeException("User not found"));
    }
}

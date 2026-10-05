package org.example.pcbuilder.controller;

import org.example.pcbuilder.model.User;
import org.example.pcbuilder.service.UserService;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("/api/users")
@CrossOrigin(origins = {"http://localhost:3000", "http://localhost:5173"}, allowCredentials = "true")
public class UserController {

    private static final Logger logger = LoggerFactory.getLogger(UserController.class);

    private final UserService userService;

    public UserController(UserService userService) {
        this.userService = userService;
    }

    // Получить публичный профиль пользователя
    @GetMapping("/{username}")
    public ResponseEntity<?> getPublicProfile(@PathVariable String username) {
        try {
            User user = userService.findByUsername(username)
                    .orElseThrow(() -> new RuntimeException("User not found"));

            Map<String, Object> profile = new HashMap<>();
            profile.put("username", user.getUsername());
            profile.put("bio", user.getBio() != null ? user.getBio() : "");
            profile.put("avatarUrl", user.getAvatarUrl());
            profile.put("registeredAt", user.getRegisteredAt());
            profile.put("totalBuilds", user.getTotalBuilds());
            profile.put("totalViews", user.getTotalViews());

            return ResponseEntity.ok(profile);
        } catch (Exception e) {
            logger.error("Failed to get public profile for user: {}", username, e);
            return ResponseEntity.status(404).body(Map.of("error", "User not found"));
        }
    }

    // Получить свой профиль (с приватной информацией)
    @GetMapping("/me")
    public ResponseEntity<?> getMyProfile(Authentication auth) {
        try {
            if (auth == null) {
                return ResponseEntity.status(401).body(Map.of("error", "Not authenticated"));
            }

            String username = auth.getName();
            User user = userService.findByUsername(username)
                    .orElseThrow(() -> new RuntimeException("User not found"));

            Map<String, Object> profile = new HashMap<>();
            profile.put("id", user.getId());
            profile.put("username", user.getUsername());
            profile.put("email", user.getEmail() != null ? user.getEmail() : "");
            profile.put("bio", user.getBio() != null ? user.getBio() : "");
            profile.put("avatarUrl", user.getAvatarUrl());
            profile.put("registeredAt", user.getRegisteredAt());
            profile.put("totalBuilds", user.getTotalBuilds());
            profile.put("totalViews", user.getTotalViews());
            profile.put("role", user.getRole());

            return ResponseEntity.ok(profile);
        } catch (Exception e) {
            logger.error("Failed to get profile for authenticated user", e);
            return ResponseEntity.status(500).body(Map.of("error", "Failed to load profile"));
        }
    }

    // Обновить свой профиль
    @PutMapping("/me")
    public ResponseEntity<?> updateMyProfile(@RequestBody Map<String, String> body, Authentication auth) {
        try {
            if (auth == null) {
                return ResponseEntity.status(401).body(Map.of("error", "Not authenticated"));
            }

            String username = auth.getName();
            User user = userService.findByUsername(username)
                    .orElseThrow(() -> new RuntimeException("User not found"));

            // Обновляем поля
            if (body.containsKey("email")) {
                user.setEmail(body.get("email"));
            }
            if (body.containsKey("bio")) {
                String bio = body.get("bio");
                if (bio != null && bio.length() > 500) {
                    return ResponseEntity.badRequest().body(Map.of("error", "Bio is too long (max 500 characters)"));
                }
                user.setBio(bio);
            }
            if (body.containsKey("avatarUrl")) {
                user.setAvatarUrl(body.get("avatarUrl"));
            }

            userService.save(user);

            return ResponseEntity.ok(Map.of(
                    "message", "Profile updated successfully",
                    "user", user
            ));
        } catch (Exception e) {
            logger.error("Failed to update profile for user: {}", auth != null ? auth.getName() : "unknown", e);
            return ResponseEntity.status(500).body(Map.of("error", "Failed to update profile"));
        }
    }
}
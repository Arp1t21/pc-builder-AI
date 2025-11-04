package org.example.pcbuilder.controller;

import org.example.pcbuilder.config.JwtUtils;
import org.example.pcbuilder.model.User;
import org.example.pcbuilder.service.UserService;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import java.time.Instant;
import java.util.Map;

@RestController
@RequestMapping("/api/auth")
public class AuthController {

    private static final Logger logger = LoggerFactory.getLogger(AuthController.class);

    private final UserService userService;
    private final PasswordEncoder encoder;
    private final AuthenticationManager authManager;
    private final JwtUtils jwtUtils;

    public AuthController(UserService userService, PasswordEncoder encoder,
                          AuthenticationManager authManager, JwtUtils jwtUtils) {
        this.userService = userService;
        this.encoder = encoder;
        this.authManager = authManager;
        this.jwtUtils = jwtUtils;
    }

    @PostMapping("/register")
    public ResponseEntity<?> register(@RequestBody Map<String, String> body) {
        try {
            String username = body.get("username");
            String password = body.get("password");
            String email = body.get("email");

            // Валидация
            if (username == null || username.trim().isEmpty()) {
                return ResponseEntity.badRequest().body(Map.of("error", "Username is required"));
            }
            if (password == null || password.length() < 6) {
                return ResponseEntity.badRequest().body(Map.of("error", "Password must be at least 6 characters"));
            }

            // Проверка существования пользователя
            if (userService.findByUsername(username).isPresent()) {
                return ResponseEntity.badRequest().body(Map.of("error", "Username already exists"));
            }

            // Создание пользователя
            User user = new User();
            user.setUsername(username);
            user.setPasswordHash(encoder.encode(password));
            user.setEmail(email);
            user.setRole("ROLE_USER");
            user.setRegisteredAt(Instant.now());
            user.setTotalBuilds(0);
            user.setTotalViews(0);

            userService.save(user);

            return ResponseEntity.ok(Map.of(
                    "message", "User registered successfully",
                    "username", username
            ));
        } catch (Exception e) {
            logger.error("Registration failed for user: {}", body.get("username"), e);
            return ResponseEntity.status(500).body(Map.of("error", "Registration failed: " + e.getMessage()));
        }
    }

    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody Map<String, String> body) {
        try {
            String username = body.get("username");
            String password = body.get("password");

            // Валидация
            if (username == null || password == null) {
                return ResponseEntity.badRequest().body(Map.of("error", "Username and password are required"));
            }

            // Проверка существования пользователя
            if (userService.findByUsername(username).isEmpty()) {
                return ResponseEntity.status(401).body(Map.of("error", "Invalid username or password"));
            }

            // Аутентификация
            authManager.authenticate(
                    new UsernamePasswordAuthenticationToken(username, password)
            );

            // Генерация токена
            String token = jwtUtils.generateToken(username);

            return ResponseEntity.ok(Map.of(
                    "token", token,
                    "username", username,
                    "message", "Login successful"
            ));
        } catch (Exception e) {
            logger.error("Login failed for user: {}", body.get("username"), e);
            return ResponseEntity.status(401).body(Map.of("error", "Invalid username or password"));
        }
    }

    @GetMapping("/me")
    public ResponseEntity<?> getCurrentUser(@RequestHeader("Authorization") String authHeader) {
        try {
            String token = authHeader.substring(7); // Remove "Bearer "
            String username = jwtUtils.extractUsername(token);

            User user = userService.findByUsername(username)
                    .orElseThrow(() -> new RuntimeException("User not found"));

            return ResponseEntity.ok(Map.of(
                    "username", user.getUsername(),
                    "email", user.getEmail() != null ? user.getEmail() : "",
                    "role", user.getRole()
            ));
        } catch (Exception e) {
            logger.error("Failed to get current user", e);
            return ResponseEntity.status(401).body(Map.of("error", "Unauthorized"));
        }
    }
}
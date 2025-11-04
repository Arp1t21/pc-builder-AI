package org.example.pcbuilder.controller;

import org.example.pcbuilder.model.BuildReaction;
import org.example.pcbuilder.model.PcBuild;
import org.example.pcbuilder.model.User;
import org.example.pcbuilder.service.BuildReactionService;
import org.example.pcbuilder.service.BuildService;
import org.example.pcbuilder.service.UserService;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import java.time.Instant;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/builds")
@CrossOrigin(origins = {"http://localhost:3000", "http://localhost:5173"}, allowCredentials = "true")
public class BuildController {

    private static final Logger logger = LoggerFactory.getLogger(BuildController.class);

    private final BuildService buildService;
    private final UserService userService;
    private final BuildReactionService reactionService;

    public BuildController(BuildService buildService, UserService userService, BuildReactionService reactionService) {
        this.buildService = buildService;
        this.userService = userService;
        this.reactionService = reactionService;
    }

    @PostMapping
    public ResponseEntity<?> createBuild(@RequestBody Map<String, Object> body, Authentication auth) {
        try {
            if (auth == null) {
                return ResponseEntity.status(401).body(Map.of("error", "Not authenticated"));
            }

            String username = auth.getName();
            User owner = userService.findByUsername(username)
                    .orElseThrow(() -> new RuntimeException("User not found"));

            // Проверяем лимит сборок (10 максимум)
            List<PcBuild> existingBuilds = buildService.getByOwner(owner);
            if (existingBuilds.size() >= 10) {
                return ResponseEntity.status(400).body(Map.of("error", "Maximum 10 builds allowed"));
            }

            PcBuild build = new PcBuild();
            build.setName((String) body.getOrDefault("name", "Моя сборка " + (existingBuilds.size() + 1)));
            build.setDescription((String) body.getOrDefault("description", ""));

            Object componentsObj = body.get("componentsJson");
            String componentsJson;
            if (componentsObj instanceof String) {
                componentsJson = (String) componentsObj;
            } else {
                componentsJson = componentsObj != null ? componentsObj.toString() : "{}";
            }
            build.setComponentsJson(componentsJson);

            // Получаем totalPrice
            Object priceObj = body.get("totalPrice");
            Double totalPrice = 0.0;
            if (priceObj instanceof Number) {
                totalPrice = ((Number) priceObj).doubleValue();
            } else if (priceObj instanceof String) {
                try {
                    totalPrice = Double.parseDouble((String) priceObj);
                } catch (NumberFormatException e) {
                    totalPrice = 0.0;
                }
            }
            build.setTotalPrice(totalPrice);

            build.setCreatedAt(Instant.now());
            build.setOwner(owner);
            build.setPublished(Boolean.parseBoolean(String.valueOf(body.getOrDefault("published", "false"))));
            build.setLikesCount(0);
            build.setDislikesCount(0);

            PcBuild saved = buildService.save(build);

            return ResponseEntity.ok(Map.of(
                    "message", "Build saved successfully",
                    "build", saved
            ));
        } catch (Exception e) {
            logger.error("Failed to create build for user: {}", auth != null ? auth.getName() : "unknown", e);
            return ResponseEntity.status(500).body(Map.of("error", "Failed to create build: " + e.getMessage()));
        }
    }

    @GetMapping("/my")
    public ResponseEntity<?> myBuilds(Authentication auth) {
        try {
            if (auth == null) {
                return ResponseEntity.status(401).body(Map.of("error", "Not authenticated"));
            }

            String username = auth.getName();
            User owner = userService.findByUsername(username)
                    .orElseThrow(() -> new RuntimeException("User not found"));

            List<PcBuild> builds = buildService.getByOwner(owner);
            return ResponseEntity.ok(builds);
        } catch (Exception e) {
            logger.error("Failed to load builds for user: {}", auth != null ? auth.getName() : "unknown", e);
            return ResponseEntity.status(500).body(Map.of("error", "Failed to load builds: " + e.getMessage()));
        }
    }

    @GetMapping("/public")
    public ResponseEntity<?> publicBuilds() {
        try {
            List<PcBuild> builds = buildService.getPublicBuilds();
            return ResponseEntity.ok(builds);
        } catch (Exception e) {
            logger.error("Failed to load public builds", e);
            return ResponseEntity.status(500).body(Map.of("error", "Failed to load public builds: " + e.getMessage()));
        }
    }

    @GetMapping("/{id}")
    public ResponseEntity<?> getBuild(@PathVariable Long id) {
        try {
            var maybeBuild = buildService.findById(id);
            if (maybeBuild.isEmpty()) {
                return ResponseEntity.notFound().build();
            }
            return ResponseEntity.ok(maybeBuild.get());
        } catch (Exception e) {
            logger.error("Failed to load build with id: {}", id, e);
            return ResponseEntity.status(500).body(Map.of("error", "Failed to load build: " + e.getMessage()));
        }
    }

    @PutMapping("/{id}")
    public ResponseEntity<?> updateBuild(@PathVariable Long id, @RequestBody Map<String, Object> body, Authentication auth) {
        try {
            if (auth == null) {
                return ResponseEntity.status(401).body(Map.of("error", "Not authenticated"));
            }

            String username = auth.getName();
            var maybeBuild = buildService.findById(id);

            if (maybeBuild.isEmpty()) {
                return ResponseEntity.notFound().build();
            }

            PcBuild build = maybeBuild.get();

            // Проверка прав доступа
            if (!build.getOwner().getUsername().equals(username)) {
                return ResponseEntity.status(403).body(Map.of("error", "Access denied"));
            }

            // Обновляем поля
            if (body.containsKey("name")) {
                build.setName((String) body.get("name"));
            }
            if (body.containsKey("description")) {
                build.setDescription((String) body.get("description"));
            }
            if (body.containsKey("componentsJson")) {
                Object componentsObj = body.get("componentsJson");
                String componentsJson = componentsObj instanceof String
                        ? (String) componentsObj
                        : componentsObj.toString();
                build.setComponentsJson(componentsJson);
            }
            if (body.containsKey("published")) {
                build.setPublished(Boolean.parseBoolean(String.valueOf(body.get("published"))));
            }
            if (body.containsKey("totalPrice")) {
                Object priceObj = body.get("totalPrice");
                Double totalPrice = priceObj instanceof Number
                        ? ((Number) priceObj).doubleValue()
                        : Double.parseDouble(String.valueOf(priceObj));
                build.setTotalPrice(totalPrice);
            }

            PcBuild updated = buildService.save(build);

            return ResponseEntity.ok(Map.of(
                    "message", "Build updated successfully",
                    "build", updated
            ));
        } catch (Exception e) {
            logger.error("Failed to update build with id: {}", id, e);
            return ResponseEntity.status(500).body(Map.of("error", "Failed to update build: " + e.getMessage()));
        }
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<?> deleteBuild(@PathVariable Long id, Authentication auth) {
        try {
            if (auth == null) {
                return ResponseEntity.status(401).body(Map.of("error", "Not authenticated"));
            }

            String username = auth.getName();
            var maybeBuild = buildService.findById(id);

            if (maybeBuild.isEmpty()) {
                return ResponseEntity.notFound().build();
            }

            PcBuild build = maybeBuild.get();

            // Проверка прав доступа
            if (!build.getOwner().getUsername().equals(username)) {
                return ResponseEntity.status(403).body(Map.of("error", "Access denied"));
            }

            buildService.delete(build);
            return ResponseEntity.ok(Map.of("deleted", true, "message", "Build deleted successfully"));
        } catch (Exception e) {
            logger.error("Failed to delete build with id: {}", id, e);
            return ResponseEntity.status(500).body(Map.of("error", "Failed to delete build: " + e.getMessage()));
        }
    }

    // Reactions endpoints
    @PostMapping("/{id}/like")
    public ResponseEntity<?> likeBuild(@PathVariable Long id, Authentication auth) {
        try {
            if (auth == null) {
                return ResponseEntity.status(401).body(Map.of("error", "Not authenticated"));
            }

            String username = auth.getName();
            User user = userService.findByUsername(username)
                    .orElseThrow(() -> new RuntimeException("User not found"));

            var maybeBuild = buildService.findById(id);
            if (maybeBuild.isEmpty()) {
                return ResponseEntity.notFound().build();
            }

            PcBuild build = maybeBuild.get();
            reactionService.addReaction(build, user, BuildReaction.ReactionType.LIKE);

            // Перезагружаем сборку для получения обновленных счетчиков
            build = buildService.findById(id).get();

            return ResponseEntity.ok(Map.of(
                    "likesCount", build.getLikesCount(),
                    "dislikesCount", build.getDislikesCount(),
                    "userReaction", reactionService.getUserReaction(build, user).orElse(null)
            ));
        } catch (Exception e) {
            logger.error("Failed to like build with id: {}", id, e);
            return ResponseEntity.status(500).body(Map.of("error", "Failed to like build: " + e.getMessage()));
        }
    }

    @PostMapping("/{id}/dislike")
    public ResponseEntity<?> dislikeBuild(@PathVariable Long id, Authentication auth) {
        try {
            if (auth == null) {
                return ResponseEntity.status(401).body(Map.of("error", "Not authenticated"));
            }

            String username = auth.getName();
            User user = userService.findByUsername(username)
                    .orElseThrow(() -> new RuntimeException("User not found"));

            var maybeBuild = buildService.findById(id);
            if (maybeBuild.isEmpty()) {
                return ResponseEntity.notFound().build();
            }

            PcBuild build = maybeBuild.get();
            reactionService.addReaction(build, user, BuildReaction.ReactionType.DISLIKE);

            // Перезагружаем сборку для получения обновленных счетчиков
            build = buildService.findById(id).get();

            return ResponseEntity.ok(Map.of(
                    "likesCount", build.getLikesCount(),
                    "dislikesCount", build.getDislikesCount(),
                    "userReaction", reactionService.getUserReaction(build, user).orElse(null)
            ));
        } catch (Exception e) {
            logger.error("Failed to dislike build with id: {}", id, e);
            return ResponseEntity.status(500).body(Map.of("error", "Failed to dislike build: " + e.getMessage()));
        }
    }

    @GetMapping("/{id}/reaction")
    public ResponseEntity<?> getBuildReaction(@PathVariable Long id, Authentication auth) {
        try {
            var maybeBuild = buildService.findById(id);
            if (maybeBuild.isEmpty()) {
                return ResponseEntity.notFound().build();
            }

            PcBuild build = maybeBuild.get();

            if (auth != null) {
                String username = auth.getName();
                User user = userService.findByUsername(username).orElse(null);
                if (user != null) {
                    var userReaction = reactionService.getUserReaction(build, user);
                    return ResponseEntity.ok(Map.of(
                            "likesCount", build.getLikesCount(),
                            "dislikesCount", build.getDislikesCount(),
                            "userReaction", userReaction.orElse(null)
                    ));
                }
            }

            return ResponseEntity.ok(Map.of(
                    "likesCount", build.getLikesCount(),
                    "dislikesCount", build.getDislikesCount(),
                    "userReaction", (Object) null
            ));
        } catch (Exception e) {
            logger.error("Failed to get build reaction with id: {}", id, e);
            return ResponseEntity.status(500).body(Map.of("error", "Failed to get reaction: " + e.getMessage()));
        }
    }
}
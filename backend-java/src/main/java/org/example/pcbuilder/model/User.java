package org.example.pcbuilder.model;

import jakarta.persistence.*;
import java.time.Instant;

@Entity
@Table(name = "users")
public class User {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(unique = true, nullable = false)
    private String username;

    private String email;

    @Column(nullable = false)
    private String passwordHash;

    @Column(nullable = false)
    private String role = "ROLE_USER";

    // Новые поля для профиля
    @Column(length = 500)
    private String bio; // Описание профиля

    @Column(columnDefinition = "TEXT")
    private String avatarUrl; // URL аватара

    @Column(nullable = false)
    private Instant registeredAt; // Дата регистрации

    // Статистика
    private Integer totalViews = 0; // Общее количество просмотров сборок
    private Integer totalBuilds = 0; // Общее количество сборок

    // Constructors
    public User() {
        this.role = "ROLE_USER";
        this.registeredAt = Instant.now();
        this.totalViews = 0;
        this.totalBuilds = 0;
    }

    public User(Long id, String username, String email, String passwordHash, String role) {
        this.id = id;
        this.username = username;
        this.email = email;
        this.passwordHash = passwordHash;
        this.role = role != null ? role : "ROLE_USER";
        this.registeredAt = Instant.now();
        this.totalViews = 0;
        this.totalBuilds = 0;
    }

    // Getters
    public Long getId() {
        return id;
    }

    public String getUsername() {
        return username;
    }

    public String getEmail() {
        return email;
    }

    public String getPasswordHash() {
        return passwordHash;
    }

    public String getRole() {
        return role != null ? role : "ROLE_USER";
    }

    public String getBio() {
        return bio;
    }

    public String getAvatarUrl() {
        return avatarUrl;
    }

    public Instant getRegisteredAt() {
        return registeredAt != null ? registeredAt : Instant.now();
    }

    public Integer getTotalViews() {
        return totalViews != null ? totalViews : 0;
    }

    public Integer getTotalBuilds() {
        return totalBuilds != null ? totalBuilds : 0;
    }

    // Setters
    public void setId(Long id) {
        this.id = id;
    }

    public void setUsername(String username) {
        this.username = username;
    }

    public void setEmail(String email) {
        this.email = email;
    }

    public void setPasswordHash(String passwordHash) {
        this.passwordHash = passwordHash;
    }

    public void setRole(String role) {
        this.role = role != null ? role : "ROLE_USER";
    }

    public void setBio(String bio) {
        this.bio = bio;
    }

    public void setAvatarUrl(String avatarUrl) {
        this.avatarUrl = avatarUrl;
    }

    public void setRegisteredAt(Instant registeredAt) {
        this.registeredAt = registeredAt;
    }

    public void setTotalViews(Integer totalViews) {
        this.totalViews = totalViews;
    }

    public void setTotalBuilds(Integer totalBuilds) {
        this.totalBuilds = totalBuilds;
    }
}
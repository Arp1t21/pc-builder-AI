package org.example.pcbuilder.model;

import jakarta.persistence.*;
import java.time.Instant;

@Entity
@Table(name = "pc_builds")
public class PcBuild {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String name;
    private String description;

    @Column(columnDefinition = "TEXT")
    private String componentsJson;

    private Instant createdAt;

    @ManyToOne
    @JoinColumn(name = "owner_id")
    private User owner;

    private boolean published;

    // Добавим поле для общей цены
    private Double totalPrice;

    // Constructors
    public PcBuild() {
    }

    public PcBuild(Long id, String name, String description, String componentsJson,
                   Instant createdAt, User owner, boolean published, Double totalPrice) {
        this.id = id;
        this.name = name;
        this.description = description;
        this.componentsJson = componentsJson;
        this.createdAt = createdAt;
        this.owner = owner;
        this.published = published;
        this.totalPrice = totalPrice;
    }

    // Getters
    public Long getId() {
        return id;
    }

    public String getName() {
        return name;
    }

    public String getDescription() {
        return description;
    }

    public String getComponentsJson() {
        return componentsJson;
    }

    public Instant getCreatedAt() {
        return createdAt;
    }

    public User getOwner() {
        return owner;
    }

    public boolean isPublished() {
        return published;
    }

    public Double getTotalPrice() {
        return totalPrice;
    }

    // Setters
    public void setId(Long id) {
        this.id = id;
    }

    public void setName(String name) {
        this.name = name;
    }

    public void setDescription(String description) {
        this.description = description;
    }

    public void setComponentsJson(String componentsJson) {
        this.componentsJson = componentsJson;
    }

    public void setCreatedAt(Instant createdAt) {
        this.createdAt = createdAt;
    }

    public void setOwner(User owner) {
        this.owner = owner;
    }

    public void setPublished(boolean published) {
        this.published = published;
    }

    public void setTotalPrice(Double totalPrice) {
        this.totalPrice = totalPrice;
    }

    @Column(name = "likes_count")
    private Integer likesCount = 0;

    @Column(name = "dislikes_count")
    private Integer dislikesCount = 0;

    // Геттеры и сеттеры
    public Integer getLikesCount() {
        return likesCount != null ? likesCount : 0;
    }

    public void setLikesCount(Integer likesCount) {
        this.likesCount = likesCount;
    }

    public Integer getDislikesCount() {
        return dislikesCount != null ? dislikesCount : 0;
    }

    public void setDislikesCount(Integer dislikesCount) {
        this.dislikesCount = dislikesCount;
    }


}
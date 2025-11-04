package org.example.pcbuilder.model;

import jakarta.persistence.*;
import java.time.Instant;

@Entity
@Table(name = "build_reactions", uniqueConstraints = {
        @UniqueConstraint(columnNames = {"build_id", "user_id"})
})
public class BuildReaction {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "build_id", nullable = false)
    private PcBuild build;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", nullable = false)
    private User user;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false, length = 10)
    private ReactionType reaction;

    @Column(name = "created_at", nullable = false)
    private Instant createdAt = Instant.now();

    public enum ReactionType {
        LIKE, DISLIKE
    }

    // Constructors
    public BuildReaction() {
    }

    // Getters and Setters
    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public PcBuild getBuild() {
        return build;
    }

    public void setBuild(PcBuild build) {
        this.build = build;
    }

    public User getUser() {
        return user;
    }

    public void setUser(User user) {
        this.user = user;
    }

    public ReactionType getReaction() {
        return reaction;
    }

    public void setReaction(ReactionType reaction) {
        this.reaction = reaction;
    }

    public Instant getCreatedAt() {
        return createdAt;
    }

    public void setCreatedAt(Instant createdAt) {
        this.createdAt = createdAt;
    }
}
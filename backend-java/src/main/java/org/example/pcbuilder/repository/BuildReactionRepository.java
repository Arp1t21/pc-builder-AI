package org.example.pcbuilder.repository;

import org.example.pcbuilder.model.BuildReaction;
import org.example.pcbuilder.model.PcBuild;
import org.example.pcbuilder.model.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface BuildReactionRepository extends JpaRepository<BuildReaction, Long> {
    Optional<BuildReaction> findByBuildAndUser(PcBuild build, User user);
    void deleteByBuildAndUser(PcBuild build, User user);
}
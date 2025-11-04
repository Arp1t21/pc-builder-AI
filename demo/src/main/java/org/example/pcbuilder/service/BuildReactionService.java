package org.example.pcbuilder.service;

import org.example.pcbuilder.model.BuildReaction;
import org.example.pcbuilder.model.PcBuild;
import org.example.pcbuilder.model.User;
import org.example.pcbuilder.repository.BuildReactionRepository;
import org.example.pcbuilder.repository.BuildRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.Optional;

@Service
public class BuildReactionService {

    private final BuildReactionRepository reactionRepository;
    private final BuildRepository buildRepository;

    public BuildReactionService(BuildReactionRepository reactionRepository, BuildRepository buildRepository) {
        this.reactionRepository = reactionRepository;
        this.buildRepository = buildRepository;
    }

    @Transactional
    public void addReaction(PcBuild build, User user, BuildReaction.ReactionType reactionType) {
        Optional<BuildReaction> existingReaction = reactionRepository.findByBuildAndUser(build, user);

        if (existingReaction.isPresent()) {
            BuildReaction reaction = existingReaction.get();
            BuildReaction.ReactionType oldType = reaction.getReaction();

            if (oldType == reactionType) {
                // Убрать реакцию
                reactionRepository.delete(reaction);
                updateBuildCounts(build, reactionType, -1);
            } else {
                // Изменить реакцию
                reaction.setReaction(reactionType);
                reactionRepository.save(reaction);
                updateBuildCounts(build, oldType, -1);
                updateBuildCounts(build, reactionType, 1);
            }
        } else {
            // Добавить новую реакцию
            BuildReaction reaction = new BuildReaction();
            reaction.setBuild(build);
            reaction.setUser(user);
            reaction.setReaction(reactionType);
            reactionRepository.save(reaction);
            updateBuildCounts(build, reactionType, 1);
        }
    }

    private void updateBuildCounts(PcBuild build, BuildReaction.ReactionType type, int delta) {
        if (type == BuildReaction.ReactionType.LIKE) {
            build.setLikesCount(build.getLikesCount() + delta);
        } else {
            build.setDislikesCount(build.getDislikesCount() + delta);
        }
        buildRepository.save(build);
    }

    public Optional<BuildReaction.ReactionType> getUserReaction(PcBuild build, User user) {
        return reactionRepository.findByBuildAndUser(build, user)
                .map(BuildReaction::getReaction);
    }
}
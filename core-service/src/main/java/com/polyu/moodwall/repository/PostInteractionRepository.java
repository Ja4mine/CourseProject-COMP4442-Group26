package com.polyu.moodwall.repository;

import com.polyu.moodwall.entity.PostInteraction;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface PostInteractionRepository extends JpaRepository<PostInteraction, Long> {
    Optional<PostInteraction> findByPostIdAndUserHashAndType(Long postId, String userHash, PostInteraction.InteractionType type);

    long countByPostIdAndType(Long postId, PostInteraction.InteractionType type);

    List<PostInteraction> findByPostIdAndTypeOrderByTimestampDesc(Long postId, PostInteraction.InteractionType type);
}
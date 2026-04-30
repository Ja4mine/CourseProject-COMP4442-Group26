package com.polyu.moodwall.service;

import com.polyu.moodwall.controller.WebSocketController;
import com.polyu.moodwall.entity.PostInteraction;
import com.polyu.moodwall.entity.WallPost;
import com.polyu.moodwall.event.PostCreatedEvent;
import com.polyu.moodwall.repository.PostInteractionRepository;
import com.polyu.moodwall.repository.WallPostRepository;
import lombok.experimental.Delegate;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;

@Service
public class WallService {
    private static final Logger log = LoggerFactory.getLogger(WallService.class);
    private static final boolean DEBUG = true;

    private final WallPostRepository wallPostRepository;
    private final RateLimitService rateLimitService;
    private final EventPublisher eventPublisher;
    @Delegate
    private final CommentService commentService;
    private final PostInteractionRepository postInteractionRepository;
    private final SimpMessagingTemplate messagingTemplate;

    public WallService(WallPostRepository wallPostRepository, RateLimitService rateLimitService,
                       EventPublisher eventPublisher, CommentService commentService,
                       PostInteractionRepository postInteractionRepository,
                       SimpMessagingTemplate messagingTemplate) {
        this.wallPostRepository = wallPostRepository;
        this.rateLimitService = rateLimitService;
        this.eventPublisher = eventPublisher;
        this.commentService = commentService;
        this.postInteractionRepository = postInteractionRepository;
        this.messagingTemplate = messagingTemplate;
    }

    @Transactional
    public WallPost createPost(String content, String imageUrl, String anonymousIdHash) {
        if (!DEBUG && !rateLimitService.canPost(anonymousIdHash)) {
            throw new RuntimeException("Rate limit exceeded");
        }

        WallPost post = new WallPost();
        post.setContent(content);
        post.setImageUrl(imageUrl);
        post.setAnonymousIdHash(anonymousIdHash);

        WallPost saved = wallPostRepository.save(post);

        eventPublisher.publishPostCreated(new PostCreatedEvent(
                saved.getId(),
                saved.getContent(),
                saved.getImageUrl(),
                saved.getAnonymousIdHash()
        ));
        messagingTemplate.convertAndSend("/topic/posts", saved);

        return saved;
    }

    public Page<WallPost> getPosts(Pageable pageable) {
        return wallPostRepository.findAllByOrderByCreateTimeDesc(pageable);
    }

    public List<WallPost> getTopPosts(int limit) {
        LocalDateTime yesterday = LocalDateTime.now().minusDays(1);
        return wallPostRepository.findTopPostsSince(yesterday, Pageable.ofSize(limit));
    }

    public List<PostInteraction> getComments(Long postId) {
        return postInteractionRepository.findByPostIdAndTypeOrderByTimestampDesc(postId, PostInteraction.InteractionType.COMMENT);
    }

    @Transactional
    public void addAiComment(Long postId, String aiComment) {
        commentService.commentPost(postId, "AI_MODERATOR", aiComment);
    }

    @Transactional
    public boolean likePost(Long postId, String userHash) {
        WallPost post = wallPostRepository.findById(postId)
                .orElseThrow(() -> new RuntimeException("Post not found: " + postId));

        boolean alreadyLiked = postInteractionRepository
                .findByPostIdAndUserHashAndType(postId, userHash, PostInteraction.InteractionType.LIKE)
                .isPresent();

        if (alreadyLiked) {
            log.warn("User {} already liked post {}", userHash, postId);
            return false;
        }

        PostInteraction interaction = new PostInteraction();
        interaction.setPost(post);
        interaction.setUserHash(userHash);
        interaction.setType(PostInteraction.InteractionType.LIKE);
        postInteractionRepository.save(interaction);

        post.setLikeCount(post.getLikeCount() + 1);
        wallPostRepository.save(post);

        messagingTemplate.convertAndSend("/topic/likes",
                new WebSocketController.LikeEvent(postId, post.getLikeCount()));

        log.info("User {} liked post {}, new like count: {}", userHash, postId, post.getLikeCount());
        return true;
    }
}
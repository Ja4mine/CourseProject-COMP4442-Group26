package com.polyu.moodwall.service;

import com.polyu.moodwall.controller.WebSocketController;
import com.polyu.moodwall.entity.PostInteraction;
import com.polyu.moodwall.entity.WallPost;
import com.polyu.moodwall.repository.PostInteractionRepository;
import com.polyu.moodwall.repository.WallPostRepository;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
public class CommentService {
    private static final Logger log = LoggerFactory.getLogger(CommentService.class);

    private final WallPostRepository wallPostRepository;
    private final PostInteractionRepository postInteractionRepository;
    private final SimpMessagingTemplate messagingTemplate;

    public CommentService(WallPostRepository wallPostRepository,
                          PostInteractionRepository postInteractionRepository,
                          SimpMessagingTemplate messagingTemplate) {
        this.wallPostRepository = wallPostRepository;
        this.postInteractionRepository = postInteractionRepository;
        this.messagingTemplate = messagingTemplate;
    }

    @Transactional
    public boolean commentPost(Long postId, String userHash, String comment) {
        WallPost post = wallPostRepository.findById(postId)
                .orElseThrow(() -> new RuntimeException("Post not found: " + postId));

        PostInteraction interaction = new PostInteraction();
        interaction.setPost(post);
        interaction.setUserHash(userHash);
        interaction.setType(PostInteraction.InteractionType.COMMENT);
        interaction.setContent(comment);
        postInteractionRepository.save(interaction);

        post.setCommentCount(post.getCommentCount() + 1);
        wallPostRepository.save(post);

        messagingTemplate.convertAndSend("/topic/comments",
                new WebSocketController.CommentEvent(postId, comment));

        log.info("User {} commented on post {}, comment count: {}", userHash, postId, post.getCommentCount());
        return true;
    }
}

package com.polyu.moodwall.controller;

import com.polyu.moodwall.entity.WallPost;
import lombok.RequiredArgsConstructor;
import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.messaging.handler.annotation.SendTo;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.stereotype.Controller;

@Controller
@RequiredArgsConstructor
public class WebSocketController {
    private final SimpMessagingTemplate messagingTemplate;

    @MessageMapping("/post.new")
    @SendTo("/topic/posts")
    public WallPost broadcastNewPost(WallPost post) {
        return post;
    }

    @MessageMapping("/post.like")
    @SendTo("/topic/likes")
    public LikeEvent broadcastLike(LikeEvent likeEvent) {
        return likeEvent;
    }

    @MessageMapping("/post.comment")
    @SendTo("/topic/comments")
    public CommentEvent broadcastComment(CommentEvent commentEvent) {
        return commentEvent;
    }

    public record LikeEvent(Long postId, Integer likeCount) {}
    public record CommentEvent(Long postId, String comment) {}
}
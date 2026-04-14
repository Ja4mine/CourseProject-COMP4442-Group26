package com.polyu.moodwall.controller;

import com.polyu.moodwall.entity.WallPost;
import com.polyu.moodwall.service.WallService;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/posts")
@RequiredArgsConstructor
public class PostController {
    private final WallService wallService;

    @PostMapping
    public ResponseEntity<WallPost> createPost(
            @RequestBody CreatePostRequest request,
            @RequestHeader("X-Anonymous-Id") String anonymousIdHash) {
        WallPost post = wallService.createPost(request.content(), request.imageUrl(), anonymousIdHash);
        return ResponseEntity.ok(post);
    }

    @GetMapping
    public ResponseEntity<Page<WallPost>> getPosts(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "20") int size) {
        Page<WallPost> posts = wallService.getApprovedPosts(PageRequest.of(page, size));
        return ResponseEntity.ok(posts);
    }

    @GetMapping("/top")
    public ResponseEntity<List<WallPost>> getTopPosts(@RequestParam(defaultValue = "10") int limit) {
        List<WallPost> topPosts = wallService.getTopPosts(limit);
        return ResponseEntity.ok(topPosts);
    }

    @PostMapping("/{postId}/like")
    public ResponseEntity<Void> likePost(
            @PathVariable Long postId,
            @RequestHeader("X-Anonymous-Id") String userHash) {
        wallService.likePost(postId, userHash);
        return ResponseEntity.ok().build();
    }

    @PostMapping("/{postId}/comment")
    public ResponseEntity<Void> commentPost(
            @PathVariable Long postId,
            @RequestHeader("X-Anonymous-Id") String userHash,
            @RequestBody String comment) {
        wallService.commentPost(postId, userHash, comment);
        return ResponseEntity.ok().build();
    }

    public record CreatePostRequest(String content, String imageUrl) {}
}
package com.polyu.moodwall.service;

import com.polyu.moodwall.entity.WallPost;
import com.polyu.moodwall.repository.WallPostRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;

@Service
@RequiredArgsConstructor
@Slf4j
public class WallService {
    private final WallPostRepository wallPostRepository;
    private final AIModeratorAgentService aiModeratorAgentService;
    private final RateLimitService rateLimitService;

    @Transactional
    public WallPost createPost(String content, String imageUrl, String anonymousIdHash) {
        if (!rateLimitService.canPost(anonymousIdHash)) {
            throw new RuntimeException("Rate limit exceeded");
        }

        WallPost post = new WallPost();
        post.setContent(content);
        post.setImageUrl(imageUrl);
        post.setAnonymousIdHash(anonymousIdHash);
        post.setStatus(WallPost.PostStatus.PENDING);

        WallPost saved = wallPostRepository.save(post);

        aiModeratorAgentService.processPostAsync(saved);

        return saved;
    }

    public Page<WallPost> getApprovedPosts(Pageable pageable) {
        return wallPostRepository.findByStatusOrderByCreateTimeDesc(WallPost.PostStatus.APPROVED, pageable);
    }

    public List<WallPost> getTopPosts(int limit) {
        LocalDateTime yesterday = LocalDateTime.now().minusDays(1);
        return wallPostRepository.findTopPostsSince(yesterday, Pageable.ofSize(limit));
    }

    @Transactional
    public void likePost(Long postId, String userHash) {
        // Implementation for like
    }

    @Transactional
    public void commentPost(Long postId, String userHash, String comment) {
        // Implementation for comment
    }
}
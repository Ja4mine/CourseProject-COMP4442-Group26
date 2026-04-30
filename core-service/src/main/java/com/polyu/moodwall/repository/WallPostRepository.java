package com.polyu.moodwall.repository;

import com.polyu.moodwall.entity.WallPost;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.List;

@Repository
public interface WallPostRepository extends JpaRepository<WallPost, Long> {
    Page<WallPost> findByStatusOrderByCreateTimeDesc(WallPost.PostStatus status, Pageable pageable);

    @Query("SELECT wp FROM WallPost wp WHERE wp.createTime >= :since AND wp.status = :status ORDER BY wp.likeCount DESC")
    List<WallPost> findTopPostsSince(LocalDateTime since, WallPost.PostStatus status, Pageable pageable);

    long countByAnonymousIdHashAndCreateTimeAfter(String anonymousIdHash, LocalDateTime after);
}
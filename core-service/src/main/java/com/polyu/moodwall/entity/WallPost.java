package com.polyu.moodwall.entity;

import jakarta.persistence.*;
import lombok.Data;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.JdbcTypeCode;
import org.hibernate.type.SqlTypes;

import java.time.LocalDateTime;
import java.util.List;

@Entity
@Table(name = "wall_post")
@Data
public class WallPost {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(columnDefinition = "TEXT")
    private String content;

    private String imageUrl;

    @Column(name = "anonymous_id_hash")
    private String anonymousIdHash;

    @JdbcTypeCode(SqlTypes.JSON)
    @Column(columnDefinition = "jsonb")
    private List<String> emotionTags;

    @Column(columnDefinition = "TEXT")
    private String aiReply;

    @CreationTimestamp
    private LocalDateTime createTime;

    @Enumerated(EnumType.STRING)
    private PostStatus status = PostStatus.PENDING;

    private Integer likeCount = 0;
    private Integer commentCount = 0;

    public enum PostStatus {
        PENDING, APPROVED, REJECTED, HIDDEN
    }
}
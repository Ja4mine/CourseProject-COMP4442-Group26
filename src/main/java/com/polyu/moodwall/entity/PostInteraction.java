package com.polyu.moodwall.entity;

import jakarta.persistence.*;
import lombok.Data;
import org.hibernate.annotations.CreationTimestamp;

import java.time.LocalDateTime;

@Entity
@Table(name = "post_interaction")
@Data
public class PostInteraction {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne
    @JoinColumn(name = "post_id")
    private WallPost post;

    @Enumerated(EnumType.STRING)
    private InteractionType type;

    private String userHash;

    @CreationTimestamp
    private LocalDateTime timestamp;

    public enum InteractionType {
        LIKE, COMMENT
    }
}
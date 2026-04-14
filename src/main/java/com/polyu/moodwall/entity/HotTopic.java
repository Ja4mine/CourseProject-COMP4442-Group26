package com.polyu.moodwall.entity;

import jakarta.persistence.*;
import lombok.Data;
import org.hibernate.annotations.CreationTimestamp;

import java.time.LocalDateTime;

@Entity
@Table(name = "hot_topic")
@Data
public class HotTopic {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String topic;

    private Integer postCount = 0;

    @Column(columnDefinition = "TEXT")
    private String summary;

    @CreationTimestamp
    private LocalDateTime createTime;
}
package com.polyu.moodwall.service;

import lombok.RequiredArgsConstructor;
import org.springframework.data.redis.core.RedisTemplate;
import org.springframework.data.redis.core.ZSetOperations;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.Set;

@Service
@RequiredArgsConstructor
public class ClickAnalyticsService {
    private final RedisTemplate<String, String> redisTemplate;
    private static final String POST_RANKING_KEY = "post:ranking:daily";
    private static final String TOPIC_RANKING_KEY = "topic:ranking:daily";

    public void recordPostClick(Long postId) {
        String member = "post:" + postId;
        redisTemplate.opsForZSet().incrementScore(POST_RANKING_KEY, member, 1);
    }

    public void recordTopicClick(String topic) {
        redisTemplate.opsForZSet().incrementScore(TOPIC_RANKING_KEY, topic, 1);
    }

    public Set<ZSetOperations.TypedTuple<String>> getTopPosts(int limit) {
        return redisTemplate.opsForZSet().reverseRangeWithScores(POST_RANKING_KEY, 0, limit - 1);
    }

    public Set<ZSetOperations.TypedTuple<String>> getTopTopics(int limit) {
        return redisTemplate.opsForZSet().reverseRangeWithScores(TOPIC_RANKING_KEY, 0, limit - 1);
    }

    public void resetDailyRankings() {
        redisTemplate.delete(POST_RANKING_KEY);
        redisTemplate.delete(TOPIC_RANKING_KEY);
    }
}
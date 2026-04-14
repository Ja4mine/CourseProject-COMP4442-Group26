package com.polyu.moodwall.service;

import lombok.RequiredArgsConstructor;
import org.springframework.data.redis.core.RedisTemplate;
import org.springframework.stereotype.Service;

import java.time.Duration;
import java.time.LocalDateTime;

@Service
@RequiredArgsConstructor
public class RateLimitService {
    private final RedisTemplate<String, String> redisTemplate;
    private static final String RATE_LIMIT_KEY_PREFIX = "rate:";
    private static final int POSTS_PER_HOUR = 10;

    public boolean canPost(String anonymousIdHash) {
        String key = RATE_LIMIT_KEY_PREFIX + anonymousIdHash;
        Long count = redisTemplate.opsForValue().increment(key);

        if (count == 1) {
            redisTemplate.expire(key, Duration.ofHours(1));
        }

        return count <= POSTS_PER_HOUR;
    }

    public void resetLimit(String anonymousIdHash) {
        String key = RATE_LIMIT_KEY_PREFIX + anonymousIdHash;
        redisTemplate.delete(key);
    }
}
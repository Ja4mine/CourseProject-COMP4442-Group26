package com.polyu.moodwall.event;

public record PostCreatedEvent(
        Long postId,
        String content,
        String imageUrl,
        String anonymousIdHash
) {}
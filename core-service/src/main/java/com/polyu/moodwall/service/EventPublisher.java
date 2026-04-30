package com.polyu.moodwall.service;

import com.polyu.moodwall.event.PostCreatedEvent;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.amqp.rabbit.core.RabbitTemplate;
import org.springframework.stereotype.Service;

@Service
public class EventPublisher {
    private static final Logger log = LoggerFactory.getLogger(EventPublisher.class);
    private final RabbitTemplate rabbitTemplate;

    public EventPublisher(RabbitTemplate rabbitTemplate) {
        this.rabbitTemplate = rabbitTemplate;
    }
    private static final String EXCHANGE_NAME = "post.events";
    private static final String ROUTING_KEY = "post.created";

    public void publishPostCreated(PostCreatedEvent event) {
        rabbitTemplate.convertAndSend(EXCHANGE_NAME, ROUTING_KEY, event);
        log.info("Published PostCreatedEvent for post {}", event.postId());
    }
}
package com.polyu.moodwall.service;

import com.polyu.moodwall.dto.AiCommentRequest;
import com.polyu.moodwall.event.PostCreatedEvent;
import com.polyu.moodwall.util.DeepSeekCommentGenerator;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.amqp.rabbit.annotation.RabbitListener;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;

@Service
@RequiredArgsConstructor
@Slf4j
public class PostCreatedEventListener {
    private final DeepSeekCommentGenerator commentGenerator;
    private final RestTemplate restTemplate;

    @Value("${core-service.url}")
    private String coreServiceUrl;

    @RabbitListener(queues = "ai.post.created.queue")
    public void handlePostCreated(PostCreatedEvent event) {
        log.debug("Received PostCreatedEvent for post {}", event.postId());
        try {
            String aiComment = commentGenerator.generateComment(event.content());
            log.debug("Generated AI comment for post {}: {}", event.postId(), aiComment);
            callCoreServiceToAddAiComment(event.postId(), aiComment);
        } catch (Exception e) {
            log.error("Failed to process post {}: {}", event.postId(), e.getMessage(), e);
        }
    }

    private void callCoreServiceToAddAiComment(Long postId, String aiComment) {
        String url = coreServiceUrl + "/api/posts/{postId}/ai-comment";
        AiCommentRequest request = new AiCommentRequest(aiComment);
        ResponseEntity<Void> response = restTemplate.postForEntity(url, request, Void.class, postId);
        if (response.getStatusCode().is2xxSuccessful()) {
            log.info("Successfully added AI comment to post {}", postId);
        } else {
            log.error("Failed to add AI comment to post {}, status: {}", postId, response.getStatusCode());
        }
    }
}

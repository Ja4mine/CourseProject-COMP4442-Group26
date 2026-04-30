package com.polyu.moodwall.util;

import lombok.extern.slf4j.Slf4j;
import org.springframework.ai.chat.client.ChatClient;
import org.springframework.stereotype.Service;

@Service
@Slf4j
public class DeepSeekCommentGenerator {

    private final ChatClient chatClient;

    public DeepSeekCommentGenerator(ChatClient.Builder builder) {
        this.chatClient = builder
                .defaultSystem("""
                    You are a friendly community AI assistant.
                    Your task is to write a short, positive, and encouraging comment based on the user's post content.
                    Requirements:
                    - The comment must not exceed 100 words
                    - The tone should be warm and friendly
                    - Do not repeat the original post content; instead, add valuable input or ask a question
                    - Do not use any Markdown formatting or special symbols
                    """)
                .build();
    }

    public String generateComment(String postContent) {
        try {

            String comment = chatClient.prompt()
                    .user("Post content: " + postContent)
                    .call()
                    .content();

            if (comment != null && !comment.isBlank()) {
                comment = comment.trim()
                        .replaceAll("\\n+", " ")
                        .replaceAll("\\*\\*|__", "");

                if (comment.length() > 150) {
                    comment = comment.substring(0, 147) + "...";
                }
            }

            log.info("Generated AI comment: {} for post: {}",
                    comment,
                    postContent.length() > 50 ? postContent.substring(0, 50) + "..." : postContent);
            return comment;
        } catch (Exception e) {
            log.error("Failed to generate AI comment: {}", e.getMessage());
            return "Thanks for sharing! Looking forward to more great content 👍";
        }
    }
}
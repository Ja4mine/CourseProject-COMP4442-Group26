package com.polyu.moodwall.service;

import com.polyu.moodwall.entity.WallPost;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.scheduling.annotation.Async;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
@Slf4j
public class AIModeratorAgentService {
//    private final ChatClient chatClient;
//
    @Async
    public void processPostAsync(WallPost post) {
//        try {
//            ChatResponse moderationResponse = chatClient.prompt()
//                    .system("You are an AI moderator for a university mood wall. Analyze the content for appropriateness, detect emotion, and generate tags.")
//                    .user(post.getContent())
//                    .call()
//                    .chatResponse();
//
//            String moderationResult = moderationResponse.getResult().getOutput().getContent();
//            boolean isAppropriate = moderationResult.contains("APPROVED");
//
//            if (isAppropriate) {
//                post.setStatus(WallPost.PostStatus.APPROVED);
//
//                ChatResponse tagResponse = chatClient.prompt()
//                        .system("Extract emotion tags from this post. Return as comma-separated list.")
//                        .user(post.getContent())
//                        .call()
//                        .chatResponse();
//
//                String tags = tagResponse.getResult().getOutput().getContent();
//                post.setEmotionTags(List.of(tags.split(",")));
//
//                ChatResponse replyResponse = chatClient.prompt()
//                        .system("Generate a witty, empathetic, or humorous reply to this student's mood post. Keep it short and engaging.")
//                        .user(post.getContent())
//                        .call()
//                        .chatResponse();
//
//                String aiReply = replyResponse.getResult().getOutput().getContent();
//                post.setAiReply(aiReply);
//
//                // Save updated post
//                // wallPostRepository.save(post);
//
//                log.info("AI processed post {}: tags={}, reply={}", post.getId(), tags, aiReply);
//            } else {
//                post.setStatus(WallPost.PostStatus.REJECTED);
//                // wallPostRepository.save(post);
//                log.warn("Post {} rejected by AI moderation", post.getId());
//            }
//        } catch (Exception e) {
//            log.error("AI moderation failed for post {}", post.getId(), e);
//            post.setStatus(WallPost.PostStatus.PENDING);
//            // wallPostRepository.save(post);
//        }
//    }
//
//    public String generateHotTopicSummary(List<String> posts) {
//        PromptTemplate promptTemplate = new PromptTemplate("""
//                Summarize the common themes and moods from these posts into a brief 'Hot Topic' summary.
//                Posts:
//                {posts}
//                """);
//
//        Prompt prompt = promptTemplate.create(Map.of("posts", String.join("\n", posts)));
//        ChatResponse response = chatClient.prompt(prompt).call().chatResponse();
//        return response.getResult().getOutput().getContent();
    }
}
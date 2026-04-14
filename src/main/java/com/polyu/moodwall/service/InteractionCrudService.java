package com.polyu.moodwall.service;

import com.polyu.moodwall.entity.Interaction;
import com.polyu.moodwall.entity.Post;
import com.polyu.moodwall.repository.InteractionRepository;
import com.polyu.moodwall.repository.PostRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class InteractionCrudService {

    private final InteractionRepository interactionRepository;
    private final PostRepository postRepository;

    public Interaction createInteraction(Long postId, Interaction interaction) {
        Post post = postRepository.findById(postId)
                .orElseThrow(() -> new IllegalArgumentException("Post not found: " + postId));
        interaction.setPost(post);
        return interactionRepository.save(interaction);
    }

    public List<Interaction> getAllInteractions() {
        return interactionRepository.findAll();
    }

    public Interaction getInteractionById(Long id) {
        return interactionRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("Interaction not found: " + id));
    }

    public List<Interaction> getInteractionsByPostId(Long postId) {
        return interactionRepository.findByPostId(postId);
    }

    public Interaction updateInteraction(Long id, Interaction updatedInteraction) {
        Interaction existingInteraction = getInteractionById(id);
        existingInteraction.setType(updatedInteraction.getType());
        existingInteraction.setUserId(updatedInteraction.getUserId());
        existingInteraction.setContent(updatedInteraction.getContent());
        return interactionRepository.save(existingInteraction);
    }

    public void deleteInteraction(Long id) {
        if (!interactionRepository.existsById(id)) {
            throw new IllegalArgumentException("Interaction not found: " + id);
        }
        interactionRepository.deleteById(id);
    }
}

package com.polyu.moodwall.repository;

import com.polyu.moodwall.entity.HotTopic;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface HotTopicRepository extends JpaRepository<HotTopic, Long> {
}
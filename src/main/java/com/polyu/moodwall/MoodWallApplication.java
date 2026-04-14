package com.polyu.moodwall;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.scheduling.annotation.EnableScheduling;

@SpringBootApplication
@EnableScheduling
public class MoodWallApplication {
    public static void main(String[] args) {
        SpringApplication.run(MoodWallApplication.class, args);
    }
}
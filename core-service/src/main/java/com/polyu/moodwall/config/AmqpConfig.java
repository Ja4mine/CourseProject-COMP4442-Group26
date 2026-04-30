package com.polyu.moodwall.config;

import org.springframework.amqp.core.*;
import org.springframework.amqp.support.converter.JacksonJsonMessageConverter;
import org.springframework.amqp.support.converter.MessageConverter;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

@Configuration
public class AmqpConfig {
    public static final String EXCHANGE_NAME = "post.events";
    public static final String ROUTING_KEY = "post.created";
    public static final String QUEUE_NAME = "ai.post.created.queue";
    public static final String DLQ_NAME = "ai.post.created.dlq";

    @Bean
    public Queue aiPostCreatedQueue() {
        return QueueBuilder.durable(QUEUE_NAME)
                .withArgument("x-dead-letter-exchange", "") // 默认直连交换机
                .withArgument("x-dead-letter-routing-key", DLQ_NAME)
                .build();
    }

    @Bean
    public Queue deadLetterQueue() {
        return QueueBuilder.durable(DLQ_NAME).build();
    }

    @Bean
    public MessageConverter jsonMessageConverter() {
        return new JacksonJsonMessageConverter();
    }

    @Bean
    public DirectExchange postEventsExchange() {
        return new DirectExchange(EXCHANGE_NAME);
    }

    @Bean
    public Binding binding(Queue aiPostCreatedQueue, DirectExchange postEventsExchange) {
        return BindingBuilder.bind(aiPostCreatedQueue).to(postEventsExchange).with(ROUTING_KEY);
    }
}
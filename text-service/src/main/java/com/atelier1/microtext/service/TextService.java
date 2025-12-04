package com.atelier1.microtext.service;

import com.atelier1.microtext.model.TextPrompt;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.jms.core.JmsTemplate;
import org.springframework.stereotype.Service;

@Service
public class TextService {

    @Autowired
    private JmsTemplate jmsTemplate;

    private final String QUEUE_NAME = "textPromptQueue";

    public void sendToQueue(TextPrompt prompt) {
        jmsTemplate.convertAndSend(QUEUE_NAME, prompt);
    }
}
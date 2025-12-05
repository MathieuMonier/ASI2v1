package com.cpe.springboot.prompt.controller;

import com.cpe.springboot.prompt.model.PromptModel;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.jms.core.JmsTemplate;
import org.springframework.stereotype.Service;

@Service
public class PromptService {

    @Autowired
    private PromptRepository promptRepository;

    @Autowired
    private JmsTemplate jmsTemplate;

    private final ObjectMapper mapper = new ObjectMapper();

    public PromptModel saveAndQueuePrompt(PromptModel prompt) {
        PromptModel saved = promptRepository.save(prompt);
        try {
            String json = mapper.writeValueAsString(saved);
            jmsTemplate.convertAndSend("promptQueue", json);
        } catch (Exception e) {
            System.err.println("Erreur lors de l'envoi JMS : " + e.getMessage());
        }
        return saved;
    }
}
package com.cpe.springboot.gen_card_service.service;

import com.cpe.springboot.gen_card_service.model.CardDTO;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.jms.core.JmsTemplate;
import org.springframework.stereotype.Service;

@Service
public class NotificationService {

    private final JmsTemplate jmsTemplate;
    private final ObjectMapper mapper = new ObjectMapper();

    @Value("${external.notification.queue:card-created}")
    private String notificationQueue;


    public NotificationService(JmsTemplate jmsTemplate) {
        this.jmsTemplate = jmsTemplate;
    }

    public void notifyCardCreated(CardDTO card) {
        try {
            String json = mapper.writeValueAsString(card);
            jmsTemplate.convertAndSend(notificationQueue, json);
        } catch (Exception e) {
            e.printStackTrace();
        }
    }
}

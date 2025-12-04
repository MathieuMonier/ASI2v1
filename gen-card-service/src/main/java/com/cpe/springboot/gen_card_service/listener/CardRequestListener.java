package com.cpe.springboot.gen_card_service.listener;

import com.cpe.springboot.gen_card_service.dto.CardGenerationRequestDto;
import com.cpe.springboot.gen_card_service.service.CardGenerationService;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.springframework.jms.annotation.JmsListener;
import org.springframework.stereotype.Component;

@Component
public class CardRequestListener {

    private final CardGenerationService service;
    private final ObjectMapper mapper = new ObjectMapper();

    public CardRequestListener(CardGenerationService service) {
        this.service = service;
    }

    @JmsListener(destination = "promptQueue")
    public void onMessage(String messageJson) throws Exception {
        CardGenerationRequestDto dto = mapper.readValue(messageJson, CardGenerationRequestDto.class);
        service.handleNewRequest(dto);
    }
}

package com.cpe.springboot.gen_card_service.service;

import com.cpe.springboot.gen_card_service.model.CardDTO;
import com.cpe.springboot.gen_card_service.model.CardRequestEntity;
import com.cpe.springboot.gen_card_service.model.RequestStatus;
import com.cpe.springboot.gen_card_service.repository.CardRequestRepository;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;
import tp.cpe.ImgToProperties;

import java.util.Map;

@Service
public class CardBuilderService {

    private final RestTemplate rest = new RestTemplate();
    private final CardRequestRepository repository;

    @Value("${store.service.url}")
    private String storeServiceUrl;

    public CardBuilderService(CardRequestRepository repository) {
        this.repository = repository;
    }

    public void tryAssembleIfReady(CardRequestEntity entity) {
        if (entity.getGeneratedImageUrl() != null && entity.getGeneratedText() != null) {
            System.out.println("🧩 Fusion carte id=" + entity.getRequestId());

            Map<String, Float> props = ImgToProperties.getPropertiesFromImg(
                    entity.getGeneratedImageUrl(), 400f, 4, 0.3f, false);

            CardDTO card = new CardDTO();
            card.setName("Carte " + entity.getRequestId());
            card.setDescription(entity.getGeneratedText());
            card.setImgUrl(entity.getGeneratedImageUrl());
            card.setHp(props.getOrDefault("HP", 50f));
            card.setAttack(props.getOrDefault("ATTACK", 50f));
            card.setDefence(props.getOrDefault("DEFENSE", 50f));
            card.setEnergy(props.getOrDefault("ENERGY", 50f));
            card.setPrice(card.getHp() * 20 + card.getAttack() * 20 + card.getDefence() * 20 + card.getEnergy() * 20);

            if (entity.getUserId() != null) card.setUserId(entity.getUserId().intValue());

            String url = storeServiceUrl + "/card";
            rest.postForEntity(url, card, Void.class);
            entity.setStatus(RequestStatus.DONE);
            repository.save(entity);

            System.out.println("✅ Carte envoyée au Store pour user=" + entity.getUserId());
        }
    }
}

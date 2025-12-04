package com.cpe.springboot.gen_card_service.service;

import org.springframework.stereotype.Service;
import tp.cpe.ImgToProperties;
import java.util.HashMap;
import java.util.Map;

@Service
public class ImgPropertyService {

    /**
     * Appelle la librairie ImgToProperties et gère les exceptions.
     * @param imageUrl URL de l'image
     * @return Map<String, Float> avec hp, attack, defence, energy
     */
    public Map<String, Float> extractProperties(String imageUrl) {
        try {
            return ImgToProperties.getPropertiesFromImg(imageUrl, 400f, 4, 0.3f, false);
        } catch (Exception e) {
            System.err.println("Erreur lors de la génération des propriétés : " + e.getMessage());
            Map<String, Float> fallback = new HashMap<>();
            fallback.put("hp", randomValue());
            fallback.put("attack", randomValue());
            fallback.put("defence", randomValue());
            fallback.put("energy", randomValue());
            return fallback;
        }
    }

    private float randomValue() {
        return (float) (Math.random() * 100);
    }
}

package com.cpe.springboot.queue;

import com.cpe.springboot.model.ImagePrompt;
import com.cpe.springboot.service.ImageService;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.jms.annotation.JmsListener;
import org.springframework.stereotype.Component;
import org.springframework.web.client.RestTemplate;
import org.springframework.http.*;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

@Component
public class ImageQueueListener {
    
    @Autowired
    private ImageService imageService;
    
    private final ObjectMapper objectMapper = new ObjectMapper();
    private final RestTemplate restTemplate = new RestTemplate();

    @Value("${GEN_CARD_SERVICE_URL}")
    private String genCardServiceUrl;

    @JmsListener(destination = "image-queue")
    public void receiveMessage(String message) {
        try {
            ImagePrompt imagePrompt = objectMapper.readValue(message, ImagePrompt.class);
            System.out.println("Received image generation request with ID: " + imagePrompt.getId());
            
            // Générer l'image
            String result = imageService.generateImage(imagePrompt);
            System.out.println("Raw Fooocus response: " + result);
            
            // Parser le résultat JSON pour extraire l'URL
            List<Map<String, Object>> imageResults = objectMapper.readValue(result, List.class);
            String imageUrl = null;
            
            if (!imageResults.isEmpty()) {
                Map<String, Object> firstImage = imageResults.get(0);
                imageUrl = (String) firstImage.get("url");
            }
            
            if (imageUrl == null) {
                System.err.println("Could not extract image URL from response");
                return;
            }
            
            System.out.println("Extracted image URL: " + imageUrl);

            // Envoyer à localhost:8084
            Map<String, Object> payload = new HashMap<>();
            payload.put("id", imagePrompt.getId());
            payload.put("imageUrl", imageUrl);  // Seulement l'URL, pas le JSON complet
            
            String jsonPayload = objectMapper.writeValueAsString(payload);
            System.out.println("Sending to 8084: " + jsonPayload);
            
            HttpHeaders headers = new HttpHeaders();
            headers.setContentType(MediaType.APPLICATION_JSON);
            HttpEntity<Map<String, Object>> request = new HttpEntity<>(payload, headers);

            String url = genCardServiceUrl + "/gen-card/image-generated";
            ResponseEntity<String> response = restTemplate.postForEntity(
                    url,
                    request,
                    String.class
            );
            System.out.println("✓ Callback sent successfully for ID: " + imagePrompt.getId());
            
        } catch (Exception e) {
            System.err.println("Error: " + e.getMessage());
            e.printStackTrace();
        }
    }
}
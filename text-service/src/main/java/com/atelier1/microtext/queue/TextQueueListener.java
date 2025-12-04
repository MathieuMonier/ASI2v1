package com.atelier1.microtext.queue;

import com.atelier1.microtext.model.TextPrompt;
import org.springframework.jms.annotation.JmsListener;
import org.springframework.stereotype.Component;
import org.springframework.web.client.RestTemplate;
import org.springframework.http.HttpEntity;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.beans.factory.annotation.Value;
import java.util.HashMap;
import java.util.Map;

@Component
public class TextQueueListener {

    @Value("${OLLAMA_URL}")
    private String ollamaApiUrl;

    @Value("${GEN_CARD_SERVICE_URL}")
    private String genCardServiceUrl;

    private final RestTemplate restTemplate = new RestTemplate();


    @JmsListener(destination = "textPromptQueue")
    public void receivePrompt(TextPrompt prompt) {
        final String OLLAMA_URL = ollamaApiUrl + "/api/generate";
        final String TARGET_API = genCardServiceUrl + "/gen-card/text-generated";
        System.out.println("Received prompt ID: " + prompt.getId() +
                " Short description: " + prompt.getDescription());

        try {
            HttpHeaders headers = new HttpHeaders();
            headers.setContentType(MediaType.APPLICATION_JSON);

            Map<String, Object> ollamaRequest = new HashMap<>();
            ollamaRequest.put("model", "qwen2:0.5b");
            ollamaRequest.put("prompt", prompt.getDescription());
            ollamaRequest.put("stream", false);

            HttpEntity<Map<String, Object>> ollamaEntity = new HttpEntity<>(ollamaRequest, headers);

            Map<String, Object> ollamaResponse = restTemplate.postForObject(OLLAMA_URL, ollamaEntity, Map.class);
            String fullDescription = ollamaResponse.getOrDefault("response", "").toString();
            prompt.setFullDescription(fullDescription);

            Map<String, Object> targetRequest = new HashMap<>();
            targetRequest.put("id", prompt.getId());
            targetRequest.put("description", prompt.getFullDescription());
            HttpEntity<Map<String, Object>> targetEntity = new HttpEntity<>(targetRequest, headers);
            System.out.println("send prompt ID: " + prompt.getId() +
                    " final description: " + prompt.getFullDescription());
            restTemplate.postForObject(TARGET_API, targetEntity, String.class);

        } catch (Exception e) {
            e.printStackTrace();
        }
    }
}

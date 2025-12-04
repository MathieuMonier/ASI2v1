package com.cpe.springboot.service;

import com.cpe.springboot.model.ImagePrompt;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;
import org.springframework.http.*;

@Service
public class ImageService {

    @Value("${FOOOCUS_API_URL}")
    private String fooocusApiUrl;
    
    private final RestTemplate restTemplate;
    
    public ImageService() {
        this.restTemplate = new RestTemplate();
    }
    
    public String generateImage(ImagePrompt imagePrompt) {
        String url = fooocusApiUrl + "/v1/generation/text-to-image";
        
        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(MediaType.APPLICATION_JSON);
        headers.set("accept", "application/json");
        
        HttpEntity<ImagePrompt> request = new HttpEntity<>(imagePrompt, headers);
        
        try {
            ResponseEntity<String> response = restTemplate.exchange(
                url,
                HttpMethod.POST,
                request,
                String.class
            );
            return response.getBody();
        } catch (Exception e) {
            throw new RuntimeException("Error calling Fooocus API: " + e.getMessage(), e);
        }
    }
}
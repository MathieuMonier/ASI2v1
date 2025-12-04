package com.cpe.springboot.controller;

import com.cpe.springboot.model.ImagePrompt;
import com.cpe.springboot.service.ImageService;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.jms.core.JmsTemplate;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/api/image")
public class ImageController {
    
    @Autowired
    private ImageService imageService;
    
    @Autowired
    private JmsTemplate jmsTemplate;
    
    private final ObjectMapper objectMapper = new ObjectMapper();
    
    @PostMapping("/generate")
    public ResponseEntity<String> generateImage(@RequestBody Map<String, Object> request) {
        if (!request.containsKey("prompt") || request.get("prompt") == null) {
            return ResponseEntity.badRequest().body("Prompt is required");
        }
        
        try {
            ImagePrompt imagePrompt = new ImagePrompt();
            
            // Récupération de l'ID
            if (request.containsKey("id")) {
                Object idObj = request.get("id");
                if (idObj instanceof Number) {
                    imagePrompt.setId(((Number) idObj).longValue());
                } else if (idObj instanceof String) {
                    imagePrompt.setId(Long.parseLong((String) idObj));
                }
            }
            
            // Récupération du prompt
            imagePrompt.setPrompt((String) request.get("prompt"));
            
            // Envoi du message à la queue ActiveMQ
            String message = objectMapper.writeValueAsString(imagePrompt);
            jmsTemplate.convertAndSend("image-queue", message);
            
            return ResponseEntity.ok("Image generation request sent with ID: " + imagePrompt.getId());
        } catch (Exception e) {
            return ResponseEntity.internalServerError().body("Error: " + e.getMessage());
        }
    }
    
    @PostMapping("/generate-sync")
    public ResponseEntity<String> generateImageSync(@RequestBody Map<String, Object> request) {
        if (!request.containsKey("prompt") || request.get("prompt") == null) {
            return ResponseEntity.badRequest().body("Prompt is required");
        }
        
        try {
            ImagePrompt imagePrompt = new ImagePrompt();
            
            if (request.containsKey("id")) {
                Object idObj = request.get("id");
                if (idObj instanceof Number) {
                    imagePrompt.setId(((Number) idObj).longValue());
                } else if (idObj instanceof String) {
                    imagePrompt.setId(Long.parseLong((String) idObj));
                }
            }
            
            imagePrompt.setPrompt((String) request.get("prompt"));
            
            String result = imageService.generateImage(imagePrompt);
            return ResponseEntity.ok(result);
        } catch (Exception e) {
            return ResponseEntity.internalServerError().body("Error: " + e.getMessage());
        }
    }
}
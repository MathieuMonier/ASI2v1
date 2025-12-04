package com.cpe.springboot.gen_card_service.dto;

import com.fasterxml.jackson.annotation.JsonProperty;

import jakarta.persistence.Column;

public class CardGenerationRequestDto {
    private Long id;

    @JsonProperty("id_user")
    private Long userId;

    private String imagePrompt;
    @Column(length = 2000)
    private String description;

    // Getters / Setters
    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public Long getUserId() { return userId; }
    public void setUserId(Long userId) { this.userId = userId; }

    public String getImagePrompt() { return imagePrompt; }
    public void setImagePrompt(String imagePrompt) { this.imagePrompt = imagePrompt; }

    public String getDescription() { return description; }
    public void setDescription(String description) { this.description = description; }
}

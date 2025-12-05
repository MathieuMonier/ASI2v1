package com.cpe.springboot.prompt.model;

import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;

@Entity
public class PromptModel {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;

    private Integer id_user;
    private String imagePrompt;
    private String description;

    public Integer getId() { return id; }
    public void setId(Integer id) { this.id = id; }

    public Integer getId_user() { return id_user; }
    public void setId_user(Integer id_user) { this.id_user = id_user; }

    public String getImagePrompt() { return imagePrompt; }
    public void setImagePrompt(String imagePrompt) { this.imagePrompt = imagePrompt; }

    public String getDescription() { return description; }
    public void setDescription(String description) { this.description = description; }
}
package com.atelier1.microtext.model;

import java.io.Serializable;

public class TextPrompt implements Serializable {
    private Long id;
    private String description;
    private String fullDescription;

    public TextPrompt() {}

    public TextPrompt(Long id, String description) {
        this.id = id;
        this.description = description;
    }

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public String getDescription() { return description; }
    public void setDescription(String description) { this.description = description; }

    public String getFullDescription() { return fullDescription; }
    public void setFullDescription(String fullDescription) { this.fullDescription = fullDescription; }
}

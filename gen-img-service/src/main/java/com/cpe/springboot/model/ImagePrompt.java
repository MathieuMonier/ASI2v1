package com.cpe.springboot.model;

import com.fasterxml.jackson.annotation.JsonProperty;
import java.io.Serializable;

public class ImagePrompt implements Serializable {
    private Long id;
    private String prompt;
    
    @JsonProperty("negative_prompt")
    private String negativePrompt;
    
    @JsonProperty("performance_selection")
    private String performanceSelection;
    
    @JsonProperty("aspect_ratios_selection")
    private String aspectRatiosSelection;
    
    @JsonProperty("async_process")
    private boolean asyncProcess;
    
    @JsonProperty("image_number")
    private int imageNumber;

    public ImagePrompt() {
        this.negativePrompt = "";
        this.performanceSelection = "Lightning";
        this.aspectRatiosSelection = "1152*896";
        this.asyncProcess = false;
        this.imageNumber = 1;
    }

    // Getters and Setters
    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getPrompt() {
        return prompt;
    }

    public void setPrompt(String prompt) {
        this.prompt = prompt;
    }

    public String getNegativePrompt() {
        return negativePrompt;
    }

    public void setNegativePrompt(String negativePrompt) {
        this.negativePrompt = negativePrompt;
    }

    public String getPerformanceSelection() {
        return performanceSelection;
    }

    public void setPerformanceSelection(String performanceSelection) {
        this.performanceSelection = performanceSelection;
    }

    public String getAspectRatiosSelection() {
        return aspectRatiosSelection;
    }

    public void setAspectRatiosSelection(String aspectRatiosSelection) {
        this.aspectRatiosSelection = aspectRatiosSelection;
    }

    public boolean isAsyncProcess() {
        return asyncProcess;
    }

    public void setAsyncProcess(boolean asyncProcess) {
        this.asyncProcess = asyncProcess;
    }

    public int getImageNumber() {
        return imageNumber;
    }

    public void setImageNumber(int imageNumber) {
        this.imageNumber = imageNumber;
    }
}
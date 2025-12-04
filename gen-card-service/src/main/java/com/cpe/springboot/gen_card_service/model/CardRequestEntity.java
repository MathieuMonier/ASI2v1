package com.cpe.springboot.gen_card_service.model;

import jakarta.persistence.*;

@Entity
public class CardRequestEntity {

    @Id
    private String requestId;

    private Long userId;

    @Column(length = 2000)
    private String generatedText;
    private String generatedImageUrl;

    @Enumerated(EnumType.STRING)
    private RequestStatus status;

    // Getters / Setters
    public String getRequestId() { return requestId; }
    public void setRequestId(String requestId) { this.requestId = requestId; }

    public Long getUserId() { return userId; }
    public void setUserId(Long userId) { this.userId = userId; }

    public String getGeneratedText() { return generatedText; }
    public void setGeneratedText(String generatedText) { this.generatedText = generatedText; }

    public String getGeneratedImageUrl() { return generatedImageUrl; }
    public void setGeneratedImageUrl(String generatedImageUrl) { this.generatedImageUrl = generatedImageUrl; }

    public RequestStatus getStatus() { return status; }
    public void setStatus(RequestStatus status) { this.status = status; }
}

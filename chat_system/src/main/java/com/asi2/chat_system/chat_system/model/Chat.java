package com.asi2.chat_system.chat_system.model;

import jakarta.persistence.*;
import java.time.Instant;

@Entity
@Table(name = "messages")
public class Chat {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String roomId;
    private String author;

    @Column(length = 2000)
    private String content;

    private Instant sentAt;

    public Chat() {}

    public Chat(String roomId, String author, String content, Instant sentAt) {
        this.roomId = roomId;
        this.author = author;
        this.content = content;
        this.sentAt = sentAt;
    }

    public Long getId() { return id; }
    public String getRoomId() { return roomId; }
    public String getAuthor() { return author; }
    public String getContent() { return content; }
    public Instant getSentAt() { return sentAt; }

    public void setRoomId(String roomId) { this.roomId = roomId; }
    public void setAuthor(String author) { this.author = author; }
    public void setContent(String content) { this.content = content; }
    public void setSentAt(Instant sentAt) { this.sentAt = sentAt; }
}

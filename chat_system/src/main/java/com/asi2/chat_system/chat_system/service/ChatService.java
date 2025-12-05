package com.asi2.chat_system.chat_system.service;

import com.asi2.chat_system.chat_system.dto.MessageRequest;
import com.asi2.chat_system.chat_system.dto.MessageResponse;
import com.asi2.chat_system.chat_system.model.Chat;
import org.springframework.stereotype.Service;
import com.asi2.chat_system.chat_system.repository.*;


import java.time.Instant;
import java.util.List;

@Service
public class ChatService {

    private final ChatRepository repo;

    public ChatService(ChatRepository repo) {
        this.repo = repo;
    }

    public MessageResponse save(MessageRequest req) {
        Chat chat = new Chat(
                req.roomId(),
                req.author(),
                req.content(),
                req.sentAt() != null ? req.sentAt() : Instant.now()
        );

        Chat saved = repo.save(chat);

        return new MessageResponse(
                saved.getId(),
                saved.getRoomId(),
                saved.getAuthor(),
                saved.getContent(),
                saved.getSentAt()
        );
    }

    public List<MessageResponse> getHistory(String roomId, int limit) {
        return repo.findTop50ByRoomIdOrderBySentAtDesc(roomId)
                .stream()
                .map(m -> new MessageResponse(
                        m.getId(),
                        m.getRoomId(),
                        m.getAuthor(),
                        m.getContent(),
                        m.getSentAt()
                ))
                .toList();
    }
}

package com.asi2.chat_system.chat_system.repository;

import com.asi2.chat_system.chat_system.model.Chat;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface ChatRepository extends JpaRepository<Chat, Long> {

    List<Chat> findTop50ByRoomIdOrderBySentAtDesc(String roomId);
}

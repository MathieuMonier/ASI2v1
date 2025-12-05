package com.asi2.chat_system.chat_system.dto;

import java.time.Instant;

public record MessageRequest(
        String roomId,
        String author,
        String content,
        Instant sentAt
) {}

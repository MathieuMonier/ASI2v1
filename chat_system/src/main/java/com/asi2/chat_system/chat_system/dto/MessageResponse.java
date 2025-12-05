package com.asi2.chat_system.chat_system.dto;

import java.time.Instant;

public record MessageResponse(
        Long id,
        String roomId,
        String author,
        String content,
        Instant sentAt
) {}

package com.asi2.chat_system.chat_system.controller;

import com.asi2.chat_system.chat_system.dto.MessageRequest;
import com.asi2.chat_system.chat_system.dto.MessageResponse;
import com.asi2.chat_system.chat_system.service.ChatService;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/messages")
@CrossOrigin // autorise Node à appeler
public class MessageController {

    private final ChatService service;

    public MessageController(ChatService service) {
        this.service = service;
    }

    @PostMapping
    public MessageResponse create(@RequestBody MessageRequest request) {
        return service.save(request);
    }

    @GetMapping("/rooms/{roomId}")
    public List<MessageResponse> getRoomMessages(
            @PathVariable String roomId,
            @RequestParam(defaultValue = "50") int limit
    ) {
        return service.getHistory(roomId, limit);
    }
}

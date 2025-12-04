package com.asi2.notification_system.controller;

import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.messaging.handler.annotation.SendTo;
import org.springframework.messaging.handler.annotation.Payload;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.web.bind.annotation.*;

import org.springframework.stereotype.Controller;

import java.time.Instant;

@Controller
public class NotificationsController {

    private final SimpMessagingTemplate messagingTemplate;

    public NotificationsController(SimpMessagingTemplate messagingTemplate) {
        this.messagingTemplate = messagingTemplate;
    }

    // --- 1) Reçoit les messages STOMP venant du client JS ---
    // Le client envoie via stompClient.send("/app/sendMessage", {}, message)
    @MessageMapping("/sendMessage")
    @SendTo("/cartes/notifications")
    public NotificationMessage handleWebSocketMessage(@Payload String message) {
        System.out.println("[WebSocket] Message reçu : " + message);
        return new NotificationMessage("Message reçu du client : " + message, Instant.now().toString());
    }

    // --- 2) Envoie une notification depuis le backend ---
    // Permet d'envoyer une notification sans passer par le JS
    // Exemple d'appel : POST http://localhost:8090/notify?msg=Bonjour
    @PostMapping("/notify")
    @ResponseBody
    public String sendNotification(@RequestParam String msg) {
        NotificationMessage notif = new NotificationMessage(msg, Instant.now().toString());
        messagingTemplate.convertAndSend("/cartes/notifications", notif);
        System.out.println("[REST] Notification envoyée : " + msg);
        return "Notification envoyée : " + msg;
    }
}

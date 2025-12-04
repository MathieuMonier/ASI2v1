// src/socket.js
import { io } from "socket.io-client";

// Connexion via Nginx (reverse proxy)
export const socket = io("http://localhost/game", {
  path: "/game/socket.io",   // important: correspond au path configuré côté serveur
  autoConnect: true,
  transports: ["websocket", "polling"],
});

export const chatSocket = io("http://localhost/chat", {
  path: "/chat/socket.io",
  transports: ["websocket", "polling"],
  autoConnect: true,
});

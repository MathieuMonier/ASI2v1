const express = require("express");
const cors = require("cors");
const http = require("http");
const { Server } = require("socket.io");

const app = express();
app.use(cors());

const server = http.createServer(app);

const io = new Server(server, {
  cors: {
    origin: "http://localhost", // frontend passe par Nginx reverse proxy
    methods: ["GET", "POST"],
  },
  path: "/chat/socket.io" // important: Socket.IO sera servi sous /chat/socket.io
});

// users[socketId] = { username }
const users = {};

function broadcastUsers() {
  const list = Object.entries(users).map(([socketId, { username }]) => ({
    socketId,
    username,
  }));
  io.emit("online_users", list);
}

io.on("connection", (socket) => {
  console.log("User connected:", socket.id);

  // 1) Enregistrement de l'utilisateur avec son username
  socket.on("register_user", (username) => {
    users[socket.id] = { username };
    console.log(`User registered: ${username} (${socket.id})`);
    broadcastUsers();
  });

  // 2) L'utilisateur rejoint une room "classique"
  socket.on("join_room", (room) => {
    socket.join(room);
    console.log(`User ${socket.id} joined room ${room}`);
  });

  // 3) Chat : envoi de message
  socket.on("send_message", (data) => {
    console.log("Message received:", data);
    socket.to(data.room).emit("receive_message", data);
  });

  // 4) Invitation à un chat privé
  socket.on("start_private_chat", ({ targetSocketId }) => {
    const me = users[socket.id];
    const other = users[targetSocketId];
    if (!me || !other) return;

    const room = [me.username, other.username].sort().join("_");

    console.log(
        `Private chat requested: ${me.username} (${socket.id}) <-> ${other.username} (${targetSocketId}) in room ${room}`
    );

    socket.join(room);

    io.to(socket.id).emit("private_chat_started", {
      room,
      with: other.username,
    });

    io.to(targetSocketId).emit("private_chat_invitation", {
      room,
      from: me.username,
    });
  });

  socket.on("disconnect", () => {
    console.log("User disconnected:", socket.id);
    delete users[socket.id];
    broadcastUsers();
  });
});

server.listen(3002, () => {
  console.log("CHAT-SERVICE RUNNING on port 3002");
});

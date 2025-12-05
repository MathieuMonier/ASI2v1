const express = require('express');
const http = require('http');
const socketIO = require('socket.io');
const cors = require('cors');

// Import des services
const matchmaking = require('./services/matchmaking');
const game = require('./services/game');

const app = express();
app.use(cors()); // Middleware CORS Express

const server = http.createServer(app);

// --- CONFIGURATION SOCKET.IO CORRIGÉE ---
const io = socketIO(server, {
  cors: {
    origin: "*", // On autorise tout (Nginx, localhost, etc.)
    methods: ["GET", "POST"]
  },

  path: "/game/socket.io"
});

const PORT = 3001;

// Gestion des connexions Socket.io
io.on('connection', (socket) => {
  console.log(`✅ New player connected: ${socket.id}`);

  // 1. JOIN MATCHMAKING
  socket.on('joinMatchmaking', (data) => {
    const { userId, username, cards } = data;
    console.log(`🎮 ${username} joined matchmaking with ${cards.length} cards`);

    const match = matchmaking.addToQueue(socket.id, userId, username, cards);

    if (match) {
      // Match found! Create game
      const gameId = game.createGame(match.player1, match.player2, io);

      // Notify both players
      io.to(match.player1.socketId).emit('matchFound', {
        gameId,
        opponent: match.player2.username
      });
      io.to(match.player2.socketId).emit('matchFound', {
        gameId,
        opponent: match.player1.username
      });

      console.log(`Game created: ${gameId}`);

      // Send initial game state after a short delay
      setTimeout(() => {
        const gameState = game.getGameState(gameId);
        if (gameState) {
          io.to(match.player1.socketId).emit('gameStart', gameState);
          io.to(match.player2.socketId).emit('gameStart', gameState);
        }
      }, 1000);
    } else {
      socket.emit('waiting', { message: 'Waiting for opponent...' });
    }
  });

  // 2. ATTACK
  socket.on('attack', (data) => {
    const { gameId, attackerCardId, defenderCardId } = data;
    console.log(`⚔️ Attack in game ${gameId}: card ${attackerCardId} → ${defenderCardId}`);

    const result = game.attack(gameId, socket.id, attackerCardId, defenderCardId);

    if (result.success) {
      // Broadcast attack result to both players
      io.to(result.gameState.player1.socketId).emit('attackResult', result);
      io.to(result.gameState.player2.socketId).emit('attackResult', result);

      // Check if game ended
      if (result.gameState.status === 'finished') {
        io.to(result.gameState.player1.socketId).emit('gameEnd', {
          winner: result.gameState.winner,
          isWinner: result.gameState.winner === result.gameState.player1.userId
        });
        io.to(result.gameState.player2.socketId).emit('gameEnd', {
          winner: result.gameState.winner,
          isWinner: result.gameState.winner === result.gameState.player2.userId
        });
      }
    } else {
      socket.emit('error', { message: result.message });
    }
  });

  // 3. END TURN
  socket.on('endTurn', (data) => {
    const { gameId } = data;
    console.log(`End turn in game ${gameId}`);

    const result = game.endTurn(gameId, socket.id);

    if (result.success) {
      // Broadcast new game state
      io.to(result.gameState.player1.socketId).emit('turnChanged', result.gameState);
      io.to(result.gameState.player2.socketId).emit('turnChanged', result.gameState);
    } else {
      socket.emit('error', { message: result.message });
    }
  });

  // 4. DISCONNECT
  socket.on('disconnect', () => {
    console.log(`Player disconnected: ${socket.id}`);
    matchmaking.removeFromQueue(socket.id);
  });
});

server.listen(PORT, () => {
  console.log(`✅ Game Service running on port ${PORT}`);
});
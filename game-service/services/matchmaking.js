// Simple matchmaking queue
let waitingQueue = [];

/**
 * Add player to matchmaking queue
 * Returns match if found, null otherwise
 */
function addToQueue(socketId, userId, username, cards) {
  const player = {
    socketId,
    userId,
    username,
    cards,
    timestamp: Date.now()
  };

  if (waitingQueue.length > 0) {
    // Match found!
    const opponent = waitingQueue.shift();
    return {
      player1: opponent,
      player2: player
    };
  } else {
    // Add to queue
    waitingQueue.push(player);
    return null;
  }
}

/**
 * Remove player from queue (if they cancel)
 */
function removeFromQueue(socketId) {
  waitingQueue = waitingQueue.filter(p => p.socketId !== socketId);
}

/**
 * Get current queue size
 */
function getQueueSize() {
  return waitingQueue.length;
}

module.exports = {
  addToQueue,
  removeFromQueue,
  getQueueSize
};
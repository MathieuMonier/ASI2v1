const activeGames = new Map();

function createGame(player1, player2, io) {
  const gameId = `game_${Date.now()}`;
  const startsFirst = Math.random() > 0.5 ? player1.userId : player2.userId;
  
  const gameState = {
    gameId,
    player1: {
      socketId: player1.socketId,
      userId: player1.userId,
      username: player1.username,
      cards: player1.cards.map((card, index) => ({
        ...card,
        id: `p1_card_${index}`,
        // DIVISER HP PAR 3 pour combat très rapide
        hp: Math.max(10, (card.hp || 20) / 3),
        maxHp: Math.max(10, (card.hp || 20) / 3),
        // MULTIPLIER L'ATTAQUE PAR 2
        attack: (card.attack || 10) * 2,
        defence: card.defence || 5
      })),
      actionPoints: 10
    },
    player2: {
      socketId: player2.socketId,
      userId: player2.userId,
      username: player2.username,
      cards: player2.cards.map((card, index) => ({
        ...card,
        id: `p2_card_${index}`,
        hp: Math.max(10, (card.hp || 20) / 3),
        maxHp: Math.max(10, (card.hp || 20) / 3),
        attack: (card.attack || 10) * 2,
        defence: card.defence || 5
      })),
      actionPoints: 10
    },
    currentTurn: startsFirst,
    status: 'playing',
    log: [`Game started! ${startsFirst === player1.userId ? player1.username : player2.username} begins!`]
  };
  
  activeGames.set(gameId, gameState);
  return gameId;
}

function attack(gameId, socketId, attackerCardId, defenderCardId) {
  const gameState = activeGames.get(gameId);
  
  if (!gameState) {
    return { success: false, message: 'Game not found' };
  }
  
  const isPlayer1 = gameState.player1.socketId === socketId;
  const attacker = isPlayer1 ? gameState.player1 : gameState.player2;
  const defender = isPlayer1 ? gameState.player2 : gameState.player1;
  
  if (gameState.currentTurn !== attacker.userId) {
    return { success: false, message: 'Not your turn!' };
  }
  
  const attackCost = 3;
  if (attacker.actionPoints < attackCost) {
    return { success: false, message: 'Not enough action points!' };
  }
  
  const attackerCard = attacker.cards.find(c => c.id === attackerCardId);
  const defenderCard = defender.cards.find(c => c.id === defenderCardId);
  
  if (!attackerCard || !defenderCard) {
    return { success: false, message: 'Card not found!' };
  }
  
  if (attackerCard.hp <= 0) {
    return { success: false, message: 'This card is dead!' };
  }
  
  // NOUVEAU CALCUL: Dégâts MASSIFS
  // Base: attaque de l'attaquant (déjà x2)
  let damage = attackerCard.attack || 20;
  
  // Soustraire seulement 30% de la défense
  damage -= (defenderCard.defence || 5) * 0.3;
  
  // Minimum 15 dégâts
  damage = Math.max(15, damage);
  
  // Aléatoire ±40% pour variation
  damage = Math.floor(damage * (0.6 + Math.random() * 0.8));
  
  // Coup critique 20% de chance, x2.5 damage
  let isCritical = false;
  if (Math.random() < 0.2) {
    damage = Math.floor(damage * 2.5);
    isCritical = true;
  }
  
  // Appliquer les dégâts
  defenderCard.hp -= damage;
  attacker.actionPoints -= attackCost;
  
  const logMessage = isCritical 
    ? `CRITICAL HIT! ${attackerCard.name} deals ${damage} damage to ${defenderCard.name}!`
    : `${attackerCard.name} attacks ${defenderCard.name} for ${damage} damage`;
  
  gameState.log.push(logMessage);
  
  // Retirer cartes mortes
  defender.cards = defender.cards.filter(c => c.hp > 0);
  
  // Vérifier victoire
  if (defender.cards.length === 0) {
    gameState.status = 'finished';
    gameState.winner = attacker.userId;
    gameState.loser = defender.userId;
    gameState.reward = 50 + (attacker.cards.length * 10);
    gameState.log.push(`${attacker.username} WINS! Reward: ${gameState.reward} coins`);
  }
  
  return {
    success: true,
    damage,
    isCritical,
    attackerCardId,
    defenderCardId,
    defenderCardHp: defenderCard.hp > 0 ? defenderCard.hp : 0,
    gameState
  };
}

function endTurn(gameId, socketId) {
  const gameState = activeGames.get(gameId);
  
  if (!gameState) {
    return { success: false, message: 'Game not found' };
  }
  
  const isPlayer1 = gameState.player1.socketId === socketId;
  const currentPlayer = isPlayer1 ? gameState.player1 : gameState.player2;
  const nextPlayer = isPlayer1 ? gameState.player2 : gameState.player1;
  
  if (gameState.currentTurn !== currentPlayer.userId) {
    return { success: false, message: 'Not your turn!' };
  }
  
  gameState.currentTurn = nextPlayer.userId;
  
  // +7 PA par tour pour accélérer
  nextPlayer.actionPoints += 7;
  
  gameState.log.push(`${nextPlayer.username}'s turn (${nextPlayer.actionPoints} AP)`);
  
  return {
    success: true,
    gameState
  };
}

function getGameState(gameId) {
  return activeGames.get(gameId);
}

module.exports = {
  createGame,
  attack,
  endTurn,
  getGameState
};
import React, { useState, useEffect } from 'react';
import gameSocket from '../services/gameSocket';
import Matchmaking from '../components/Game/Matchmaking';
import GameBoard from '../components/Game/GameBoard';

const GamePage = () => {
  const [gamePhase, setGamePhase] = useState('matchmaking');
  const [gameState, setGameState] = useState(null);
  const [gameId, setGameId] = useState(null);
  const [userId, setUserId] = useState(null);
  const [username, setUsername] = useState(null);
  const [userCards, setUserCards] = useState([]);

  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      const user = JSON.parse(storedUser);
      setUserId(user.id);
      setUsername(user.username || user.login);
      fetchUserCards(user.id);
    }

    gameSocket.connect();
    setupSocketListeners();

    return () => {
      gameSocket.removeAllListeners();
      gameSocket.disconnect();
    };
  }, []);

  const fetchUserCards = async (userId) => {
    try {
      const response = await fetch(`http://store-service:8083/user/${userId}`);
      const userData = await response.json();

      if (!userData.cardList || userData.cardList.length === 0) {
        setUserCards([]);
        return;
      }

      const cardPromises = userData.cardList.map(cardId =>
        fetch(`http://store-service:8083/card/${cardId}`).then(res => res.json())
      );

      const cards = await Promise.all(cardPromises);
      const formattedCards = cards.map((card) => ({
        id: card.id,
        name: card.name,
        hp: card.hp || 20,
        maxHp: card.hp || 20,
        attack: card.attack || 10,
        defence: card.defence || 5,
        energy: card.energy || 20,
        imgUrl: card.imgUrl || card.smallImgUrl || 'https://via.placeholder.com/150',
      }));

      setUserCards(formattedCards);
    } catch (error) {
      console.error('Error fetching cards:', error);
      setUserCards([]);
    }
  };

  const setupSocketListeners = () => {
    gameSocket.onMatchFound((data) => {
      setGameId(data.gameId);
    });

    gameSocket.onGameStart((data) => {
      setGameState(data);
      setGamePhase('playing');
    });

    gameSocket.onAttackResult((data) => {
      if (data.success) setGameState(data.gameState);
    });

    gameSocket.onTurnChanged((data) => {
      setGameState(data);
    });

    gameSocket.onGameEnd((data) => {
      console.log('Game ended:', data);
      
      if (data.isWinner && data.reward) {
        alert(`YOU WIN! +${data.reward} coins`);

        // updateUserMoney(userId, data.reward);
      } else {
        alert('YOU LOSE!');
      }
    });
  };

  const handleMatchFound = (selectedCards) => {
    gameSocket.joinMatchmaking(userId, username, selectedCards);
  };

  const handleAttack = (attackerCardId, defenderCardId) => {
    gameSocket.attack(gameId, attackerCardId, defenderCardId);
  };

  const handleEndTurn = () => {
    gameSocket.endTurn(gameId);
  };

  const handleQuit = () => {
    setGamePhase('matchmaking');
    setGameState(null);
  };

  return (
    <div>
      {gamePhase === 'matchmaking' && (
        <Matchmaking userCards={userCards} onMatchFound={handleMatchFound} />
      )}

      {gamePhase === 'playing' && gameState && (
        <GameBoard
          gameState={gameState}
          userId={userId}
          onAttack={handleAttack}
          onEndTurn={handleEndTurn}
          onQuit={handleQuit}
        />
      )}
    </div>
  );
};

export default GamePage;
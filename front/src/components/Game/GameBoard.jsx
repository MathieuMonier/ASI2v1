import React, { useState, useEffect } from 'react';

const GameBoard = ({ gameState, userId, onAttack, onEndTurn, onQuit }) => {
  const [selectedCard, setSelectedCard] = useState(null);

  useEffect(() => {
    if (gameState && gameState.status === 'finished') {
      const isWinner = gameState.winner === userId;
      setTimeout(() => {
        alert(isWinner ? `YOU WIN! +${gameState.reward || 50} coins` : 'YOU LOSE!');
        onQuit();
      }, 1000);
    }
  }, [gameState, userId, onQuit]);

  if (!gameState) return <div>Loading...</div>;

  const isPlayer1 = gameState.player1.userId === userId;
  const myPlayer = isPlayer1 ? gameState.player1 : gameState.player2;
  const opponentPlayer = isPlayer1 ? gameState.player2 : gameState.player1;
  const isMyTurn = gameState.currentTurn === userId;
  const isGameFinished = gameState.status === 'finished';

  const handleMyCardClick = (card) => {
    if (!isMyTurn || card.hp <= 0 || isGameFinished) return;
    setSelectedCard(card);
  };

  const handleOpponentCardClick = (card) => {
    if (!isMyTurn || !selectedCard || card.hp <= 0 || isGameFinished) return;
    if (myPlayer.actionPoints < 3) {
      alert('Not enough action points! (Need 3 AP)');
      return;
    }
    onAttack(selectedCard.id, card.id);
    setSelectedCard(null);
  };

  const handleEndTurnClick = () => {
    if (!isMyTurn || isGameFinished) return;
    onEndTurn();
    setSelectedCard(null);
  };

  return (
    <div style={styles.container}>
      <div style={styles.mainArea}>
        {/* LEFT + CENTER: Game Board */}
        <div style={styles.boardArea}>
          {/* TOP: Opponent Info + Turn Indicator */}
          <div style={styles.topBar}>
            <div style={styles.playerSection}>
              <div style={styles.avatar}></div>
              <div style={styles.playerInfo}>
                <div style={styles.playerName}>{opponentPlayer.username}</div>
                <div style={styles.label}>action Points</div>
                <div style={styles.pointsBox}>{opponentPlayer.actionPoints}</div>
              </div>
            </div>

            <div style={{...styles.turnBox, background: isGameFinished ? '#000' : 'white', color: isGameFinished ? '#fff' : '#000'}}>
              {isGameFinished 
                ? (gameState.winner === userId ? 'YOU WIN!' : 'YOU LOSE!')
                : (isMyTurn ? 'Your Turn' : "Opponent's Turn")
              }
            </div>
          </div>

          {/* OPPONENT CARDS */}
          <div style={styles.cardZone}>
            {opponentPlayer.cards.map((card) => (
              <div key={card.id}>
                <div 
                  style={{
                    ...styles.card, 
                    cursor: (isMyTurn && selectedCard && !isGameFinished) ? 'pointer' : 'default',
                    opacity: card.hp <= 0 ? 0.3 : 1
                  }}
                  onClick={() => handleOpponentCardClick(card)}
                >
                  <img src={card.imgUrl} alt={card.name} style={styles.cardImage} />
                  <div style={styles.cardName}>{card.name}</div>
                  <div style={styles.hpBar}>
                    <div style={{...styles.hpFill, width: `${(card.hp / card.maxHp) * 100}%`}}></div>
                    <span style={styles.hpText}>{Math.max(0, Math.round(card.hp))} hp</span>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* SEPARATOR */}
          <div style={styles.separator}></div>

          {/* MY CARDS */}
          <div style={styles.cardZone}>
            {myPlayer.cards.map((card) => (
              <div key={card.id}>
                <div 
                  style={{
                    ...styles.card, 
                    border: selectedCard?.id === card.id ? '4px solid black' : '2px solid black',
                    cursor: (isMyTurn && !isGameFinished) ? 'pointer' : 'default',
                    opacity: card.hp <= 0 ? 0.3 : 1
                  }}
                  onClick={() => handleMyCardClick(card)}
                >
                  <img src={card.imgUrl} alt={card.name} style={styles.cardImage} />
                  <div style={styles.cardName}>{card.name}</div>
                  <div style={styles.hpBar}>
                    <div style={{...styles.hpFill, width: `${(card.hp / card.maxHp) * 100}%`}}></div>
                    <span style={styles.hpText}>{Math.max(0, Math.round(card.hp))} hp</span>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* BOTTOM: My Info + End Turn Button */}
          <div style={styles.bottomBar}>
            <div style={styles.playerSection}>
              <div style={styles.playerInfo}>
                <div style={styles.label}>action Points</div>
                <div style={styles.pointsBox}>{myPlayer.actionPoints}</div>
                <div style={styles.playerName}>{myPlayer.username}</div>
              </div>
              <div style={styles.avatar}></div>
            </div>

            <button 
              style={{
                ...styles.endTurnBtn, 
                opacity: (isMyTurn && !isGameFinished) ? 1 : 0.5,
                cursor: (isMyTurn && !isGameFinished) ? 'pointer' : 'not-allowed'
              }}
              onClick={handleEndTurnClick}
              disabled={!isMyTurn || isGameFinished}
            >
              End Turn
            </button>
          </div>
        </div>

        {/* RIGHT: Card Details Panel */}
        <div style={styles.rightPanel}>
          {selectedCard ? (
            <>
              {/* Card Details */}
              <div style={styles.detailCard}>
                <div style={styles.detailHeader}>
                  <span style={styles.detailHp}>{Math.round(selectedCard.hp)}</span>
                  <span style={styles.detailFamily}>
                    {selectedCard.family || selectedCard.affinity || 'Card'}
                  </span>
                  <span style={styles.detailEnergy}>{Math.round(selectedCard.energy || 0)}</span>
                </div>
                
                <div style={styles.detailImageContainer}>
                  <img src={selectedCard.imgUrl} alt={selectedCard.name} style={styles.detailImage} />
                  <div style={styles.detailName}>{selectedCard.name}</div>
                </div>

                <div style={styles.detailHpBars}>
                  <div style={styles.detailHpBar}>
                    <div style={{...styles.hpFill, width: `${(selectedCard.hp / selectedCard.maxHp) * 100}%`}}></div>
                  </div>
                  <div style={styles.detailHpBar}>
                    <div style={{...styles.hpFill, width: `${(selectedCard.hp / selectedCard.maxHp) * 100}%`}}></div>
                  </div>
                </div>

                <div style={styles.detailStats}>
                  <div style={styles.detailStat}>
                    <span style={styles.statLabel}>{Math.round(selectedCard.attack || 0)} attack</span>
                  </div>
                  <div style={styles.detailStat}>
                    <span style={styles.statLabel}>{Math.round(selectedCard.hp)} hp</span>
                  </div>
                  <div style={styles.detailStat}>
                    <span style={styles.statLabel}>{Math.round(selectedCard.defence || 0)} defense</span>
                  </div>
                  <div style={styles.detailStat}>
                    <span style={styles.statLabel}>{Math.round(selectedCard.energy || 0)} energy</span>
                  </div>
                </div>
              </div>

              {/* Attack Button */}
              <button style={styles.attackBtn}>
                Attack
              </button>
            </>
          ) : (
            <div style={styles.emptyDetail}>
              Select a card to see details
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

const styles = {
  container: {
    width: '100%',
    minHeight: '100vh',
    background: 'white',
    fontFamily: 'Arial, sans-serif',
  },
  mainArea: {
    display: 'flex',
    minHeight: '100vh',
  },
  boardArea: {
    flex: 1,
    display: 'flex',
    flexDirection: 'column',
  },
  rightPanel: {
    width: '280px',
    borderLeft: '2px solid black',
    padding: '20px',
    display: 'flex',
    flexDirection: 'column',
    gap: '15px',
  },
  topBar: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: '20px 40px',
    borderBottom: '2px solid black',
  },
  bottomBar: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: '20px 40px',
    borderTop: '2px solid black',
  },
  playerSection: {
    display: 'flex',
    alignItems: 'center',
    gap: '15px',
  },
  avatar: {
    width: '60px',
    height: '60px',
    borderRadius: '50%',
    border: '3px solid black',
    background: 'white',
  },
  playerInfo: {
    display: 'flex',
    flexDirection: 'column',
    gap: '5px',
  },
  playerName: {
    fontSize: '14px',
    fontWeight: 'bold',
  },
  label: {
    fontSize: '11px',
  },
  pointsBox: {
    border: '2px solid black',
    padding: '5px 10px',
    fontSize: '13px',
    fontWeight: 'bold',
    display: 'inline-block',
  },
  turnBox: {
    border: '2px solid black',
    padding: '10px 30px',
    fontSize: '15px',
    fontWeight: 'bold',
  },
  cardZone: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    gap: '20px',
    padding: '40px 20px',
    flex: 1,
  },
  card: {
    width: '150px',
    border: '2px solid black',
    background: 'white',
    padding: '8px',
  },
  cardImage: {
    width: '100%',
    height: '150px',
    objectFit: 'cover',
    border: '1px solid black',
    marginBottom: '6px',
  },
  cardName: {
    fontSize: '12px',
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: '6px',
  },
  hpBar: {
    height: '16px',
    border: '1px solid black',
    background: '#ddd',
    position: 'relative',
  },
  hpFill: {
    height: '100%',
    background: 'black',
  },
  hpText: {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    fontSize: '10px',
    fontWeight: 'bold',
    color: 'white',
    mixBlendMode: 'difference',
  },
  separator: {
    height: '2px',
    background: 'black',
  },
  endTurnBtn: {
    border: '2px solid black',
    background: 'white',
    padding: '12px 30px',
    fontSize: '14px',
    fontWeight: 'bold',
  },
  // RIGHT PANEL STYLES
  detailCard: {
    border: '2px solid black',
    padding: '12px',
    background: 'white',
  },
  detailHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '10px',
    fontSize: '13px',
    fontWeight: 'bold',
  },
  detailHp: {
    fontSize: '16px',
  },
  detailFamily: {
    fontSize: '11px',
  },
  detailEnergy: {
    fontSize: '16px',
  },
  detailImageContainer: {
    position: 'relative',
    marginBottom: '10px',
  },
  detailImage: {
    width: '100%',
    height: '200px',
    objectFit: 'cover',
    border: '1px solid black',
  },
  detailName: {
    position: 'absolute',
    bottom: '0',
    left: '0',
    right: '0',
    background: 'rgba(200, 200, 200, 0.9)',
    padding: '6px',
    fontSize: '13px',
    fontWeight: 'bold',
    textAlign: 'center',
    borderTop: '1px solid black',
  },
  detailHpBars: {
    display: 'flex',
    flexDirection: 'column',
    gap: '4px',
    marginBottom: '10px',
  },
  detailHpBar: {
    height: '8px',
    border: '1px solid black',
    background: '#ddd',
  },
  detailStats: {
    display: 'flex',
    flexDirection: 'column',
    gap: '6px',
  },
  detailStat: {
    fontSize: '12px',
    padding: '4px 0',
  },
  statLabel: {
    fontWeight: 'bold',
  },
  attackBtn: {
    width: '100%',
    border: '2px solid black',
    background: 'white',
    padding: '12px',
    fontSize: '14px',
    fontWeight: 'bold',
    cursor: 'pointer',
  },
  emptyDetail: {
    textAlign: 'center',
    color: '#999',
    fontSize: '13px',
    padding: '40px 20px',
  },
};

export default GameBoard;
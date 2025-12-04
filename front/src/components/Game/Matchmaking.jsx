import React, { useState } from 'react';
import Card from './Card';

const Matchmaking = ({ userCards, onMatchFound }) => {
  const [selectedCards, setSelectedCards] = useState([]);
  const [isSearching, setIsSearching] = useState(false);
  const MAX_CARDS = 4;

  const handleCardSelect = (card) => {
    if (isSearching) return;

    if (selectedCards.find(c => c.id === card.id)) {
      setSelectedCards(selectedCards.filter(c => c.id !== card.id));
    } else if (selectedCards.length < MAX_CARDS) {
      setSelectedCards([...selectedCards, card]);
    }
  };

  const handleStart = () => {
    if (selectedCards.length !== MAX_CARDS) {
      alert(`Select exactly ${MAX_CARDS} cards!`);
      return;
    }
    setIsSearching(true);
    onMatchFound(selectedCards);
  };

  return (
    <div style={styles.container}>
      <h1 style={styles.title}>Select {MAX_CARDS} cards to play</h1>

      {isSearching ? (
        <div style={styles.searching}>
          <div style={styles.spinner}></div>
          <p>Searching for opponent...</p>
        </div>
      ) : (
        <>
          <div style={styles.info}>
            {selectedCards.length} / {MAX_CARDS} selected
          </div>

          <div style={styles.grid}>
            {userCards.length > 0 ? (
              userCards.map((card) => (
                <Card
                  key={card.id}
                  card={card}
                  onClick={handleCardSelect}
                  isSelected={!!selectedCards.find(c => c.id === card.id)}
                  isDisabled={false}
                />
              ))
            ) : (
              <p>No cards available. Go to the store to buy cards.</p>
            )}
          </div>

          <button
            style={{...styles.button, opacity: selectedCards.length === MAX_CARDS ? 1 : 0.5}}
            onClick={handleStart}
            disabled={selectedCards.length !== MAX_CARDS}
          >
            Find Opponent
          </button>
        </>
      )}
      
      <style>{`
        @keyframes spin {
          to { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  );
};

const styles = {
  container: {
    padding: '40px',
    textAlign: 'center',
    fontFamily: 'Arial, sans-serif',
  },
  title: {
    fontSize: '24px',
    fontWeight: 'bold',
    marginBottom: '30px',
  },
  info: {
    border: '2px solid black',
    padding: '10px 20px',
    display: 'inline-block',
    fontSize: '14px',
    fontWeight: 'bold',
    marginBottom: '30px',
  },
  grid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fill, minmax(140px, 1fr))',
    gap: '20px',
    maxWidth: '900px',
    margin: '0 auto 40px',
  },
  button: {
    border: '2px solid black',
    background: 'white',
    padding: '12px 40px',
    fontSize: '14px',
    fontWeight: 'bold',
    cursor: 'pointer',
  },
  searching: {
    marginTop: '100px',
  },
  spinner: {
    width: '50px',
    height: '50px',
    border: '5px solid #ddd',
    borderTop: '5px solid black',
    borderRadius: '50%',
    margin: '0 auto 20px',
    animation: 'spin 1s linear infinite',
  },
};

export default Matchmaking;
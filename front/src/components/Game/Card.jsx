import React from 'react';

const Card = ({ card, onClick, isSelected, isDisabled }) => {
  if (!card) return null;

  const handleClick = () => {
    if (!isDisabled && onClick) onClick(card);
  };

  return (
    <div 
      style={{
        ...styles.card,
        border: isSelected ? '4px solid black' : '2px solid black',
        opacity: isDisabled ? 0.5 : 1,
        cursor: isDisabled ? 'not-allowed' : 'pointer',
      }}
      onClick={handleClick}
    >
      <img src={card.imgUrl} alt={card.name} style={styles.image} />
      <div style={styles.name}>{card.name}</div>
      <div style={styles.hpBar}>
        <div style={{...styles.hpFill, width: `${(card.hp / card.maxHp) * 100}%`}}></div>
      </div>
    </div>
  );
};

const styles = {
  card: {
    width: '140px',
    background: 'white',
    padding: '8px',
  },
  image: {
    width: '100%',
    height: '130px',
    objectFit: 'cover',
    border: '1px solid black',
    marginBottom: '6px',
  },
  name: {
    fontSize: '11px',
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: '6px',
  },
  hpBar: {
    height: '14px',
    border: '1px solid black',
    background: '#ddd',
  },
  hpFill: {
    height: '100%',
    background: 'black',
  },
};

export default Card;
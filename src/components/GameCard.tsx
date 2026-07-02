import React from 'react';
import './GameCard.css';

interface GameCardProps {
  game: {
    id: string;
    title: string;
    icon: string;
    api: string;
  };
  rank: number;
  onClick: () => void;
}

const GameCard: React.FC<GameCardProps> = ({ game, rank, onClick }) => {
  const getRankColor = (rank: number) => {
    if (rank === 1) return 'gold';
    if (rank === 2) return 'silver';
    if (rank === 3) return 'bronze';
    return '';
  };

  return (
    <div className="game-card" onClick={onClick}>
      <div className="game-rank">
        <span className={`rank-number ${getRankColor(rank)}`}>#{rank}</span>
      </div>
      <div className="game-icon">{game.icon}</div>
      <h3 className="game-title">{game.title}</h3>
      <div className="game-badge">▶ PLAY</div>
    </div>
  );
};

export default GameCard;

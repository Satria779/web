import React from 'react';
import { useGame } from '../context/GameContext';
import './Header.css';

const Header: React.FC = () => {
  const { state } = useGame();

  return (
    <header className="header">
      <div className="header-left">
        <h1 className="header-title">🎮 WEB</h1>
        <span className="header-subtitle">Game Asah Otak</span>
      </div>
      <div className="header-right">
        <div className="header-user">
          <span className="user-avatar">👤</span>
          <div className="user-info">
            <span className="user-name">{state.username}</span>
            <span className="user-level-badge">Level {state.level}</span>
          </div>
        </div>
        <div className="header-points">
          <span className="points-icon">⭐</span>
          <span className="points-value">{state.points}</span>
        </div>
      </div>
    </header>
  );
};

export default Header;

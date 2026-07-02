import React, { useState } from 'react';
import { useGame } from '../context/GameContext';
import './Profile.css';

const Profile: React.FC = () => {
  const { state, dispatch } = useGame();
  const [isEditing, setIsEditing] = useState(false);
  const [newName, setNewName] = useState(state.username);

  const handleNameChange = () => {
    if (newName.trim()) {
      dispatch({ type: 'SET_USERNAME', payload: newName.trim() });
      setIsEditing(false);
    }
  };

  const getLevelProgress = () => {
    const totalXP = state.points;
    const level = state.level;
    const xpForNextLevel = level * 100;
    const currentXP = totalXP - ((level - 1) * 100);
    return Math.min(100, (currentXP / xpForNextLevel) * 100);
  };

  return (
    <div className="profile">
      <div className="profile-card">
        <div className="avatar">👤</div>
        <div className="profile-info">
          {isEditing ? (
            <div className="name-edit">
              <input
                type="text"
                value={newName}
                onChange={(e) => setNewName(e.target.value)}
                maxLength={20}
              />
              <button onClick={handleNameChange}>Simpan</button>
              <button onClick={() => {
                setNewName(state.username);
                setIsEditing(false);
              }}>Batal</button>
            </div>
          ) : (
            <div className="display-name">
              <h2>{state.username}</h2>
              <button onClick={() => setIsEditing(true)}>✏️</button>
            </div>
          )}
          <div className="level-info">
            <div className="level-badge">Level {state.level}</div>
            <div className="xp-bar">
              <div className="xp-fill" style={{ width: `${getLevelProgress()}%` }} />
            </div>
            <span className="xp-text">{state.points} XP</span>
          </div>
        </div>
      </div>
      <div className="profile-stats">
        <div className="stat-item">
          <span className="stat-value">{state.totalPlays}</span>
          <span className="stat-label">Total Bermain</span>
        </div>
        <div className="stat-item">
          <span className="stat-value">{state.points}</span>
          <span className="stat-label">Total Poin</span>
        </div>
        <div className="stat-item">
          <span className="stat-value">{state.achievements.length}</span>
          <span className="stat-label">Pencapaian</span>
        </div>
      </div>
    </div>
  );
};

export default Profile;

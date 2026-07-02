import React from 'react';
import { useGame } from '../context/GameContext';
import './Statistics.css';

const Statistics: React.FC = () => {
  const { state } = useGame();

  const gameNames: { [key: string]: string } = {
    caklontong: 'Cak Lontong',
    tebakbendera: 'Tebak Bendera',
    asahotak: 'Asah Otak',
    mtk: 'Matematika',
    susunkata: 'Susun Kata',
    tebakwarna: 'Tebak Warna',
  };

  const getMostPlayedGame = () => {
    const games = state.stats.gamesPlayed;
    if (Object.keys(games).length === 0) return 'Belum ada';
    const max = Math.max(...Object.values(games));
    const gameId = Object.keys(games).find(key => games[key] === max);
    return gameId ? gameNames[gameId] || gameId : 'Belum ada';
  };

  const accuracy = state.stats.correctAnswers + state.stats.wrongAnswers > 0
    ? Math.round((state.stats.correctAnswers / (state.stats.correctAnswers + state.stats.wrongAnswers)) * 100)
    : 0;

  return (
    <div className="statistics">
      <h2>📊 Statistik</h2>
      <div className="stats-grid">
        <div className="stat-card">
          <div className="stat-icon">🎮</div>
          <div className="stat-info">
            <span className="stat-number">{state.totalPlays}</span>
            <span className="stat-label">Total Permainan</span>
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-icon">⭐</div>
          <div className="stat-info">
            <span className="stat-number">{state.points}</span>
            <span className="stat-label">Total Poin</span>
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-icon">🎯</div>
          <div className="stat-info">
            <span className="stat-number">{accuracy}%</span>
            <span className="stat-label">Akurasi</span>
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-icon">🏆</div>
          <div className="stat-info">
            <span className="stat-number">{state.achievements.length}</span>
            <span className="stat-label">Pencapaian</span>
          </div>
        </div>
      </div>
      <div className="stat-details">
        <h3>Detail Permainan</h3>
        <div className="game-stats-list">
          {Object.entries(state.stats.gamesPlayed).map(([gameId, count]) => (
            <div key={gameId} className="game-stat-item">
              <span>{gameNames[gameId] || gameId}</span>
              <span>{count} kali</span>
            </div>
          ))}
        </div>
        <div className="stat-summary">
          <p>✅ Jawaban Benar: {state.stats.correctAnswers}</p>
          <p>❌ Jawaban Salah: {state.stats.wrongAnswers}</p>
          <p>🎯 Game Favorit: {getMostPlayedGame()}</p>
        </div>
      </div>
    </div>
  );
};

export default Statistics;

import React from 'react';
import { useGame } from '../context/GameContext';
import './Achievements.css';

const Achievements: React.FC = () => {
  const { state } = useGame();

  const allAchievements = [
    { id: 'first_game', name: 'Pertama Kali', desc: 'Mainkan game pertama', icon: '🎮' },
    { id: 'ten_games', name: 'Sepuluh Kali', desc: 'Mainkan 10 game', icon: '🔄' },
    { id: 'fifty_games', name: 'Lima Puluh Kali', desc: 'Mainkan 50 game', icon: '🏃' },
    { id: 'hundred_games', name: 'Seratus Kali', desc: 'Mainkan 100 game', icon: '🏆' },
    { id: 'score_100', name: 'Skor 100', desc: 'Dapatkan 100 poin', icon: '💯' },
    { id: 'score_500', name: 'Skor 500', desc: 'Dapatkan 500 poin', icon: '⭐' },
    { id: 'score_1000', name: 'Skor 1000', desc: 'Dapatkan 1000 poin', icon: '🌟' },
    { id: 'correct_10', name: '10 Benar', desc: '10 jawaban benar', icon: '✅' },
    { id: 'correct_50', name: '50 Benar', desc: '50 jawaban benar', icon: '🎯' },
    { id: 'level_5', name: 'Level 5', desc: 'Capai level 5', icon: '📈' },
    { id: 'level_10', name: 'Level 10', desc: 'Capai level 10', icon: '🔥' },
    { id: 'level_20', name: 'Level 20', desc: 'Capai level 20', icon: '👑' },
  ];

  const isUnlocked = (achievementId: string) => {
    return state.achievements.includes(achievementId);
  };

  return (
    <div className="achievements">
      <h2>🏆 Pencapaian</h2>
      <div className="achievements-grid">
        {allAchievements.map((achievement) => (
          <div 
            key={achievement.id} 
            className={`achievement-card ${isUnlocked(achievement.id) ? 'unlocked' : 'locked'}`}
          >
            <div className="achievement-icon">{achievement.icon}</div>
            <div className="achievement-info">
              <h4>{achievement.name}</h4>
              <p>{achievement.desc}</p>
              {isUnlocked(achievement.id) ? (
                <span className="unlocked-badge">✅ Terbuka</span>
              ) : (
                <span className="locked-badge">🔒 Terkunci</span>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Achievements;

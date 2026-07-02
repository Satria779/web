import React, { useState, useEffect, useCallback } from 'react';
import { useGame } from '../context/GameContext';
import './GamePlay.css';

interface GamePlayProps {
  gameId: string;
  gameData: {
    id: string;
    title: string;
    icon: string;
    api: string;
  };
  onBack: () => void;
}

const GamePlay: React.FC<GamePlayProps> = ({ gameId, gameData, onBack }) => {
  const [question, setQuestion] = useState<any>(null);
  const [answer, setAnswer] = useState('');
  const [feedback, setFeedback] = useState('');
  const [score, setScore] = useState(0);
  const [attempts, setAttempts] = useState(0);
  const [loading, setLoading] = useState(true);
  const { dispatch } = useGame();

  // Gunakan useCallback untuk fetchQuestion
  const fetchQuestion = useCallback(async () => {
    setLoading(true);
    try {
      const response = await fetch(gameData.api);
      const data = await response.json();
      setQuestion(data);
      setFeedback('');
      setAnswer('');
    } catch (error) {
      console.error('Error fetching question:', error);
    } finally {
      setLoading(false);
    }
  }, [gameData.api]); // Tambahkan dependency gameData.api

  useEffect(() => {
    fetchQuestion();
  }, [fetchQuestion]); // Dependency sekarang fetchQuestion

  const handleSubmit = () => {
    if (!answer.trim()) return;
    
    setAttempts(prev => prev + 1);
    const isCorrect = answer.toLowerCase().trim() === question.jawaban?.toLowerCase().trim();
    
    if (isCorrect) {
      const points = Math.max(10, 100 - (attempts * 5));
      setScore(prev => prev + points);
      setFeedback('✅ Benar! +' + points + ' poin');
      dispatch({ type: 'ADD_POINTS', payload: points });
      dispatch({ type: 'INCREMENT_PLAYS' });
      // Update stats
      dispatch({ type: 'UPDATE_STATS', payload: { gameId, correct: true } });
      
      setTimeout(() => {
        fetchQuestion();
      }, 1500);
    } else {
      setFeedback('❌ Coba lagi!');
      dispatch({ type: 'UPDATE_STATS', payload: { gameId, correct: false } });
      if (attempts >= 2) {
        setFeedback(`💡 Jawaban: ${question.jawaban}`);
        setTimeout(() => {
          fetchQuestion();
        }, 2000);
      }
    }
  };

  if (loading) {
    return <div className="loading">Memuat soal...</div>;
  }

  return (
    <div className="game-play">
      <button className="back-button" onClick={onBack}>← Kembali</button>
      <div className="game-header">
        <span className="game-icon">{gameData.icon}</span>
        <h2>{gameData.title}</h2>
        <div className="game-stats">
          <span>⭐ {score} poin</span>
          <span>🎯 {attempts} percobaan</span>
        </div>
      </div>
      <div className="question-box">
        <p className="question-text">{question?.soal || 'Pertanyaan tidak tersedia'}</p>
        <div className="answer-section">
          <input
            type="text"
            value={answer}
            onChange={(e) => setAnswer(e.target.value)}
            placeholder="Ketik jawaban..."
            onKeyPress={(e) => e.key === 'Enter' && handleSubmit()}
          />
          <button onClick={handleSubmit}>Kirim</button>
        </div>
        {feedback && <div className="feedback">{feedback}</div>}
      </div>
    </div>
  );
};

export default GamePlay;

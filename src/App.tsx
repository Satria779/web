import React, { useState, useEffect } from 'react';
import './App.css';
import Sidebar from './components/Sidebar';
import Header from './components/Header';
import GameCard from './components/GameCard';
import Profile from './components/Profile';
import GamePlay from './components/GamePlay';
import Statistics from './components/Statistics';
import Achievements from './components/Achievements';
import { GameProvider, useGame } from './context/GameContext';

const AppContent: React.FC = () => {
  const [activePage, setActivePage] = useState('home');
  const [selectedGame, setSelectedGame] = useState<string | null>(null);
  const { state } = useGame();

  const games = [
    { id: 'caklontong', title: 'Cak Lontong', icon: '🧩', api: 'https://api-xemoz-official.my.id/api/game/caklontong.php' },
    { id: 'tebakbendera', title: 'Tebak Bendera', icon: '🏳️', api: 'https://api-xemoz-official.my.id/api/game/tebakbendera.php' },
    { id: 'asahotak', title: 'Asah Otak', icon: '🧠', api: 'https://api-xemoz-official.my.id/api/game/asahotak.php' },
    { id: 'mtk', title: 'Matematika', icon: '📐', api: 'https://api-xemoz-official.my.id/api/game/mtk.php?level=medium' },
    { id: 'susunkata', title: 'Susun Kata', icon: '🔤', api: 'https://api-xemoz-official.my.id/api/game/susunkata.php' },
    { id: 'tebakwarna', title: 'Tebak Warna', icon: '🎨', api: 'https://api-xemoz-official.my.id/api/game/tebak-warna.php' },
  ];

  const handleGameSelect = (gameId: string) => {
    setSelectedGame(gameId);
    setActivePage('play');
  };

  const handleBack = () => {
    setSelectedGame(null);
    setActivePage('home');
  };

  return (
    <div className="app">
      <Sidebar setActivePage={setActivePage} />
      <div className="main-content">
        <Header />
        <div className="content">
          {activePage === 'home' && (
            <>
              <div className="trending-section">
                <div className="section-header">
                  <h2>Trending Sekarang</h2>
                  <span className="live-badge">LIVE</span>
                </div>
                <div className="games-grid">
                  {games.map((game, index) => (
                    <GameCard
                      key={game.id}
                      game={game}
                      rank={index + 1}
                      onClick={() => handleGameSelect(game.id)}
                    />
                  ))}
                </div>
              </div>
              <Profile />
            </>
          )}
          {activePage === 'play' && selectedGame && (
            <GamePlay 
              gameId={selectedGame} 
              gameData={games.find(g => g.id === selectedGame)!}
              onBack={handleBack}
            />
          )}
          {activePage === 'statistics' && <Statistics />}
          {activePage === 'achievements' && <Achievements />}
          {activePage === 'profile' && <Profile />}
        </div>
      </div>
    </div>
  );
};

const App: React.FC = () => {
  return (
    <GameProvider>
      <AppContent />
    </GameProvider>
  );
};

export default App;

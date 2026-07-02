import React, { useState } from 'react';
import { useGame } from '../context/GameContext';
import './Sidebar.css';

interface SidebarProps {
  setActivePage: (page: string) => void;
}

const Sidebar: React.FC<SidebarProps> = ({ setActivePage }) => {
  const [isOpen, setIsOpen] = useState(false);
  const { state } = useGame();

  const menuItems = [
    { id: 'home', label: '🏠 Beranda' },
    { id: 'statistics', label: '📊 Statistik' },
    { id: 'achievements', label: '🏆 Pencapaian' },
    { id: 'profile', label: '👤 Profil' },
  ];

  return (
    <>
      <button className="menu-toggle" onClick={() => setIsOpen(!isOpen)}>
        <span className="menu-icon">☰</span>
      </button>
      <div className={`sidebar ${isOpen ? 'open' : ''}`}>
        <div className="sidebar-header">
          <h2>🎮 WEB</h2>
          <p className="user-level">Level {state.level}</p>
        </div>
        <nav className="sidebar-nav">
          {menuItems.map((item) => (
            <button
              key={item.id}
              className="nav-item"
              onClick={() => {
                setActivePage(item.id);
                setIsOpen(false);
              }}
            >
              {item.label}
            </button>
          ))}
        </nav>
        <div className="sidebar-footer">
          <div className="user-stats">
            <span>⭐ {state.points} Poin</span>
          </div>
        </div>
      </div>
      {isOpen && <div className="sidebar-overlay" onClick={() => setIsOpen(false)} />}
    </>
  );
};

export default Sidebar;

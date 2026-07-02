import React, { createContext, useContext, useReducer, useEffect } from 'react';

interface GameState {
  username: string;
  level: number;
  points: number;
  totalPlays: number;
  achievements: string[];
  stats: {
    gamesPlayed: { [key: string]: number };
    correctAnswers: number;
    wrongAnswers: number;
  };
}

type GameAction = 
  | { type: 'SET_USERNAME'; payload: string }
  | { type: 'ADD_POINTS'; payload: number }
  | { type: 'INCREMENT_PLAYS' }
  | { type: 'UNLOCK_ACHIEVEMENT'; payload: string }
  | { type: 'UPDATE_STATS'; payload: { gameId: string; correct: boolean } }
  | { type: 'LOAD_STATE'; payload: GameState };

const initialState: GameState = {
  username: `Player${Math.floor(Math.random() * 1000)}`,
  level: 1,
  points: 0,
  totalPlays: 0,
  achievements: [],
  stats: {
    gamesPlayed: {},
    correctAnswers: 0,
    wrongAnswers: 0,
  },
};

const gameReducer = (state: GameState, action: GameAction): GameState => {
  switch (action.type) {
    case 'SET_USERNAME':
      return { ...state, username: action.payload };
    case 'ADD_POINTS': {
      const newPoints = state.points + action.payload;
      const newLevel = Math.floor(newPoints / 100) + 1;
      return { ...state, points: newPoints, level: newLevel };
    }
    case 'INCREMENT_PLAYS':
      return { ...state, totalPlays: state.totalPlays + 1 };
    case 'UNLOCK_ACHIEVEMENT':
      if (state.achievements.includes(action.payload)) return state;
      return { ...state, achievements: [...state.achievements, action.payload] };
    case 'UPDATE_STATS': {
      const newStats = { ...state.stats };
      newStats.gamesPlayed[action.payload.gameId] = (newStats.gamesPlayed[action.payload.gameId] || 0) + 1;
      if (action.payload.correct) {
        newStats.correctAnswers += 1;
      } else {
        newStats.wrongAnswers += 1;
      }
      return { ...state, stats: newStats };
    }
    case 'LOAD_STATE':
      return action.payload;
    default:
      return state;
  }
};

const GameContext = createContext<{
  state: GameState;
  dispatch: React.Dispatch<GameAction>;
} | null>(null);

export const GameProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [state, dispatch] = useReducer(gameReducer, initialState, () => {
    const saved = localStorage.getItem('gameState');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch {
        return initialState;
      }
    }
    return initialState;
  });

  useEffect(() => {
    localStorage.setItem('gameState', JSON.stringify(state));
  }, [state]);

  return (
    <GameContext.Provider value={{ state, dispatch }}>
      {children}
    </GameContext.Provider>
  );
};

export const useGame = () => {
  const context = useContext(GameContext);
  if (!context) {
    throw new Error('useGame must be used within a GameProvider');
  }
  return context;
};

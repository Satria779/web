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

// Fungsi untuk cek dan unlock achievements secara otomatis
const checkAchievements = (state: GameState): string[] => {
  const newAchievements: string[] = [];
  const { achievements, totalPlays, points, stats, level } = state;

  // Achievement: first_game
  if (totalPlays >= 1 && !achievements.includes('first_game')) {
    newAchievements.push('first_game');
  }
  // Achievement: ten_games
  if (totalPlays >= 10 && !achievements.includes('ten_games')) {
    newAchievements.push('ten_games');
  }
  // Achievement: fifty_games
  if (totalPlays >= 50 && !achievements.includes('fifty_games')) {
    newAchievements.push('fifty_games');
  }
  // Achievement: hundred_games
  if (totalPlays >= 100 && !achievements.includes('hundred_games')) {
    newAchievements.push('hundred_games');
  }
  // Achievement: score_100
  if (points >= 100 && !achievements.includes('score_100')) {
    newAchievements.push('score_100');
  }
  // Achievement: score_500
  if (points >= 500 && !achievements.includes('score_500')) {
    newAchievements.push('score_500');
  }
  // Achievement: score_1000
  if (points >= 1000 && !achievements.includes('score_1000')) {
    newAchievements.push('score_1000');
  }
  // Achievement: correct_10
  if (stats.correctAnswers >= 10 && !achievements.includes('correct_10')) {
    newAchievements.push('correct_10');
  }
  // Achievement: correct_50
  if (stats.correctAnswers >= 50 && !achievements.includes('correct_50')) {
    newAchievements.push('correct_50');
  }
  // Achievement: level_5
  if (level >= 5 && !achievements.includes('level_5')) {
    newAchievements.push('level_5');
  }
  // Achievement: level_10
  if (level >= 10 && !achievements.includes('level_10')) {
    newAchievements.push('level_10');
  }
  // Achievement: level_20
  if (level >= 20 && !achievements.includes('level_20')) {
    newAchievements.push('level_20');
  }

  return newAchievements;
};

const gameReducer = (state: GameState, action: GameAction): GameState => {
  let newState = { ...state };

  switch (action.type) {
    case 'SET_USERNAME':
      newState = { ...state, username: action.payload };
      break;
    case 'ADD_POINTS': {
      const newPoints = state.points + action.payload;
      const newLevel = Math.floor(newPoints / 100) + 1;
      newState = { ...state, points: newPoints, level: newLevel };
      break;
    }
    case 'INCREMENT_PLAYS':
      newState = { ...state, totalPlays: state.totalPlays + 1 };
      break;
    case 'UNLOCK_ACHIEVEMENT':
      if (state.achievements.includes(action.payload)) return state;
      newState = { ...state, achievements: [...state.achievements, action.payload] };
      break;
    case 'UPDATE_STATS': {
      const newStats = { ...state.stats };
      newStats.gamesPlayed[action.payload.gameId] = (newStats.gamesPlayed[action.payload.gameId] || 0) + 1;
      if (action.payload.correct) {
        newStats.correctAnswers += 1;
      } else {
        newStats.wrongAnswers += 1;
      }
      newState = { ...state, stats: newStats };
      break;
    }
    case 'LOAD_STATE':
      newState = action.payload;
      break;
    default:
      return state;
  }

  // Auto-check achievements setelah state berubah
  const newAchievements = checkAchievements(newState);
  if (newAchievements.length > 0) {
    newState = {
      ...newState,
      achievements: [...newState.achievements, ...newAchievements]
    };
  }

  return newState;
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
        const parsed = JSON.parse(saved);
        // Pastikan semua field ada
        if (!parsed.stats) {
          parsed.stats = { gamesPlayed: {}, correctAnswers: 0, wrongAnswers: 0 };
        }
        return parsed;
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

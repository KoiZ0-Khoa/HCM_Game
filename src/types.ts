export type CardType =
  | 'plus1'
  | 'plus2'
  | 'plus3'
  | 'plus4'
  | 'plus5'
  | 'bomb'
  | 'nuclear'
  | 'loseAll'
  | 'changePoints'
  | 'rare';

export interface Card {
  id: number;
  type: CardType;
  name: string;
  effectText: string;
  academicText: string;
  isRevealed: boolean;
}

export interface Team {
  id: number;
  name: string;
  score: number;
  isEliminated?: boolean; // For future expansions if needed
}

export interface GameLog {
  id: string;
  timestamp: string;
  message: string;
  type: 'info' | 'success' | 'warning' | 'danger' | 'special';
}

export type GamePhase = 'lobby' | 'board' | 'question' | 'flipping' | 'victory';

export type QuestionStatus = 'idle' | 'answering' | 'correct' | 'incorrect' | 'timeUp';

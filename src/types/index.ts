export type Operation = 'multiply' | 'divide';
export type DisplayFormat = 'standard' | 'missing_first' | 'missing_second';
export type Difficulty = 1 | 2 | 3 | 4;
export type Screen = 'home' | 'battle' | 'results';

export interface Problem {
  operandA: number;
  operandB: number;
  operation: Operation;
  answer: number;
  displayFormat: DisplayFormat;
  missingValue: number;
}

export interface AnswerChoice {
  value: number;
  isCorrect: boolean;
}

export interface Monster {
  id: string;
  name: string;
  emoji: string;
  color: string;
  maxHP: number;
  currentHP: number;
  isBoss: boolean;
  attackPhrase: string;
}

export interface Dungeon {
  id: string;
  name: string;
  description: string;
  operations: Operation[];
  operands: number[];
  monsterCount: number;
  difficulty: Difficulty;
  theme: {
    bg: string;
    accent: string;
    icon: string;
  };
  unlockCondition: null | { dungeonId: string; minStars: number };
}

export interface BattleState {
  dungeon: Dungeon;
  monsters: Monster[];
  currentMonsterIndex: number;
  currentProblem: Problem;
  choices: AnswerChoice[];
  playerHearts: number;
  correctCount: number;
  wrongCount: number;
  bossHitsLanded: number;
  phase: 'answering' | 'correct_feedback' | 'wrong_feedback' | 'monster_defeated' | 'boss_intro' | 'victory' | 'game_over';
  lastAnswerCorrect: boolean | null;
}

export interface DungeonResult {
  dungeon: Dungeon;
  correctCount: number;
  wrongCount: number;
  heartsRemaining: number;
  stars: number;
  xpEarned: number;
}

export interface PlayerProgress {
  level: number;
  xp: number;
  dungeonProgress: Record<string, { bestStars: number; unlocked: boolean }>;
}

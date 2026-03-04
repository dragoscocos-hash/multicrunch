import { createContext, useContext, useReducer, type ReactNode } from 'react';
import type { Screen, BattleState, DungeonResult, PlayerProgress, Dungeon, GameSettings, Difficulty, AnswerMode } from '../types';
import { generateMonsterList } from '../game/monsters';
import { generateProblem, generateChoices } from '../game/problemGenerator';

interface AppState {
  screen: Screen;
  battle: BattleState | null;
  lastResult: DungeonResult | null;
  player: PlayerProgress;
  settings: GameSettings;
}

type Action =
  | { type: 'START_DUNGEON'; dungeon: Dungeon }
  | { type: 'ANSWER'; choiceValue: number }
  | { type: 'ADVANCE_AFTER_FEEDBACK' }
  | { type: 'GO_HOME' }
  | { type: 'RETRY' }
  | { type: 'UPDATE_SETTINGS'; settings: Partial<GameSettings> };

function calcStars(correct: number, wrong: number, heartsRemaining: number): number {
  const total = correct + wrong;
  const accuracy = total > 0 ? correct / total : 0;
  if (accuracy === 1 && heartsRemaining === 3) return 3;
  if (accuracy >= 0.8) return 2;
  return 1;
}

function loadPlayer(): PlayerProgress {
  try {
    const saved = localStorage.getItem('multicrunch_player');
    if (saved) return JSON.parse(saved);
  } catch { /* ignore */ }
  return {
    level: 1,
    xp: 0,
    dungeonProgress: {
      'doubles-den': { bestStars: 0, unlocked: true },
      'tower-of-tens': { bestStars: 0, unlocked: false },
      'fives-forest': { bestStars: 0, unlocked: false },
      'quad-caverns': { bestStars: 0, unlocked: false },
    },
  };
}

function savePlayer(player: PlayerProgress) {
  localStorage.setItem('multicrunch_player', JSON.stringify(player));
}

const DEFAULT_SETTINGS: GameSettings = {
  selectedTables: [2, 5, 10],
  difficulty: 1 as Difficulty,
  answerMode: 'multiple_choice' as AnswerMode,
};

function loadSettings(): GameSettings {
  try {
    const saved = localStorage.getItem('multicrunch_settings');
    if (saved) return { ...DEFAULT_SETTINGS, ...JSON.parse(saved) };
  } catch { /* ignore */ }
  return { ...DEFAULT_SETTINGS };
}

function saveSettings(settings: GameSettings) {
  localStorage.setItem('multicrunch_settings', JSON.stringify(settings));
}

const DIFFICULTY_CONFIG: Record<number, { monsterCount: number; hearts: number }> = {
  1: { monsterCount: 5, hearts: 4 },
  2: { monsterCount: 7, hearts: 3 },
  3: { monsterCount: 9, hearts: 3 },
  4: { monsterCount: 12, hearts: 2 },
};

function reducer(state: AppState, action: Action): AppState {
  switch (action.type) {
    case 'START_DUNGEON': {
      const diffConfig = DIFFICULTY_CONFIG[state.settings.difficulty] ?? DIFFICULTY_CONFIG[1];
      const dungeonClone: Dungeon = {
        ...action.dungeon,
        operands: state.settings.selectedTables,
        monsterCount: diffConfig.monsterCount,
      };
      const monsters = generateMonsterList(dungeonClone);
      const problem = generateProblem(dungeonClone);
      const choices = generateChoices(problem, dungeonClone);
      const battle: BattleState = {
        dungeon: dungeonClone,
        monsters,
        currentMonsterIndex: 0,
        currentProblem: problem,
        choices,
        playerHearts: diffConfig.hearts,
        correctCount: 0,
        wrongCount: 0,
        bossHitsLanded: 0,
        phase: monsters[0].isBoss ? 'boss_intro' : 'answering',
        answerMode: state.settings.answerMode,
        lastAnswerCorrect: null,
      };
      return { ...state, screen: 'battle', battle };
    }

    case 'ANSWER': {
      if (!state.battle || state.battle.phase !== 'answering') return state;
      const b = state.battle;
      const isCorrect = action.choiceValue === b.currentProblem.answer;
      const monster = b.monsters[b.currentMonsterIndex];

      if (isCorrect) {
        const newBossHits = monster.isBoss ? b.bossHitsLanded + 1 : b.bossHitsLanded;
        const updatedMonsters = b.monsters.map((m, i) =>
          i === b.currentMonsterIndex ? { ...m, currentHP: m.currentHP - 1 } : m
        );
        return {
          ...state,
          battle: {
            ...b,
            monsters: updatedMonsters,
            correctCount: b.correctCount + 1,
            bossHitsLanded: newBossHits,
            lastAnswerCorrect: true,
            phase: 'player_attacking',
          },
        };
      } else {
        const newHearts = b.playerHearts - 1;
        return {
          ...state,
          battle: {
            ...b,
            wrongCount: b.wrongCount + 1,
            playerHearts: newHearts,
            lastAnswerCorrect: false,
            phase: 'monster_attacking',
          },
        };
      }
    }

    case 'ADVANCE_AFTER_FEEDBACK': {
      if (!state.battle) return state;
      const b = state.battle;

      if (b.phase === 'player_attacking') {
        const monster = b.monsters[b.currentMonsterIndex];
        const monsterDefeated = !monster.isBoss || b.bossHitsLanded >= monster.maxHP;
        return {
          ...state,
          battle: {
            ...b,
            phase: monsterDefeated ? 'monster_defeated' : 'correct_feedback',
          },
        };
      }

      if (b.phase === 'monster_attacking') {
        return {
          ...state,
          battle: {
            ...b,
            phase: b.playerHearts <= 0 ? 'game_over' : 'wrong_feedback',
          },
        };
      }

      if (b.phase === 'wrong_feedback' || b.phase === 'correct_feedback') {
        const problem = generateProblem(b.dungeon);
        return {
          ...state,
          battle: {
            ...b,
            currentProblem: problem,
            choices: generateChoices(problem, b.dungeon),
            lastAnswerCorrect: null,
            phase: 'answering',
          },
        };
      }

      if (b.phase === 'boss_intro') {
        const problem = generateProblem(b.dungeon);
        return {
          ...state,
          battle: {
            ...b,
            currentProblem: problem,
            choices: generateChoices(problem, b.dungeon),
            phase: 'answering',
          },
        };
      }

      if (b.phase === 'monster_defeated') {
        const nextIndex = b.currentMonsterIndex + 1;
        if (nextIndex >= b.monsters.length) {
          const stars = calcStars(b.correctCount, b.wrongCount, b.playerHearts);
          const xpEarned = stars * 10 + b.correctCount * 2;
          const result: DungeonResult = {
            dungeon: b.dungeon,
            correctCount: b.correctCount,
            wrongCount: b.wrongCount,
            heartsRemaining: b.playerHearts,
            stars,
            xpEarned,
          };

          const prev = state.player.dungeonProgress[b.dungeon.id];
          const newProgress = { ...state.player.dungeonProgress };
          newProgress[b.dungeon.id] = { bestStars: Math.max(prev?.bestStars ?? 0, stars), unlocked: true };

          const DUNGEONS_IDS = ['doubles-den', 'tower-of-tens', 'fives-forest', 'quad-caverns'];
          const idx = DUNGEONS_IDS.indexOf(b.dungeon.id);
          if (idx >= 0 && idx + 1 < DUNGEONS_IDS.length) {
            const nextId = DUNGEONS_IDS[idx + 1];
            newProgress[nextId] = { ...newProgress[nextId], unlocked: true };
          }

          const newPlayer: PlayerProgress = {
            ...state.player,
            xp: state.player.xp + xpEarned,
            dungeonProgress: newProgress,
          };
          savePlayer(newPlayer);

          return { ...state, screen: 'results', battle: { ...b, phase: 'victory' }, lastResult: result, player: newPlayer };
        }

        const nextMonster = b.monsters[nextIndex];
        const problem = generateProblem(b.dungeon);
        return {
          ...state,
          battle: {
            ...b,
            currentMonsterIndex: nextIndex,
            bossHitsLanded: 0,
            currentProblem: problem,
            choices: generateChoices(problem, b.dungeon),
            lastAnswerCorrect: null,
            phase: nextMonster.isBoss ? 'boss_intro' : 'answering',
          },
        };
      }

      return state;
    }

    case 'GO_HOME':
      return { ...state, screen: 'home', battle: null };

    case 'RETRY': {
      if (!state.battle) return { ...state, screen: 'home' };
      const dungeon = state.battle.dungeon;
      const diffConfig = DIFFICULTY_CONFIG[state.settings.difficulty] ?? DIFFICULTY_CONFIG[1];
      const monsters = generateMonsterList(dungeon);
      const problem = generateProblem(dungeon);
      return {
        ...state,
        screen: 'battle',
        battle: {
          dungeon,
          monsters,
          currentMonsterIndex: 0,
          currentProblem: problem,
          choices: generateChoices(problem, dungeon),
          playerHearts: diffConfig.hearts,
          correctCount: 0,
          wrongCount: 0,
          bossHitsLanded: 0,
          phase: 'answering',
          answerMode: state.settings.answerMode,
          lastAnswerCorrect: null,
        },
      };
    }

    case 'UPDATE_SETTINGS': {
      const newSettings = { ...state.settings, ...action.settings };
      saveSettings(newSettings);
      return { ...state, settings: newSettings };
    }

    default:
      return state;
  }
}

const GameContext = createContext<{ state: AppState; dispatch: React.Dispatch<Action> } | null>(null);

export function GameProvider({ children }: { children: ReactNode }) {
  const player = loadPlayer();
  const settings = loadSettings();
  const [state, dispatch] = useReducer(reducer, {
    screen: 'home',
    battle: null,
    lastResult: null,
    player,
    settings,
  });
  return <GameContext.Provider value={{ state, dispatch }}>{children}</GameContext.Provider>;
}

export function useGame() {
  const ctx = useContext(GameContext);
  if (!ctx) throw new Error('useGame must be used within GameProvider');
  return ctx;
}

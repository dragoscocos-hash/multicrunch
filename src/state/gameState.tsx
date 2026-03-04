import { createContext, useContext, useReducer, type ReactNode } from 'react';
import type { Screen, BattleState, DungeonResult, PlayerProgress, Dungeon } from '../types';
import { generateMonsterList } from '../game/monsters';
import { generateProblem, generateChoices } from '../game/problemGenerator';

interface AppState {
  screen: Screen;
  battle: BattleState | null;
  lastResult: DungeonResult | null;
  player: PlayerProgress;
}

type Action =
  | { type: 'START_DUNGEON'; dungeon: Dungeon }
  | { type: 'ANSWER'; choiceValue: number }
  | { type: 'ADVANCE_AFTER_FEEDBACK' }
  | { type: 'GO_HOME' }
  | { type: 'RETRY' };

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

function reducer(state: AppState, action: Action): AppState {
  switch (action.type) {
    case 'START_DUNGEON': {
      const monsters = generateMonsterList(action.dungeon);
      const problem = generateProblem(action.dungeon);
      const choices = generateChoices(problem, action.dungeon);
      const battle: BattleState = {
        dungeon: action.dungeon,
        monsters,
        currentMonsterIndex: 0,
        currentProblem: problem,
        choices,
        playerHearts: 3,
        correctCount: 0,
        wrongCount: 0,
        bossHitsLanded: 0,
        phase: monsters[0].isBoss ? 'boss_intro' : 'answering',
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
        const monsterDefeated = !monster.isBoss || newBossHits >= monster.maxHP;
        return {
          ...state,
          battle: {
            ...b,
            correctCount: b.correctCount + 1,
            bossHitsLanded: newBossHits,
            lastAnswerCorrect: true,
            phase: monsterDefeated ? 'monster_defeated' : 'correct_feedback',
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
            phase: newHearts <= 0 ? 'game_over' : 'wrong_feedback',
          },
        };
      }
    }

    case 'ADVANCE_AFTER_FEEDBACK': {
      if (!state.battle) return state;
      const b = state.battle;

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
          playerHearts: 3,
          correctCount: 0,
          wrongCount: 0,
          bossHitsLanded: 0,
          phase: 'answering',
          lastAnswerCorrect: null,
        },
      };
    }

    default:
      return state;
  }
}

const GameContext = createContext<{ state: AppState; dispatch: React.Dispatch<Action> } | null>(null);

export function GameProvider({ children }: { children: ReactNode }) {
  const player = loadPlayer();
  const [state, dispatch] = useReducer(reducer, {
    screen: 'home',
    battle: null,
    lastResult: null,
    player,
  });
  return <GameContext.Provider value={{ state, dispatch }}>{children}</GameContext.Provider>;
}

export function useGame() {
  const ctx = useContext(GameContext);
  if (!ctx) throw new Error('useGame must be used within GameProvider');
  return ctx;
}

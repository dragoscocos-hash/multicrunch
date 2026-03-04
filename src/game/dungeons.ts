import type { Dungeon } from '../types';

export const DUNGEONS: Dungeon[] = [
  {
    id: 'doubles-den',
    name: 'The Doubles Den',
    description: 'Master the power of x2!',
    operations: ['multiply'],
    operands: [2],
    monsterCount: 7,
    difficulty: 1,
    theme: {
      bg: 'from-emerald-400 via-green-300 to-teal-400',
      accent: 'text-emerald-800',
      icon: '\u{1F33F}',
    },
    unlockCondition: null,
  },
  {
    id: 'tower-of-tens',
    name: 'Tower of Tens',
    description: 'Climb high with x10!',
    operations: ['multiply'],
    operands: [10],
    monsterCount: 7,
    difficulty: 1,
    theme: {
      bg: 'from-sky-400 via-blue-300 to-cyan-400',
      accent: 'text-blue-800',
      icon: '\u{1F3F0}',
    },
    unlockCondition: { dungeonId: 'doubles-den', minStars: 1 },
  },
  {
    id: 'fives-forest',
    name: "The Fives Forest",
    description: 'Hunt with x5!',
    operations: ['multiply'],
    operands: [5],
    monsterCount: 8,
    difficulty: 2,
    theme: {
      bg: 'from-lime-400 via-green-300 to-emerald-400',
      accent: 'text-lime-800',
      icon: '\u{1F332}',
    },
    unlockCondition: { dungeonId: 'tower-of-tens', minStars: 1 },
  },
  {
    id: 'quad-caverns',
    name: 'Quad Caverns',
    description: 'Face the x4 beasts!',
    operations: ['multiply'],
    operands: [4],
    monsterCount: 8,
    difficulty: 2,
    theme: {
      bg: 'from-violet-400 via-purple-300 to-fuchsia-400',
      accent: 'text-purple-800',
      icon: '\u{1F48E}',
    },
    unlockCondition: { dungeonId: 'fives-forest', minStars: 1 },
  },
];

export function getDungeon(id: string): Dungeon | undefined {
  return DUNGEONS.find(d => d.id === id);
}

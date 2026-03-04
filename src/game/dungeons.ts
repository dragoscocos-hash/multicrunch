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
      bg: 'from-emerald-950 via-green-900 to-teal-950',
      accent: 'text-emerald-300',
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
      bg: 'from-blue-950 via-sky-900 to-cyan-950',
      accent: 'text-sky-300',
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
      bg: 'from-green-950 via-lime-900 to-emerald-950',
      accent: 'text-lime-300',
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
      bg: 'from-violet-950 via-purple-900 to-fuchsia-950',
      accent: 'text-purple-300',
      icon: '\u{1F48E}',
    },
    unlockCondition: { dungeonId: 'fives-forest', minStars: 1 },
  },
];

export function getDungeon(id: string): Dungeon | undefined {
  return DUNGEONS.find(d => d.id === id);
}

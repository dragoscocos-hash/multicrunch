import type { Monster, Dungeon } from '../types';

interface MonsterTemplate {
  id: string;
  name: string;
  emoji: string;
  color: string;
  attackPhrase: string;
}

const REGULAR_MONSTERS: MonsterTemplate[] = [
  { id: 'slime', name: 'Slimeling', emoji: '\u{1F7E2}', color: 'bg-green-500', attackPhrase: 'Splat!' },
  { id: 'bat', name: 'Numbat', emoji: '\u{1F987}', color: 'bg-purple-600', attackPhrase: 'Screech!' },
  { id: 'skull', name: 'Skullkin', emoji: '\u{1F480}', color: 'bg-gray-500', attackPhrase: 'Rattle!' },
  { id: 'spider', name: 'Webber', emoji: '\u{1F577}\u{FE0F}', color: 'bg-gray-700', attackPhrase: 'Tangle!' },
  { id: 'ghost', name: 'Boolet', emoji: '\u{1F47B}', color: 'bg-blue-400', attackPhrase: 'Boo!' },
  { id: 'mushroom', name: 'Sporeling', emoji: '\u{1F344}', color: 'bg-red-600', attackPhrase: 'Poof!' },
  { id: 'eye', name: 'Eyeball', emoji: '\u{1F441}\u{FE0F}', color: 'bg-yellow-500', attackPhrase: 'Stare!' },
  { id: 'crab', name: 'Clawster', emoji: '\u{1F980}', color: 'bg-orange-600', attackPhrase: 'Snap!' },
];

const BOSS_TEMPLATES: Record<string, MonsterTemplate> = {
  'doubles-den': { id: 'boss-twin', name: 'Twin Terror', emoji: '\u{1F608}', color: 'bg-green-700', attackPhrase: 'DOUBLE DAMAGE!' },
  'tower-of-tens': { id: 'boss-titan', name: 'Deca-Titan', emoji: '\u{1F5FF}', color: 'bg-blue-800', attackPhrase: 'TEN TONS!' },
  'fives-forest': { id: 'boss-fang', name: 'Fang Rex', emoji: '\u{1F409}', color: 'bg-lime-800', attackPhrase: 'ROARR!' },
  'quad-caverns': { id: 'boss-quad', name: 'Quad Golem', emoji: '\u{1FAA8}', color: 'bg-violet-800', attackPhrase: 'QUAD SMASH!' },
};

function shuffled<T>(arr: T[]): T[] {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

export function generateMonsterList(dungeon: Dungeon): Monster[] {
  const pool = shuffled(REGULAR_MONSTERS).slice(0, dungeon.monsterCount);
  const regulars: Monster[] = pool.map(t => ({
    ...t,
    maxHP: 1,
    currentHP: 1,
    isBoss: false,
  }));

  const bossTemplate = BOSS_TEMPLATES[dungeon.id] ?? {
    id: 'boss-generic', name: 'Dungeon Boss', emoji: '\u{1F479}', color: 'bg-red-800', attackPhrase: 'GRAAAH!',
  };
  const boss: Monster = {
    ...bossTemplate,
    maxHP: 3,
    currentHP: 3,
    isBoss: true,
  };

  return [...regulars, boss];
}

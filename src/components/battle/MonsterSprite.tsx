import { useEffect, useState } from 'react';
import type { Monster } from '../../types';
import { HPBar } from './HPBar';

interface MonsterSpriteProps {
  monster: Monster;
  isHit: boolean;
  isDefeated: boolean;
  isLunging?: boolean;
}

function getGlowHex(colorClass: string): string {
  const map: Record<string, string> = {
    'bg-green-500': '#22c55e',
    'bg-purple-600': '#9333ea',
    'bg-gray-500': '#6b7280',
    'bg-gray-700': '#374151',
    'bg-blue-400': '#60a5fa',
    'bg-red-600': '#dc2626',
    'bg-yellow-500': '#eab308',
    'bg-orange-600': '#ea580c',
    'bg-green-700': '#15803d',
    'bg-blue-800': '#1e40af',
    'bg-lime-800': '#3f6212',
    'bg-violet-800': '#5b21b6',
  };
  return map[colorClass] || '#6b7280';
}

export function MonsterSprite({ monster, isHit, isDefeated, isLunging = false }: MonsterSpriteProps) {
  const [shake, setShake] = useState(false);

  useEffect(() => {
    if (isHit) {
      setShake(true);
      const t = setTimeout(() => setShake(false), 500);
      return () => clearTimeout(t);
    }
  }, [isHit]);

  const sizeClass = monster.isBoss ? 'text-8xl w-36 h-36' : 'text-6xl w-28 h-28';
  const glowHex = getGlowHex(monster.color);

  return (
    <div className="flex flex-col items-center gap-3">
      {monster.isBoss && (
        <>
          <div className="text-3xl">👑</div>
          <div className="text-red-400 font-bold text-sm tracking-widest uppercase animate-pulse">{'\u26A0'} BOSS {'\u26A0'}</div>
        </>
      )}
      <div className="rounded-3xl p-1" style={{ background: `linear-gradient(135deg, ${glowHex}60, transparent, ${glowHex}60)` }}>
        <div
          className={`
            ${sizeClass}
            flex items-center justify-center rounded-2xl ${monster.color} brightness-75 border-2 border-white/20
            transition-all duration-300
            ${isLunging ? 'animate-monsterLunge' : shake ? 'animate-shake' : 'animate-float'}
            ${isDefeated ? 'scale-0 opacity-0' : 'scale-100 opacity-100'}
            ${isHit ? 'animate-hitFlash' : ''}
            ${monster.isBoss ? 'animate-bossPulse' : ''}
          `}
          style={{
            boxShadow: `0 0 20px ${glowHex}80, 0 0 40px ${glowHex}40, 0 0 60px ${glowHex}20`,
          }}
        >
          <span>{monster.emoji}</span>
        </div>
      </div>
      <div className="text-white font-game font-bold text-lg">{monster.name}</div>
      <div className="w-32">
        <HPBar current={monster.currentHP} max={monster.maxHP} />
      </div>
      <div className="text-white/60 text-sm">{monster.currentHP}/{monster.maxHP} HP</div>
    </div>
  );
}

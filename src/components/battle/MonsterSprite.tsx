import { useEffect, useState } from 'react';
import type { Monster } from '../../types';
import { HPBar } from './HPBar';

interface MonsterSpriteProps {
  monster: Monster;
  isHit: boolean;
  isDefeated: boolean;
}

export function MonsterSprite({ monster, isHit, isDefeated }: MonsterSpriteProps) {
  const [shake, setShake] = useState(false);

  useEffect(() => {
    if (isHit) {
      setShake(true);
      const t = setTimeout(() => setShake(false), 500);
      return () => clearTimeout(t);
    }
  }, [isHit]);

  const sizeClass = monster.isBoss ? 'text-8xl w-32 h-32' : 'text-6xl w-24 h-24';
  const glowClass = monster.isBoss ? 'shadow-[0_0_30px_rgba(255,100,0,0.5)]' : '';

  return (
    <div className="flex flex-col items-center gap-3">
      {monster.isBoss && (
        <div className="text-red-400 font-bold text-sm tracking-widest uppercase animate-pulse">{'\u26A0'} BOSS {'\u26A0'}</div>
      )}
      <div
        className={`
          ${sizeClass} ${glowClass}
          flex items-center justify-center rounded-3xl ${monster.color} border-2 border-white/20
          transition-all duration-300
          ${shake ? 'animate-shake' : 'animate-float'}
          ${isDefeated ? 'scale-0 opacity-0' : 'scale-100 opacity-100'}
        `}
      >
        <span>{monster.emoji}</span>
      </div>
      <div className="text-white font-bold text-lg">{monster.name}</div>
      <div className="w-32">
        <HPBar current={monster.currentHP} max={monster.maxHP} />
      </div>
      <div className="text-white/60 text-sm">{monster.currentHP}/{monster.maxHP} HP</div>
    </div>
  );
}

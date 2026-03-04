import { useEffect, useState } from 'react';

interface BattleEffectsProps {
  phase: string;
  monsterEmoji: string;
}

export function BattleEffects({ phase, monsterEmoji }: BattleEffectsProps) {
  const [showSword, setShowSword] = useState(false);
  const [showImpact, setShowImpact] = useState(false);
  const [showSlash, setShowSlash] = useState(false);
  const [showDamageNumber, setShowDamageNumber] = useState(false);

  const [showProjectile, setShowProjectile] = useState(false);
  const [showVignette, setShowVignette] = useState(false);

  useEffect(() => {
    const timeouts: ReturnType<typeof setTimeout>[] = [];

    // Reset all
    setShowSword(false);
    setShowImpact(false);
    setShowSlash(false);
    setShowDamageNumber(false);
    setShowProjectile(false);
    setShowVignette(false);

    if (phase === 'player_attacking') {
      setShowSword(true);
      timeouts.push(setTimeout(() => setShowImpact(true), 250));
      timeouts.push(setTimeout(() => setShowSlash(true), 200));
      timeouts.push(setTimeout(() => setShowDamageNumber(true), 300));
    }

    if (phase === 'monster_attacking') {
      setShowProjectile(true);
      setShowVignette(true);
    }

    return () => {
      timeouts.forEach(clearTimeout);
    };
  }, [phase]);

  if (phase !== 'player_attacking' && phase !== 'monster_attacking') {
    return null;
  }

  return (
    <div className="pointer-events-none fixed inset-0 z-50">
      {/* Player attacking effects */}
      {phase === 'player_attacking' && (
        <>
          {showSword && (
            <div className="absolute bottom-24 left-1/2 -translate-x-1/2 text-4xl animate-swordFly">
              {'\u2694\uFE0F'}
            </div>
          )}
          {showImpact && (
            <div className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2">
              <div className="w-24 h-24 rounded-full bg-gradient-radial from-white via-yellow-300 to-transparent animate-impactFlash" />
            </div>
          )}
          {showSlash && (
            <div className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 flex flex-col gap-2">
              <div className="w-20 h-1 bg-white rounded-full animate-slashMark" />
              <div className="w-20 h-1 bg-white rounded-full animate-slashMark" style={{ animationDelay: '0.05s' }} />
            </div>
          )}
          {showDamageNumber && (
            <div className="absolute top-[30%] left-1/2 -translate-x-1/2 text-3xl font-black text-yellow-400 animate-damageNumber" style={{ textShadow: '0 0 10px rgba(255,200,0,0.8)' }}>
              -1
            </div>
          )}
        </>
      )}

      {/* Monster attacking effects */}
      {phase === 'monster_attacking' && (
        <>
          {showProjectile && (
            <div className="absolute top-1/3 left-1/2 -translate-x-1/2 text-5xl animate-damageProjectile">
              {monsterEmoji}
            </div>
          )}
          {showVignette && (
            <div className="absolute inset-0 animate-redVignette" />
          )}
        </>
      )}
    </div>
  );
}

import { useGame } from '../../state/gameState';
import { DUNGEONS } from '../../game/dungeons';
import { SettingsPanel } from '../ui/SettingsPanel';
import { Decorations } from '../ui/Decorations';

function StarDisplay({ count }: { count: number }) {
  return (
    <div className="flex gap-0.5">
      {[1,2,3].map(i => (
        <span key={i} className={`text-2xl ${i <= count ? 'text-yellow-400 drop-shadow-[0_0_6px_rgba(250,204,21,0.6)]' : 'text-white/20'}`}>{'\u2605'}</span>
      ))}
    </div>
  );
}

export function HomeScreen() {
  const { state, dispatch } = useGame();
  const { player } = state;

  return (
    <div className="min-h-screen bg-gradient-to-b from-indigo-950 via-purple-950 to-slate-950 bg-stars flex flex-col p-4 gap-4 relative overflow-hidden">
      <Decorations scene="home" />
      <div className="text-center pt-4 pb-2 relative z-20">
        <h1
          className="text-5xl font-game text-yellow-400"
          style={{ transform: 'rotate(-1deg)', textShadow: '0 0 20px rgba(250,204,21,0.6), 0 4px 8px rgba(0,0,0,0.5)' }}
        >
          MultiCrunch
        </h1>
        <p className="text-purple-300 text-sm mt-1">Math Monsters await!</p>
      </div>

      <div className="bg-white/5 backdrop-blur-md rounded-2xl p-3 border border-white/10 flex items-center gap-3 relative z-20">
        <div className="text-3xl">{'\uD83E\uDDD9'}</div>
        <div>
          <div className="text-white font-bold font-game">Level {player.level}</div>
          <div className="text-white/60 text-sm">{player.xp} XP</div>
        </div>
      </div>

      <SettingsPanel />

      <div className="flex flex-col gap-3 relative z-20">
        <div className="text-white/40 text-sm font-bold uppercase tracking-wider">Choose Dungeon</div>
        {DUNGEONS.map((dungeon) => {
          const prog = player.dungeonProgress[dungeon.id];
          const unlocked = prog?.unlocked ?? false;
          const bestStars = prog?.bestStars ?? 0;
          const monsterCount = dungeon.monsterCount + 1;

          return (
            <button
              key={dungeon.id}
              onClick={() => unlocked && dispatch({ type: 'START_DUNGEON', dungeon })}
              disabled={!unlocked}
              className={`
                w-full text-left rounded-2xl p-4 border-2 transition-all active:scale-98 min-h-[100px] overflow-hidden relative
                ${unlocked
                  ? `bg-gradient-to-r ${dungeon.theme.bg} border-white/20 hover:border-white/30 shadow-lg hover:animate-shimmer`
                  : 'bg-black/30 border-white/10 opacity-40 grayscale'}
              `}
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <span className="text-4xl">{dungeon.theme.icon}</span>
                  <div>
                    <div className="text-white font-bold font-game">{dungeon.name}</div>
                    <div className={`text-sm ${dungeon.theme.accent}`}>{dungeon.description}</div>
                    <div className="text-white/40 text-xs mt-0.5">{monsterCount} monsters {'\u2022'} {'\u2694\uFE0F'.repeat(dungeon.difficulty)}</div>
                  </div>
                </div>
                <div className="flex flex-col items-end gap-1">
                  {unlocked ? <StarDisplay count={bestStars} /> : <span className="text-2xl">{'\uD83D\uDD12'}</span>}
                </div>
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
}

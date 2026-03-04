import { useState, useEffect, useMemo } from 'react';
import { useGame } from '../../state/gameState';
import { Button } from '../ui/Button';
import { Decorations } from '../ui/Decorations';

const CONFETTI_COLORS = ['#facc15', '#f97316', '#ef4444', '#a855f7', '#3b82f6', '#22c55e'];

export function ResultsScreen() {
  const { state, dispatch } = useGame();
  const result = state.lastResult!;
  const total = result.correctCount + result.wrongCount;
  const accuracy = total > 0 ? Math.round((result.correctCount / total) * 100) : 0;
  const starMessages = ["Good effort! Keep going!", "Well done! Great job!", "PERFECT! You're a Math Hero! \uD83C\uDFC6"];
  const message = starMessages[result.stars - 1] ?? starMessages[0];

  const confetti = useMemo(() =>
    Array.from({ length: 20 }, (_, i) => ({
      left: `${Math.random() * 100}%`,
      color: CONFETTI_COLORS[i % 6],
      delay: `${Math.random() * 1.5}s`,
      duration: `${2 + Math.random() * 2}s`,
    })), []);

  const [displayXp, setDisplayXp] = useState(0);
  useEffect(() => {
    let current = 0;
    const target = result.xpEarned;
    const step = Math.max(1, Math.ceil(target / 30));
    const interval = setInterval(() => {
      current = Math.min(current + step, target);
      setDisplayXp(current);
      if (current >= target) clearInterval(interval);
    }, 30);
    return () => clearInterval(interval);
  }, [result.xpEarned]);

  return (
    <div className={`min-h-screen bg-gradient-to-b ${result.dungeon.theme.bg} flex flex-col items-center justify-center p-6 gap-6 relative overflow-hidden`}>
      <Decorations scene="results" />

      {result.stars === 3 && (
        <div className="absolute inset-0 pointer-events-none overflow-hidden z-30">
          {confetti.map((c, i) => (
            <div
              key={i}
              className="absolute w-2 h-2 rounded-full animate-confettiFall"
              style={{
                left: c.left,
                top: '-10px',
                backgroundColor: c.color,
                animationDelay: c.delay,
                animationDuration: c.duration,
              }}
            />
          ))}
        </div>
      )}

      <div className="text-center animate-popIn relative z-20">
        {result.stars === 3 && <div className="font-game text-2xl animate-rainbow tracking-wider">PERFECT!</div>}
        <div className="flex justify-center gap-2 text-7xl">
          {[1,2,3].map(i => (
            <span
              key={i}
              className={`animate-starPop ${i <= result.stars ? 'text-yellow-400 drop-shadow-[0_0_15px_rgba(250,204,21,0.9)]' : 'text-white/10'}`}
              style={{ animationDelay: `${(i - 1) * 0.2}s` }}
            >{'\u2605'}</span>
          ))}
        </div>
        <div className="text-white font-game text-2xl mt-3">{message}</div>
      </div>

      <div className="bg-white/5 backdrop-blur-md rounded-3xl p-6 border border-white/10 w-full max-w-sm relative z-20">
        <div className="grid grid-cols-3 gap-4 text-center">
          <div>
            <div className="text-green-400 text-3xl font-black font-game">{result.correctCount}</div>
            <div className="text-white/50 text-sm">Correct</div>
          </div>
          <div>
            <div className="text-red-400 text-3xl font-black font-game">{result.wrongCount}</div>
            <div className="text-white/50 text-sm">Wrong</div>
          </div>
          <div>
            <div className="text-yellow-400 text-3xl font-black font-game">{accuracy}%</div>
            <div className="text-white/50 text-sm">Accuracy</div>
          </div>
        </div>
        <div className="border-t border-white/10 mt-4 pt-4 text-center">
          <div className="text-yellow-400 font-game text-xl animate-xpGlow">+{displayXp} XP earned!</div>
          <div className="text-white/50 text-sm mt-1">
            {'\u2764\uFE0F'.repeat(result.heartsRemaining)}{'\uD83D\uDDA4'.repeat(3 - result.heartsRemaining)} hearts remaining
          </div>
        </div>
      </div>

      <div className="flex gap-3 relative z-20">
        <Button onClick={() => dispatch({ type: 'RETRY' })} size="lg">{'\uD83D\uDD04'} Play Again</Button>
        <Button onClick={() => dispatch({ type: 'GO_HOME' })} variant="secondary" size="lg">{'\uD83C\uDFE0'} Map</Button>
      </div>
    </div>
  );
}

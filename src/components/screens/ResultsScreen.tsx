import { useGame } from '../../state/gameState';
import { Button } from '../ui/Button';

export function ResultsScreen() {
  const { state, dispatch } = useGame();
  const result = state.lastResult!;
  const total = result.correctCount + result.wrongCount;
  const accuracy = total > 0 ? Math.round((result.correctCount / total) * 100) : 0;
  const starMessages = ["Good effort! Keep going!", "Well done! Great job!", "PERFECT! You're a Math Hero! \uD83C\uDFC6"];
  const message = starMessages[result.stars - 1] ?? starMessages[0];

  return (
    <div className={`min-h-screen bg-gradient-to-b ${result.dungeon.theme.bg} flex flex-col items-center justify-center p-6 gap-6`}>
      <div className="text-center animate-popIn">
        <div className="flex justify-center gap-2 text-6xl">
          {[1,2,3].map(i => (
            <span key={i} className={`${i <= result.stars ? 'text-yellow-400 drop-shadow-[0_0_10px_rgba(250,204,21,0.8)]' : 'text-white/20'}`}>{'\u2605'}</span>
          ))}
        </div>
        <div className="text-white text-xl font-bold mt-3">{message}</div>
      </div>

      <div className="bg-black/30 rounded-3xl p-6 border border-white/10 w-full max-w-sm">
        <div className="grid grid-cols-3 gap-4 text-center">
          <div>
            <div className="text-green-400 text-3xl font-black">{result.correctCount}</div>
            <div className="text-white/60 text-sm">Correct</div>
          </div>
          <div>
            <div className="text-red-400 text-3xl font-black">{result.wrongCount}</div>
            <div className="text-white/60 text-sm">Wrong</div>
          </div>
          <div>
            <div className="text-yellow-400 text-3xl font-black">{accuracy}%</div>
            <div className="text-white/60 text-sm">Accuracy</div>
          </div>
        </div>
        <div className="border-t border-white/10 mt-4 pt-4 text-center">
          <div className="text-yellow-400 font-bold">+{result.xpEarned} XP earned!</div>
          <div className="text-white/60 text-sm mt-1">
            {'\u2764\uFE0F'.repeat(result.heartsRemaining)}{'\uD83D\uDDA4'.repeat(3 - result.heartsRemaining)} hearts remaining
          </div>
        </div>
      </div>

      <div className="flex gap-3">
        <Button onClick={() => dispatch({ type: 'RETRY' })} size="lg">{'\uD83D\uDD04'} Play Again</Button>
        <Button onClick={() => dispatch({ type: 'GO_HOME' })} variant="secondary" size="lg">{'\uD83C\uDFE0'} Map</Button>
      </div>
    </div>
  );
}

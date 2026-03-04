import type { Problem } from '../../types';

interface ProblemDisplayProps { problem: Problem; }

export function ProblemDisplay({ problem }: ProblemDisplayProps) {
  const sym = problem.operation === 'multiply' ? '\u00D7' : '\u00F7';
  return (
    <div className="flex items-center justify-center gap-4 animate-popIn">
      <span className="text-6xl font-black font-game text-white drop-shadow-lg">{problem.operandA}</span>
      <span className="text-5xl font-bold text-yellow-300">{sym}</span>
      <span className="text-6xl font-black font-game text-white drop-shadow-lg">{problem.operandB}</span>
      <span className="text-5xl font-bold text-white/80" style={{ filter: 'drop-shadow(0 0 8px rgba(255,255,255,0.3))' }}>=</span>
      <span className="text-6xl font-black font-game text-yellow-400 animate-pulse" style={{ filter: 'drop-shadow(0 0 12px rgba(250,204,21,0.8))' }}>?</span>
    </div>
  );
}

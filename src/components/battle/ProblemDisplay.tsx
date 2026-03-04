import type { Problem } from '../../types';

interface ProblemDisplayProps { problem: Problem; }

export function ProblemDisplay({ problem }: ProblemDisplayProps) {
  const sym = problem.operation === 'multiply' ? '\u00D7' : '\u00F7';
  return (
    <div className="flex items-center justify-center gap-4 animate-popIn">
      <span className="text-5xl font-black text-white drop-shadow-lg">{problem.operandA}</span>
      <span className="text-4xl font-bold text-yellow-300">{sym}</span>
      <span className="text-5xl font-black text-white drop-shadow-lg">{problem.operandB}</span>
      <span className="text-4xl font-bold text-white/60">=</span>
      <span className="text-5xl font-black text-yellow-400 animate-pulse">?</span>
    </div>
  );
}

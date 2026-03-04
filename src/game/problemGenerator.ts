import type { Problem, AnswerChoice, Dungeon } from '../types';

export function generateProblem(dungeon: Dungeon): Problem {
  const operand = dungeon.operands[Math.floor(Math.random() * dungeon.operands.length)];
  const a = Math.floor(Math.random() * 12) + 1;
  const answer = a * operand;

  return {
    operandA: a,
    operandB: operand,
    operation: 'multiply',
    answer,
    displayFormat: 'standard',
    missingValue: answer,
  };
}

export function generateChoices(problem: Problem, _dungeon: Dungeon): AnswerChoice[] {
  const correct = problem.answer;
  const operand = problem.operandB;
  const used = new Set<number>([correct]);
  const distractors: number[] = [];

  const neighborDeltas = [-2, -1, 1, 2];
  for (const d of neighborDeltas) {
    const candidate = (problem.operandA + d) * operand;
    if (candidate > 0 && !used.has(candidate)) {
      used.add(candidate);
      distractors.push(candidate);
    }
    if (distractors.length >= 3) break;
  }

  const answerDeltas = [5, -5, 10, -10, 2, -2];
  for (const d of answerDeltas) {
    const candidate = correct + d;
    if (candidate > 0 && !used.has(candidate) && distractors.length < 3) {
      used.add(candidate);
      distractors.push(candidate);
    }
  }

  const choices: AnswerChoice[] = [
    { value: correct, isCorrect: true },
    ...distractors.slice(0, 3).map(v => ({ value: v, isCorrect: false })),
  ];

  for (let i = choices.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [choices[i], choices[j]] = [choices[j], choices[i]];
  }

  return choices;
}

export function formatProblem(p: Problem): { left: string; right: string; symbol: string } {
  const sym = p.operation === 'multiply' ? '\u00D7' : '\u00F7';
  return { left: String(p.operandA), symbol: sym, right: String(p.operandB) };
}

import { useState } from 'react';
import type { AnswerChoice } from '../../types';

interface AnswerChoicesProps {
  choices: AnswerChoice[];
  onAnswer: (value: number) => void;
  disabled: boolean;
  lastAnswerCorrect: boolean | null;
  lastAnswerValue: number | null;
}

export function AnswerChoices({ choices, onAnswer, disabled, lastAnswerCorrect }: AnswerChoicesProps) {
  const [selected, setSelected] = useState<number | null>(null);

  function handleClick(choice: AnswerChoice) {
    if (disabled) return;
    setSelected(choice.value);
    onAnswer(choice.value);
    setTimeout(() => setSelected(null), 800);
  }

  function getButtonStyle(choice: AnswerChoice): string {
    const base = 'w-full py-5 text-3xl font-black rounded-3xl transition-all duration-200 active:scale-95 touch-manipulation border-2 select-none';
    if (selected === choice.value) {
      if (lastAnswerCorrect) return `${base} bg-gradient-to-br from-green-400 to-emerald-400 border-green-300 text-white scale-105`;
      return `${base} bg-gradient-to-br from-red-400 to-rose-500 border-red-300 text-white animate-shake`;
    }
    if (disabled && choice.isCorrect && lastAnswerCorrect === false) {
      return `${base} bg-gradient-to-br from-green-400/40 to-emerald-400/40 border-green-400 text-white`;
    }
    return `${base} bg-gradient-to-br from-indigo-500/30 to-purple-500/30 border-indigo-300/40 text-white hover:from-indigo-500/50 hover:to-purple-500/50 hover:border-indigo-300/60`;
  }

  return (
    <div className="grid grid-cols-2 gap-3 w-full">
      {choices.map((choice) => (
        <button key={choice.value} onClick={() => handleClick(choice)} disabled={disabled} className={getButtonStyle(choice)}>
          {choice.value}
        </button>
      ))}
    </div>
  );
}

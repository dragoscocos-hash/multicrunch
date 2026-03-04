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

  const pastelGradients = [
    'from-sky-400/40 to-cyan-400/40 border-sky-300/50',
    'from-pink-400/40 to-rose-400/40 border-pink-300/50',
    'from-amber-400/40 to-yellow-400/40 border-amber-300/50',
    'from-violet-400/40 to-purple-400/40 border-violet-300/50',
  ];

  function getButtonStyle(choice: AnswerChoice, index: number): string {
    const base = 'w-full min-h-[80px] py-4 text-3xl font-black rounded-full transition-all duration-200 active:scale-95 touch-manipulation border-2 select-none font-game hover:-translate-y-0.5 hover:shadow-lg';
    if (selected === choice.value) {
      if (lastAnswerCorrect) return `${base} bg-gradient-to-br from-green-400 to-emerald-400 border-green-300 text-white scale-105 animate-correctBurst`;
      return `${base} bg-gradient-to-br from-red-400 to-rose-500 border-red-300 text-white animate-shake brightness-75`;
    }
    if (disabled && choice.isCorrect && lastAnswerCorrect === false) {
      return `${base} bg-gradient-to-br from-green-400 to-emerald-500 border-green-300 text-white animate-correctFlash`;
    }
    return `${base} bg-gradient-to-br ${pastelGradients[index % 4]} text-white`;
  }

  return (
    <div className="grid grid-cols-2 gap-3 w-full">
      {choices.map((choice, index) => (
        <button key={choice.value} onClick={() => handleClick(choice)} disabled={disabled} className={getButtonStyle(choice, index)}>
          {choice.value}
        </button>
      ))}
    </div>
  );
}

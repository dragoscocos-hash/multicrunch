import { useState, useEffect } from 'react';

interface TypedAnswerProps {
  onAnswer: (value: number) => void;
  disabled: boolean;
  lastAnswerCorrect: boolean | null;
  correctAnswer: number;
}

const KEYS = [
  '1', '2', '3',
  '4', '5', '6',
  '7', '8', '9',
  'backspace', '0', 'submit',
] as const;

export function TypedAnswer({ onAnswer, disabled, lastAnswerCorrect, correctAnswer }: TypedAnswerProps) {
  const [input, setInput] = useState('');

  // Auto-clear when a new problem arrives (correctAnswer changes)
  useEffect(() => {
    setInput('');
  }, [correctAnswer]);

  function handleKey(key: typeof KEYS[number]) {
    if (disabled) return;

    if (key === 'backspace') {
      setInput((prev) => prev.slice(0, -1));
      return;
    }

    if (key === 'submit') {
      if (input === '') return;
      onAnswer(parseInt(input, 10));
      setInput('');
      return;
    }

    // Max 4 digits
    if (input.length >= 4) return;
    setInput((prev) => prev + key);
  }

  function getKeyStyle(key: typeof KEYS[number]): string {
    const base = 'min-h-[56px] text-2xl font-bold rounded-xl transition-all duration-150 active:scale-[0.92] active:shadow-none touch-manipulation border-2 select-none font-game';

    if (key === 'submit') {
      return `${base} bg-gradient-to-b from-emerald-500 to-emerald-700 border-t-emerald-300 border-b-emerald-900 border-l-emerald-500 border-r-emerald-600 text-white shadow-md active:border-t-emerald-600`;
    }
    if (key === 'backspace') {
      return `${base} bg-gradient-to-b from-orange-500 to-orange-700 border-t-orange-300 border-b-orange-900 border-l-orange-500 border-r-orange-600 text-white shadow-md active:border-t-orange-600`;
    }
    return `${base} bg-gradient-to-b from-slate-600 to-slate-800 border-t-slate-400 border-b-slate-900 border-l-slate-600 border-r-slate-700 text-white shadow-md active:border-t-slate-600`;
  }

  function getKeyLabel(key: typeof KEYS[number]): string {
    if (key === 'backspace') return '\u232B';
    if (key === 'submit') return '\u2713';
    return key;
  }

  return (
    <div className="flex flex-col gap-3 w-full">
      {/* Display area */}
      <div className={`flex flex-col items-center justify-center min-h-[4rem] bg-black/30 rounded-2xl border py-3 ${input ? 'shadow-[0_0_15px_rgba(250,204,21,0.3)] border-yellow-500/30' : 'border-white/10'}`}>
        <div className="text-5xl font-black text-white tracking-widest font-game">
          {input || '?'}
        </div>
        {lastAnswerCorrect === false && disabled && (
          <div className="bg-white text-emerald-600 font-black text-3xl mt-2 animate-correctFlash rounded-2xl px-6 py-2 border-4 border-emerald-400 shadow-lg">
            {correctAnswer}
          </div>
        )}
        {lastAnswerCorrect === true && disabled && (
          <div className="text-green-400 text-2xl font-black mt-1 animate-popIn">
            {'\u2713'}
          </div>
        )}
      </div>

      {/* 4x3 numeric keypad */}
      <div className="grid grid-cols-3 gap-2">
        {KEYS.map((key) => (
          <button
            key={key}
            onClick={() => handleKey(key)}
            disabled={disabled}
            className={getKeyStyle(key)}
          >
            {getKeyLabel(key)}
          </button>
        ))}
      </div>
    </div>
  );
}

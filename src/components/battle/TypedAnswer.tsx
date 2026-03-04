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
    const base = 'min-h-14 text-2xl font-bold rounded-2xl transition-all duration-150 active:scale-95 touch-manipulation border select-none';

    if (key === 'submit') {
      return `${base} bg-gradient-to-b from-green-500/50 to-emerald-500/50 border-green-400/40 text-white`;
    }
    if (key === 'backspace') {
      return `${base} bg-gradient-to-b from-orange-500/30 to-amber-500/30 border-orange-400/30 text-white`;
    }
    return `${base} bg-gradient-to-b from-sky-500/30 to-indigo-500/30 border-indigo-300/30 text-white`;
  }

  function getKeyLabel(key: typeof KEYS[number]): string {
    if (key === 'backspace') return '\u232B';
    if (key === 'submit') return '\u2713';
    return key;
  }

  return (
    <div className="flex flex-col gap-3 w-full">
      {/* Display area */}
      <div className="flex flex-col items-center justify-center min-h-[4rem] bg-black/30 rounded-2xl border border-white/10 py-3">
        <div className="text-5xl font-black text-white tracking-widest">
          {input || '?'}
        </div>
        {lastAnswerCorrect === false && disabled && (
          <div className="text-green-400 font-black text-2xl mt-2 animate-correctFlash rounded-xl px-4 py-1">
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

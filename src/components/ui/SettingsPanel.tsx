import { useState } from 'react';
import { useGame } from '../../state/gameState';
import type { Difficulty, AnswerMode } from '../../types';

const TABLES = [2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12];

const DIFFICULTIES: { label: string; value: Difficulty; color: string; selectedColor: string }[] = [
  { label: 'Easy', value: 1, color: 'bg-white/10 text-white/40', selectedColor: 'bg-green-500 text-white shadow-lg shadow-green-500/30' },
  { label: 'Medium', value: 2, color: 'bg-white/10 text-white/40', selectedColor: 'bg-yellow-500 text-white shadow-lg shadow-yellow-500/30' },
  { label: 'Hard', value: 3, color: 'bg-white/10 text-white/40', selectedColor: 'bg-orange-500 text-white shadow-lg shadow-orange-500/30' },
  { label: 'Beast', value: 4, color: 'bg-white/10 text-white/40', selectedColor: 'bg-red-500 text-white shadow-lg shadow-red-500/30' },
];

const ANSWER_MODES: { label: string; value: AnswerMode }[] = [
  { label: 'Multiple Choice', value: 'multiple_choice' },
  { label: 'Type Answer', value: 'typed' },
];

export function SettingsPanel() {
  const { state, dispatch } = useGame();
  const { settings } = state;
  const [expanded, setExpanded] = useState(true);

  function toggleTable(n: number) {
    const isSelected = settings.selectedTables.includes(n);
    if (isSelected && settings.selectedTables.length <= 1) return;
    const updated = isSelected
      ? settings.selectedTables.filter(t => t !== n)
      : [...settings.selectedTables, n];
    dispatch({ type: 'UPDATE_SETTINGS', settings: { selectedTables: updated } });
  }

  function setDifficulty(d: Difficulty) {
    dispatch({ type: 'UPDATE_SETTINGS', settings: { difficulty: d } });
  }

  function setAnswerMode(m: AnswerMode) {
    dispatch({ type: 'UPDATE_SETTINGS', settings: { answerMode: m } });
  }

  return (
    <div className="bg-white/5 rounded-2xl border border-white/10 overflow-hidden">
      <button
        onClick={() => setExpanded(!expanded)}
        className="w-full flex items-center justify-between p-3 hover:bg-white/5 transition-colors"
      >
        <div className="flex items-center gap-2">
          <span className="text-xl">{'\u2699\uFE0F'}</span>
          <span className="text-white font-bold text-sm">Settings</span>
        </div>
        <span className={`text-white/50 text-sm transition-transform ${expanded ? 'rotate-180' : ''}`}>
          {'\u25BC'}
        </span>
      </button>

      {expanded && (
        <div className="px-3 pb-3 flex flex-col gap-4">
          {/* Times Tables */}
          <div>
            <div className="text-white/60 text-xs font-bold uppercase tracking-wider mb-2">
              Times Tables
            </div>
            <div className="flex flex-wrap gap-2">
              {TABLES.map(n => {
                const isSelected = settings.selectedTables.includes(n);
                return (
                  <button
                    key={n}
                    onClick={() => toggleTable(n)}
                    className={`
                      w-11 h-11 rounded-xl font-bold text-sm transition-all active:scale-95
                      ${isSelected
                        ? 'bg-gradient-to-br from-yellow-400 via-orange-400 to-pink-500 text-white shadow-lg shadow-orange-500/30'
                        : 'bg-white/10 text-white/40 hover:bg-white/15'}
                    `}
                  >
                    {n}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Difficulty */}
          <div>
            <div className="text-white/60 text-xs font-bold uppercase tracking-wider mb-2">
              Difficulty
            </div>
            <div className="flex gap-2">
              {DIFFICULTIES.map(d => (
                <button
                  key={d.value}
                  onClick={() => setDifficulty(d.value)}
                  className={`
                    flex-1 py-2.5 rounded-full font-bold text-sm transition-all active:scale-95
                    ${settings.difficulty === d.value ? d.selectedColor : d.color}
                  `}
                >
                  {d.label}
                </button>
              ))}
            </div>
          </div>

          {/* Answer Mode */}
          <div>
            <div className="text-white/60 text-xs font-bold uppercase tracking-wider mb-2">
              Answer Mode
            </div>
            <div className="flex gap-2">
              {ANSWER_MODES.map(m => (
                <button
                  key={m.value}
                  onClick={() => setAnswerMode(m.value)}
                  className={`
                    flex-1 py-2.5 rounded-full font-bold text-sm transition-all active:scale-95
                    ${settings.answerMode === m.value
                      ? 'bg-gradient-to-r from-purple-500 to-pink-500 text-white shadow-lg shadow-purple-500/30'
                      : 'bg-white/10 text-white/40 hover:bg-white/15'}
                  `}
                >
                  {m.label}
                </button>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

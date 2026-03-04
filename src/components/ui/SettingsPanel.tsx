import { useGame } from '../../state/gameState';
import type { Difficulty, AnswerMode } from '../../types';

const TABLES = [2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12];
const AVAILABLE = [2, 4, 5, 10];

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

  function toggleTable(n: number) {
    if (!AVAILABLE.includes(n)) return;
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
    <div className="bg-white/5 backdrop-blur-sm rounded-2xl p-4 relative z-20">
      <div className="flex flex-col gap-4">
        {/* Times Tables */}
        <div>
          <div className="text-white/40 text-xs font-bold uppercase tracking-wider mb-2">
            Times Tables
          </div>
          <div className="flex flex-wrap gap-2">
            {TABLES.map(n => {
              const isAvailable = AVAILABLE.includes(n);
              const isSelected = settings.selectedTables.includes(n);
              return (
                <button
                  key={n}
                  onClick={() => toggleTable(n)}
                  className={`
                    w-11 h-11 rounded-xl font-bold text-sm transition-all active:scale-95
                    ${!isAvailable
                      ? 'bg-white/5 text-white/20 cursor-not-allowed'
                      : isSelected
                        ? 'bg-gradient-to-br from-yellow-400 via-orange-400 to-pink-500 text-white shadow-lg shadow-orange-500/30'
                        : 'bg-white/10 text-white/50 hover:bg-white/15'}
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
          <div className="text-white/40 text-xs font-bold uppercase tracking-wider mb-2">
            Difficulty
          </div>
          <div className="bg-black/20 rounded-full p-1 flex gap-1">
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
          <div className="text-white/40 text-xs font-bold uppercase tracking-wider mb-2">
            Answer Mode
          </div>
          <div className="bg-black/20 rounded-full p-1 flex gap-1">
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
    </div>
  );
}

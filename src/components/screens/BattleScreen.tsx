import { useEffect, useState } from 'react';
import { useGame } from '../../state/gameState';
import { MonsterSprite } from '../battle/MonsterSprite';
import { ProblemDisplay } from '../battle/ProblemDisplay';
import { AnswerChoices } from '../battle/AnswerChoices';
import { TypedAnswer } from '../battle/TypedAnswer';
import { HeartsBar } from '../battle/HeartsBar';
import { Button } from '../ui/Button';

export function BattleScreen() {
  const { state, dispatch } = useGame();
  const b = state.battle!;
  const monster = b.monsters[b.currentMonsterIndex];
  const [monsterHit, setMonsterHit] = useState(false);
  const [defeated, setDefeated] = useState(false);

  useEffect(() => {
    if (b.phase === 'correct_feedback') {
      setMonsterHit(true);
      const t = setTimeout(() => {
        setMonsterHit(false);
        dispatch({ type: 'ADVANCE_AFTER_FEEDBACK' });
      }, 800);
      return () => clearTimeout(t);
    }
    if (b.phase === 'wrong_feedback') {
      const t = setTimeout(() => {
        dispatch({ type: 'ADVANCE_AFTER_FEEDBACK' });
      }, 1200);
      return () => clearTimeout(t);
    }
    if (b.phase === 'monster_defeated') {
      setMonsterHit(true);
      setDefeated(true);
    }
  }, [b.phase]);

  useEffect(() => {
    setMonsterHit(false);
    setDefeated(false);
  }, [b.currentMonsterIndex]);

  const totalMonsters = b.monsters.length;
  const progress = b.currentMonsterIndex + 1;

  if (b.phase === 'boss_intro') {
    return (
      <div className={`min-h-screen bg-gradient-to-b ${b.dungeon.theme.bg} flex flex-col items-center justify-center gap-8 p-6`}>
        <div className="text-red-400 text-2xl font-black tracking-widest animate-pulse">{'\u26A0'} WARNING {'\u26A0'}</div>
        <div className="text-8xl animate-float">{monster.emoji}</div>
        <div className="text-center">
          <div className="text-white text-3xl font-black">{monster.name}</div>
          <div className="text-red-300 text-lg mt-2">BOSS — {monster.maxHP} HP</div>
        </div>
        <div className="text-white/60 text-base">Answer {monster.maxHP} questions to defeat!</div>
        <Button onClick={() => dispatch({ type: 'ADVANCE_AFTER_FEEDBACK' })} size="lg">{'\u2694\uFE0F'} FIGHT!</Button>
      </div>
    );
  }

  if (b.phase === 'game_over') {
    const total = b.correctCount + b.wrongCount;
    const acc = total > 0 ? Math.round((b.correctCount / total) * 100) : 0;
    return (
      <div className="min-h-screen bg-gradient-to-b from-gray-900 to-black flex flex-col items-center justify-center gap-6 p-6">
        <div className="text-7xl">{'\u{1F480}'}</div>
        <div className="text-white text-3xl font-black">Game Over!</div>
        <div className="text-white/60 text-center">
          <div>Correct: {b.correctCount} | Wrong: {b.wrongCount}</div>
          <div>Accuracy: {acc}%</div>
        </div>
        <div className="flex gap-4">
          <Button onClick={() => dispatch({ type: 'RETRY' })} size="lg">{'\uD83D\uDD04'} Retry</Button>
          <Button onClick={() => dispatch({ type: 'GO_HOME' })} variant="secondary" size="lg">{'\uD83C\uDFE0'} Home</Button>
        </div>
      </div>
    );
  }

  const isAnsweringDisabled = b.phase !== 'answering';
  const feedbackEmoji = b.lastAnswerCorrect === true ? '\u2694\uFE0F HIT!' : b.lastAnswerCorrect === false ? monster.attackPhrase : null;
  const feedbackColor = b.lastAnswerCorrect === true ? 'text-green-400' : 'text-red-400';

  return (
    <div className={`min-h-screen bg-gradient-to-b ${b.dungeon.theme.bg} flex flex-col p-4 gap-4`}>
      <div className="flex items-center justify-between pt-2">
        <div>
          <div className={`font-bold text-sm ${b.dungeon.theme.accent}`}>{b.dungeon.theme.icon} {b.dungeon.name}</div>
          <div className="text-white/50 text-xs">Monster {progress}/{totalMonsters}</div>
        </div>
        <HeartsBar hearts={b.playerHearts} />
      </div>

      <div className="w-full h-1.5 bg-white/10 rounded-full overflow-hidden">
        <div
          className="h-full bg-yellow-400 rounded-full transition-all duration-500"
          style={{ width: `${(b.currentMonsterIndex / b.monsters.length) * 100}%` }}
        />
      </div>

      <div className="flex-1 flex flex-col items-center justify-center gap-4 min-h-0">
        <MonsterSprite monster={monster} isHit={monsterHit} isDefeated={defeated} />

        {feedbackEmoji && (
          <div className={`text-2xl font-black ${feedbackColor} animate-popIn`}>{feedbackEmoji}</div>
        )}

        {b.phase === 'monster_defeated' && (
          <div className="animate-slideUp mt-4 flex flex-col items-center gap-4">
            <div className="text-green-400 font-black text-xl">{'\u2705'} Defeated!</div>
            <Button onClick={() => dispatch({ type: 'ADVANCE_AFTER_FEEDBACK' })} size="lg">
              {b.currentMonsterIndex + 1 >= b.monsters.length ? '\uD83C\uDFC6 Victory!' : '\u27A1\uFE0F Next!'}
            </Button>
          </div>
        )}
      </div>

      {b.phase !== 'monster_defeated' && (
        <div className="flex flex-col gap-4 pb-4">
          <div className="bg-black/30 rounded-3xl p-5 border border-white/10">
            <ProblemDisplay problem={b.currentProblem} />
          </div>
          {b.answerMode === 'typed' ? (
            <TypedAnswer
              onAnswer={(value) => dispatch({ type: 'ANSWER', choiceValue: value })}
              disabled={isAnsweringDisabled}
              lastAnswerCorrect={b.lastAnswerCorrect}
              correctAnswer={b.currentProblem.answer}
            />
          ) : (
            <AnswerChoices
              choices={b.choices}
              onAnswer={(value) => dispatch({ type: 'ANSWER', choiceValue: value })}
              disabled={isAnsweringDisabled}
              lastAnswerCorrect={b.lastAnswerCorrect}
              lastAnswerValue={b.currentProblem.answer}
            />
          )}
        </div>
      )}
    </div>
  );
}

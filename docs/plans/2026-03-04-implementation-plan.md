# Settings, Animations, Typed Answers & Kid Theme — Implementation Plan

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** Add a home-screen settings panel (times tables, difficulty, answer mode), dramatic fight animations (sword slash + projectiles + screen effects), a typed-answer numeric keypad, and a colorful kid-friendly nature theme across all screens.

**Architecture:** Settings stored in `AppState` alongside player progress, persisted to localStorage. Battle animations use two new intermediate phases (`player_attacking`, `monster_attacking`) with a `BattleEffects` overlay component. Answer mode conditionally renders `AnswerChoices` or `TypedAnswer`. Theme is CSS gradients + a `Decorations` component rendering floating emoji with CSS keyframes.

**Tech Stack:** React 19, TypeScript, Tailwind CSS v3, Vite, pure CSS animations (no animation libraries).

---

## Task 1: Types & Settings State

**Files:**
- Modify: `src/types/index.ts`
- Modify: `src/state/gameState.tsx`

**Step 1: Add new types to `src/types/index.ts`**

Add after the existing `Difficulty` type:

```ts
export type AnswerMode = 'multiple_choice' | 'typed';

export interface GameSettings {
  selectedTables: number[];
  difficulty: Difficulty;
  answerMode: AnswerMode;
}
```

Update `BattleState.phase` to include animation phases:

```ts
phase: 'answering' | 'player_attacking' | 'monster_attacking' | 'correct_feedback' | 'wrong_feedback' | 'monster_defeated' | 'boss_intro' | 'victory' | 'game_over';
```

Add `answerMode` to `BattleState`:

```ts
answerMode: AnswerMode;
```

**Step 2: Update `src/state/gameState.tsx`**

Add `settings: GameSettings` to `AppState`.

Add `UPDATE_SETTINGS` action:
```ts
| { type: 'UPDATE_SETTINGS'; settings: Partial<GameSettings> }
```

Add `loadSettings()` and `saveSettings()` functions (localStorage key `multicrunch_settings`), default:
```ts
{ selectedTables: [2, 5, 10], difficulty: 1, answerMode: 'multiple_choice' }
```

Difficulty config map:
```ts
const DIFFICULTY_CONFIG: Record<number, { monsterCount: number; hearts: number }> = {
  1: { monsterCount: 5, hearts: 4 },
  2: { monsterCount: 7, hearts: 3 },
  3: { monsterCount: 9, hearts: 3 },
  4: { monsterCount: 12, hearts: 2 },
};
```

In `START_DUNGEON`: override `dungeon.operands` with `state.settings.selectedTables`, override `monsterCount` and `playerHearts` from `DIFFICULTY_CONFIG[state.settings.difficulty]`, set `battle.answerMode` from settings.

Add `player_attacking` and `monster_attacking` phases to `ANSWER` case:
- Correct → phase `'player_attacking'` (instead of direct `correct_feedback`/`monster_defeated`)
- Wrong → phase `'monster_attacking'` (instead of direct `wrong_feedback`/`game_over`)

Add handling in `ADVANCE_AFTER_FEEDBACK`:
- `player_attacking` → determine if monster is defeated → `monster_defeated` or `correct_feedback`
- `monster_attacking` → determine if hearts=0 → `game_over` or `wrong_feedback`

**Step 3: Commit**
```bash
git add src/types/index.ts src/state/gameState.tsx
git commit -m "feat: add GameSettings type, settings state, animation phases"
```

---

## Task 2: Settings Panel Component

**Files:**
- Create: `src/components/ui/SettingsPanel.tsx`
- Modify: `src/components/screens/HomeScreen.tsx`

**Step 1: Create `src/components/ui/SettingsPanel.tsx`**

A collapsible card with three sections:

1. **Times Tables**: Grid of toggle buttons for 2–12. Selected = bright gradient bg. Deselect prevented when only 1 left.
2. **Difficulty**: 4 pill buttons (Easy/Medium/Hard/Beast) mapped to difficulty 1–4.
3. **Answer Mode**: Two-button toggle (Multiple Choice / Type Answer).

All changes call `dispatch({ type: 'UPDATE_SETTINGS', settings: { ... } })`.

Expand/collapse with a header button showing a gear icon.

Use bright kid-friendly colors: pink/orange/yellow gradients on selected states.

**Step 2: Add SettingsPanel to HomeScreen**

Import and render `<SettingsPanel />` between the player info card and the "Choose Dungeon" section.

**Step 3: Commit**
```bash
git add src/components/ui/SettingsPanel.tsx src/components/screens/HomeScreen.tsx
git commit -m "feat: add settings panel with tables, difficulty, answer mode"
```

---

## Task 3: Typed Answer Input Component

**Files:**
- Create: `src/components/battle/TypedAnswer.tsx`
- Modify: `src/components/screens/BattleScreen.tsx`

**Step 1: Create `src/components/battle/TypedAnswer.tsx`**

Props: `onAnswer: (value: number) => void`, `disabled: boolean`, `lastAnswerCorrect: boolean | null`, `correctAnswer: number`.

UI:
- Large display area showing typed digits (or "?" when empty). White text, large font.
- 4×3 numeric keypad grid: [1][2][3] / [4][5][6] / [7][8][9] / [⌫][0][✓]
- Buttons: big rounded, gradient bg (sky blue → indigo), min-h-14, text-2xl.
- Submit (✓) button: green gradient. Backspace (⌫): orange.
- On submit: if input is empty, ignore. Otherwise call `onAnswer(parseInt(input))`, clear input.
- When `lastAnswerCorrect === false` and disabled: show correct answer in green below the display.
- Max 4 digits allowed.

**Step 2: Wire up in BattleScreen**

In `BattleScreen.tsx`, read `b.answerMode`. If `'typed'`, render `<TypedAnswer>` instead of `<AnswerChoices>`.

**Step 3: Commit**
```bash
git add src/components/battle/TypedAnswer.tsx src/components/screens/BattleScreen.tsx
git commit -m "feat: add typed answer keypad component and wire to battle"
```

---

## Task 4: Battle Effects & Fight Animations

**Files:**
- Create: `src/components/battle/BattleEffects.tsx`
- Modify: `src/index.css` (add keyframes)
- Modify: `src/components/screens/BattleScreen.tsx` (wire effects)
- Modify: `src/components/battle/MonsterSprite.tsx` (slash overlay)

**Step 1: Add CSS keyframes to `src/index.css`**

```css
@keyframes swordFly {
  0% { transform: translateY(0) scale(1); opacity: 1; }
  80% { transform: translateY(-180px) scale(1.3); opacity: 1; }
  100% { transform: translateY(-200px) scale(0.8); opacity: 0; }
}
@keyframes impactFlash {
  0% { opacity: 0; transform: scale(0.5); }
  30% { opacity: 1; transform: scale(1.2); }
  100% { opacity: 0; transform: scale(1.5); }
}
@keyframes slashMark {
  0% { opacity: 0; transform: rotate(-45deg) scaleX(0); }
  30% { opacity: 1; transform: rotate(-45deg) scaleX(1); }
  100% { opacity: 0; transform: rotate(-45deg) scaleX(1); }
}
@keyframes monsterLunge {
  0%, 100% { transform: translateY(0); }
  30% { transform: translateY(-25px) scale(1.15); }
}
@keyframes damageProjectile {
  0% { transform: translateY(0) scale(1.2); opacity: 1; }
  100% { transform: translateY(200px) scale(0.5); opacity: 0; }
}
@keyframes redVignette {
  0% { box-shadow: inset 0 0 0 0 rgba(255,0,0,0); }
  40% { box-shadow: inset 0 0 80px 20px rgba(255,0,0,0.4); }
  100% { box-shadow: inset 0 0 0 0 rgba(255,0,0,0); }
}
@keyframes screenShake {
  0%, 100% { transform: translate(0,0); }
  10% { transform: translate(-5px, 3px); }
  20% { transform: translate(5px, -3px); }
  30% { transform: translate(-4px, -2px); }
  40% { transform: translate(4px, 2px); }
  50% { transform: translate(-3px, 1px); }
}
@keyframes damageNumber {
  0% { transform: translateY(0) scale(0.5); opacity: 0; }
  30% { transform: translateY(-10px) scale(1.2); opacity: 1; }
  100% { transform: translateY(-40px) scale(1); opacity: 0; }
}
@keyframes heartPulse {
  0%, 100% { transform: scale(1); filter: brightness(1); }
  50% { transform: scale(1.3); filter: brightness(1.5) hue-rotate(-20deg); }
}
```

Plus utility classes:
```css
.animate-swordFly { animation: swordFly 0.5s ease-out forwards; }
.animate-impactFlash { animation: impactFlash 0.35s ease-out forwards; }
.animate-slashMark { animation: slashMark 0.4s ease-out forwards; }
.animate-monsterLunge { animation: monsterLunge 0.3s ease-out; }
.animate-damageProjectile { animation: damageProjectile 0.5s ease-in forwards; }
.animate-redVignette { animation: redVignette 0.5s ease-out; }
.animate-screenShake { animation: screenShake 0.4s ease-out; }
.animate-damageNumber { animation: damageNumber 0.6s ease-out forwards; }
.animate-heartPulse { animation: heartPulse 0.4s ease-out; }
```

**Step 2: Create `src/components/battle/BattleEffects.tsx`**

Props: `phase: string`, `monsterEmoji: string`.

Renders an absolute-positioned overlay container (`pointer-events-none inset-0`):

- When `phase === 'player_attacking'`:
  - Sword emoji (`⚔️`) at bottom center, applies `animate-swordFly`
  - After 300ms delay: impact flash (white circle) in center, `animate-impactFlash`
  - Slash marks: two lines using pseudo-elements, `animate-slashMark`
  - Damage number: "-1" text, `animate-damageNumber`

- When `phase === 'monster_attacking'`:
  - Monster emoji projectile from center downward, `animate-damageProjectile`
  - Red vignette overlay on full screen, `animate-redVignette`
  - Screen shake on parent, `animate-screenShake`

Uses `useState` + `useEffect` to sequence staggered elements.

**Step 3: Wire into BattleScreen**

Import `BattleEffects`. Render inside the battle container with `position: relative` + `overflow: hidden`.

Update phase timing:
- `player_attacking` → 700ms → `ADVANCE_AFTER_FEEDBACK`
- `monster_attacking` → 700ms → `ADVANCE_AFTER_FEEDBACK`

Update `HeartsBar` to pulse when `phase === 'monster_attacking'`.

**Step 4: Update MonsterSprite**

Add `isLunging` prop. When true, apply `animate-monsterLunge` class.
Set `isLunging = true` when `phase === 'monster_attacking'`.

**Step 5: Commit**
```bash
git add src/index.css src/components/battle/BattleEffects.tsx src/components/screens/BattleScreen.tsx src/components/battle/MonsterSprite.tsx src/components/battle/HeartsBar.tsx
git commit -m "feat: add dramatic fight animations with slash, projectiles, screen effects"
```

---

## Task 5: Kid-Friendly Theme & Decorations

**Files:**
- Create: `src/components/ui/Decorations.tsx`
- Modify: `src/index.css` (decoration keyframes + theme colors)
- Modify: `src/components/screens/HomeScreen.tsx`
- Modify: `src/components/screens/BattleScreen.tsx`
- Modify: `src/components/screens/ResultsScreen.tsx`
- Modify: `src/components/ui/Button.tsx`
- Modify: `src/components/battle/AnswerChoices.tsx`
- Modify: `src/game/dungeons.ts` (brighter themes)

**Step 1: Add decoration keyframes to `src/index.css`**

```css
@keyframes drift {
  0% { transform: translateX(0) translateY(0); }
  25% { transform: translateX(15px) translateY(-8px); }
  50% { transform: translateX(-10px) translateY(5px); }
  75% { transform: translateX(20px) translateY(-3px); }
  100% { transform: translateX(0) translateY(0); }
}
@keyframes flutter {
  0%, 100% { transform: rotate(0deg) scale(1); }
  25% { transform: rotate(8deg) scale(1.05); }
  50% { transform: rotate(-5deg) scale(0.95); }
  75% { transform: rotate(6deg) scale(1.02); }
}
@keyframes sway {
  0%, 100% { transform: rotate(0deg); }
  50% { transform: rotate(8deg); }
}
@keyframes sparkle {
  0%, 100% { opacity: 1; transform: scale(1); }
  50% { opacity: 0.5; transform: scale(0.8); }
}
```

Plus utility classes and update body background to warm bright gradient.

**Step 2: Create `src/components/ui/Decorations.tsx`**

Props: `scene: 'home' | 'battle' | 'results'`

Decoration config arrays per scene. Each entry: `{ emoji, top, left, size, animation, delay, duration }`.

Home: 🌸🌺🌻🌷 flowers at edges, 🦋🐦 butterflies/birds drifting, 🌿🍃 leaves, ☀️ top-right.
Battle: 🌱🌿 grass bottom, small 🌸 scattered, 🦋 drifting.
Results: 🎉🌈✨🌸 celebration particles.

Render as `position: absolute` emojis inside a `pointer-events-none inset-0 overflow-hidden` container. Each gets randomized animation delay.

**Step 3: Update body + dungeon themes to be bright**

In `src/index.css`: change `body { background: #1a0a2e }` → `body { background: linear-gradient(135deg, #e0f2fe, #f0e6ff, #fce7f3) }`.

In `src/game/dungeons.ts`: update each dungeon's `theme.bg` to brighter gradients:
- doubles-den: `from-emerald-400/80 via-green-300/70 to-teal-400/80`
- tower-of-tens: `from-sky-400/80 via-blue-300/70 to-cyan-400/80`
- fives-forest: `from-lime-400/80 via-green-300/70 to-emerald-400/80`
- quad-caverns: `from-violet-400/80 via-purple-300/70 to-fuchsia-400/80`

**Step 4: Update Button.tsx with kid-friendly gradients**

Primary: `bg-gradient-to-r from-yellow-400 via-orange-400 to-pink-400 text-white`
Secondary: `bg-gradient-to-r from-sky-400 to-indigo-400 text-white`
Rounder: `rounded-full`

**Step 5: Update AnswerChoices.tsx with colorful buttons**

Default state: `bg-gradient-to-br from-indigo-500/30 to-purple-500/30 border-indigo-300/40`
Correct: `bg-gradient-to-br from-green-400 to-emerald-400`
Wrong: `bg-gradient-to-br from-red-400 to-rose-500`

**Step 6: Add Decorations to all screens**

Import and render `<Decorations scene="home" />` etc. in each screen, positioned at the root with `relative overflow-hidden`.

**Step 7: Commit**
```bash
git add src/index.css src/components/ui/Decorations.tsx src/components/ui/Button.tsx src/components/battle/AnswerChoices.tsx src/components/screens/HomeScreen.tsx src/components/screens/BattleScreen.tsx src/components/screens/ResultsScreen.tsx src/game/dungeons.ts
git commit -m "feat: add kid-friendly colorful theme with nature decorations"
```

---

## Task 6: Build, Fix & Push

**Files:**
- All modified files

**Step 1: Run build**
```bash
npm run build
```

**Step 2: Fix any TypeScript errors**

Common issues: phase union type mismatches, missing imports, unused variables.

**Step 3: Run dev server and visually verify**
```bash
npm run dev
```

Check: Home screen settings work, battles use selected tables, fight animations play, typed answer works, decorations float on all screens.

**Step 4: Final commit and push**
```bash
git add -A
git commit -m "fix: resolve build errors and polish"
git push origin main
```

Vercel auto-deploys from main.

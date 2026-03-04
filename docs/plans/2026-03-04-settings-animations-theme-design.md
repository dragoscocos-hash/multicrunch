# MultiCrunch — Settings, Animations, Answer Modes & Kid-Friendly Theme

**Date:** 2026-03-04
**Status:** Approved

---

## 1. Settings Panel (Home Screen)

A collapsible card between the player info and dungeon list.

### Times Tables Picker
- Grid of toggle buttons for numbers **2–12**.
- Tap to select/deselect. At least one must be selected.
- Selected buttons glow yellow with a subtle bounce.

### Difficulty Selector
- 4 pill buttons: **Easy** (5 monsters, 4 hearts), **Medium** (7 monsters, 3 hearts), **Hard** (9 monsters, 3 hearts), **Beast** (12 monsters, 2 hearts).

### Answer Mode Toggle
- Two-button toggle: **"Multiple Choice"** vs **"Type Answer"**.
- Stored globally, applies to all dungeons.

### Persistence
- New `GameSettings` type: `{ selectedTables: number[], difficulty: Difficulty, answerMode: 'multiple_choice' | 'typed' }`.
- Saved to `localStorage` key `multicrunch_settings`.
- `START_DUNGEON` reads settings and overrides dungeon `operands`, `monsterCount`, and heart count.
- New `UPDATE_SETTINGS` action in reducer.

---

## 2. Fight Animations (Slash + Projectiles Combined)

### Player Attack (correct answer)
1. **Sword projectile**: ⚔️ emoji flies from bottom-center toward monster (0.4s `translateY` + slight scale-up).
2. **Impact flash**: White radial flash overlay on monster container (0.15s fade in/out).
3. **Slash marks**: Two diagonal CSS pseudo-element lines appear over the monster and fade (0.3s).
4. **Monster shake**: Existing `animate-shake` (0.5s).
5. **Damage number**: "-1" pops above monster in yellow with `animate-popIn`.

### Monster Attack (wrong answer)
1. **Monster lunge**: Quick `translateY(-20px)` then back (0.2s).
2. **Damage projectile**: Monster's emoji flies from monster toward bottom of screen (0.4s).
3. **Red vignette**: Screen edges flash red via a `box-shadow: inset` animation (0.3s).
4. **Hearts pulse**: Hearts bar briefly scales up and turns red (0.3s).
5. **Screen shake**: Entire battle container shakes (0.3s).

### New Battle Phases
- `'player_attacking'` — plays sword animation, then transitions to `correct_feedback`.
- `'monster_attacking'` — plays monster attack, then transitions to `wrong_feedback`.
- These are ~600ms animation-only phases.

### Implementation
- All pure CSS `@keyframes` + absolute-positioned elements.
- New component `BattleEffects.tsx` — renders projectiles and overlays based on phase.
- New keyframes: `swordFly`, `impactFlash`, `slashMark`, `monsterLunge`, `damageProjectile`, `redVignette`, `screenShake`, `damageNumber`.

---

## 3. Typed Answer Input

New `TypedAnswer.tsx` component, used when `answerMode === 'typed'`:

- Large centered input field showing typed digits (read-only, styled like a scoreboard).
- Custom numeric keypad: 3×4 grid (1–9, 0, backspace ⌫, submit ✓).
- Big colorful buttons, child-friendly sizing (min 48px tap targets).
- On submit: dispatches `ANSWER` with typed value.
- Wrong answer briefly shows correct answer in green below.
- Auto-clears on next problem.

---

## 4. Kid-Friendly Whimsical Theme

### Overall Palette
- Replace the dark indigo/purple gradients with **warm, bright gradients**: sky blue → soft purple → pink sunset tones.
- Dungeon backgrounds get brighter, more saturated versions of their themes.
- Text shadows and glows in warm gold/orange.

### Floating Nature Decorations (CSS-only)
Absolute-positioned emoji elements that float/drift with CSS animations:

- **Home Screen**: 🌸🌺🌻🌷 tiny flowers along card edges, 🦋🐦 butterflies/birds floating across, 🌿🍃 vine/leaf decorations on section borders, ☀️ sun in top-right (or 🌙 moon based on time of day).
- **Battle Screen**: 🌱🌿 grass/vegetation along the bottom edge, small 🌸 flowers scattered in the background, 🦋 butterflies drifting slowly across.
- **Results Screen**: 🎉🌈✨ celebration particles, extra flowers blooming.

### Implementation
- New `Decorations.tsx` component — renders positioned emoji with drift/float animations.
- Props control which "scene" decoration set to use: `'home' | 'battle' | 'results'`.
- New keyframes: `drift` (slow horizontal float), `flutter` (small wing-flap wobble), `sway` (gentle rotation).
- ~10-15 decorative elements per screen, randomized positions, staggered animation delays.
- Lightweight: just emoji + CSS, no images.

### UI Polish
- Buttons get rounded-full or pill shapes with gradient fills (pink → orange → yellow).
- Cards get soft pastel borders and subtle backdrop blur.
- Dungeon cards get tiny flower corner accents.
- Star ratings become more sparkly (golden glow pulse).

---

## Files Changed

| File | Change |
|------|--------|
| `types/index.ts` | Add `GameSettings`, `AnswerMode` types, update `BattleState` phase union |
| `state/gameState.tsx` | Add `settings` to state, `UPDATE_SETTINGS` action, merge settings into `START_DUNGEON` |
| `components/screens/HomeScreen.tsx` | Add settings panel with tables picker, difficulty selector, answer mode toggle, decorations |
| `components/screens/BattleScreen.tsx` | Wire up `TypedAnswer` vs `AnswerChoices`, add `BattleEffects`, add animation phases, decorations |
| `components/screens/ResultsScreen.tsx` | Add celebration decorations, brighten colors |
| `components/battle/AnswerChoices.tsx` | Visual refresh (brighter colors, rounder buttons) |
| `components/battle/TypedAnswer.tsx` | **NEW** — numeric keypad input component |
| `components/battle/BattleEffects.tsx` | **NEW** — renders projectiles, slashes, flashes, vignettes |
| `components/battle/MonsterSprite.tsx` | Add slash mark overlay support, impact flash |
| `components/ui/Decorations.tsx` | **NEW** — floating flowers, butterflies, birds, sun/moon |
| `components/ui/Button.tsx` | Visual refresh (gradient fills, rounder) |
| `components/ui/SettingsPanel.tsx` | **NEW** — times tables picker, difficulty selector, answer mode toggle |
| `src/index.css` | New keyframes, brighter base styles, decoration animations |
| `game/problemGenerator.ts` | Accept custom operands array from settings |
| `game/monsters.ts` | Accept custom monster count from settings |

import { useMemo } from 'react';

interface DecorationsProps {
  scene: 'home' | 'battle' | 'results';
}

interface Decoration {
  emoji: string;
  className: string;
  delay: number;
}

function getHomeDecorations(): Decoration[] {
  return [
    { emoji: '\uD83C\uDF38', className: 'absolute top-[5%] left-[3%] text-2xl animate-flutter', delay: 0 },
    { emoji: '\uD83C\uDF3A', className: 'absolute top-[12%] right-[5%] text-xl animate-sway', delay: 0.5 },
    { emoji: '\uD83C\uDF3B', className: 'absolute top-[25%] left-[8%] text-lg animate-flutter', delay: 1.2 },
    { emoji: '\uD83C\uDF37', className: 'absolute bottom-[15%] right-[4%] text-xl animate-sway', delay: 0.8 },
    { emoji: '\uD83C\uDF38', className: 'absolute bottom-[30%] left-[5%] text-sm animate-flutter', delay: 1.5 },
    { emoji: '\uD83C\uDF3A', className: 'absolute bottom-[8%] left-[15%] text-lg animate-sway', delay: 2.0 },
    { emoji: '\uD83E\uDD8B', className: 'absolute top-[18%] left-[20%] text-xl animate-drift', delay: 0.3 },
    { emoji: '\uD83E\uDD8B', className: 'absolute bottom-[25%] right-[15%] text-lg animate-drift', delay: 2.5 },
    { emoji: '\uD83D\uDC26', className: 'absolute top-[8%] left-[45%] text-xl animate-drift', delay: 1.0 },
    { emoji: '\uD83C\uDF3F', className: 'absolute top-[3%] left-[85%] text-2xl animate-sway', delay: 0.7 },
    { emoji: '\uD83C\uDF43', className: 'absolute bottom-[5%] right-[30%] text-lg animate-flutter', delay: 1.8 },
    { emoji: '\u2600\uFE0F', className: 'absolute top-[2%] right-[2%] text-2xl animate-sparkle', delay: 0 },
  ];
}

function getBattleDecorations(): Decoration[] {
  return [
    { emoji: '\uD83C\uDF31', className: 'absolute bottom-[2%] left-[5%] text-lg animate-sway', delay: 0 },
    { emoji: '\uD83C\uDF3F', className: 'absolute bottom-[3%] left-[20%] text-xl animate-sway', delay: 0.5 },
    { emoji: '\uD83C\uDF31', className: 'absolute bottom-[2%] left-[40%] text-sm animate-sway', delay: 1.0 },
    { emoji: '\uD83C\uDF3F', className: 'absolute bottom-[3%] right-[25%] text-lg animate-sway', delay: 1.5 },
    { emoji: '\uD83C\uDF31', className: 'absolute bottom-[2%] right-[5%] text-xl animate-sway', delay: 2.0 },
    { emoji: '\uD83C\uDF38', className: 'absolute top-[10%] left-[3%] text-sm animate-flutter', delay: 0.8 },
    { emoji: '\uD83C\uDF38', className: 'absolute top-[5%] right-[8%] text-sm animate-flutter', delay: 1.3 },
    { emoji: '\uD83E\uDD8B', className: 'absolute top-[15%] right-[12%] text-lg animate-drift', delay: 0.3 },
  ];
}

function getResultsDecorations(): Decoration[] {
  return [
    { emoji: '\uD83C\uDF89', className: 'absolute top-[5%] left-[8%] text-2xl animate-flutter', delay: 0 },
    { emoji: '\uD83C\uDF08', className: 'absolute top-[3%] right-[10%] text-2xl animate-sway', delay: 0.5 },
    { emoji: '\u2728', className: 'absolute top-[15%] left-[15%] text-xl animate-sparkle', delay: 0.2 },
    { emoji: '\u2728', className: 'absolute top-[10%] right-[20%] text-lg animate-sparkle', delay: 1.0 },
    { emoji: '\u2728', className: 'absolute bottom-[20%] left-[10%] text-sm animate-sparkle', delay: 1.5 },
    { emoji: '\uD83C\uDF38', className: 'absolute bottom-[10%] right-[5%] text-xl animate-flutter', delay: 0.8 },
    { emoji: '\uD83C\uDF3A', className: 'absolute bottom-[15%] left-[5%] text-lg animate-sway', delay: 1.2 },
    { emoji: '\uD83C\uDF38', className: 'absolute top-[30%] right-[3%] text-sm animate-flutter', delay: 2.0 },
    { emoji: '\uD83E\uDD8B', className: 'absolute top-[20%] left-[50%] text-xl animate-drift', delay: 0.6 },
    { emoji: '\uD83C\uDF89', className: 'absolute bottom-[5%] right-[15%] text-lg animate-flutter', delay: 1.8 },
  ];
}

export function Decorations({ scene }: DecorationsProps) {
  const decorations = useMemo(() => {
    switch (scene) {
      case 'home': return getHomeDecorations();
      case 'battle': return getBattleDecorations();
      case 'results': return getResultsDecorations();
    }
  }, [scene]);

  return (
    <div className="pointer-events-none absolute inset-0 overflow-hidden z-10">
      {decorations.map((d, i) => (
        <span
          key={i}
          className={d.className}
          style={{ animationDelay: `${d.delay}s` }}
        >
          {d.emoji}
        </span>
      ))}
    </div>
  );
}

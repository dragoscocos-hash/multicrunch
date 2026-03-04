import { useMemo } from 'react';

interface DecorationsProps {
  scene: 'home' | 'battle' | 'results';
  dungeonId?: string;
}

interface Decoration {
  emoji: string;
  className: string;
  delay: number;
}

function getHomeDecorations(): Decoration[] {
  return [
    { emoji: '✨', className: 'absolute top-[5%] left-[3%] text-2xl animate-sparkle', delay: 0 },
    { emoji: '⭐', className: 'absolute top-[12%] right-[5%] text-xl animate-sparkle', delay: 0.5 },
    { emoji: '🌟', className: 'absolute top-[25%] left-[8%] text-lg animate-sparkle', delay: 1.2 },
    { emoji: '💫', className: 'absolute bottom-[15%] right-[4%] text-xl animate-drift', delay: 0.8 },
    { emoji: '✨', className: 'absolute bottom-[30%] left-[5%] text-sm animate-sparkle', delay: 1.5 },
    { emoji: '🌙', className: 'absolute bottom-[8%] left-[15%] text-lg animate-drift', delay: 2.0 },
    { emoji: '🦋', className: 'absolute top-[18%] left-[20%] text-xl animate-drift', delay: 0.3 },
    { emoji: '🦋', className: 'absolute bottom-[25%] right-[15%] text-lg animate-drift', delay: 2.5 },
    { emoji: '🐦', className: 'absolute top-[8%] left-[45%] text-xl animate-drift', delay: 1.0 },
    { emoji: '⭐', className: 'absolute top-[3%] left-[85%] text-2xl animate-sparkle', delay: 0.7 },
    { emoji: '🌟', className: 'absolute bottom-[5%] right-[30%] text-lg animate-sparkle', delay: 1.8 },
    { emoji: '🌙', className: 'absolute top-[2%] right-[2%] text-2xl animate-drift', delay: 0 },
  ];
}

function getBattleDecorations(dungeonId?: string): Decoration[] {
  switch (dungeonId) {
    case 'doubles-den':
      return [
        // Ground plants
        { emoji: '🌿', className: 'absolute bottom-[2%] left-[5%] text-lg animate-sway opacity-40', delay: 0 },
        { emoji: '🌱', className: 'absolute bottom-[3%] left-[20%] text-xl animate-sway opacity-40', delay: 0.5 },
        { emoji: '🍀', className: 'absolute bottom-[2%] left-[40%] text-sm animate-sway opacity-35', delay: 1.0 },
        { emoji: '🌿', className: 'absolute bottom-[3%] right-[25%] text-lg animate-sway opacity-40', delay: 1.5 },
        { emoji: '🌱', className: 'absolute bottom-[4%] right-[5%] text-xl animate-sway opacity-45', delay: 2.0 },
        // Floating sparkles
        { emoji: '✨', className: 'absolute top-[8%] left-[3%] text-sm animate-sparkle opacity-40', delay: 0.8 },
        { emoji: '⭐', className: 'absolute top-[15%] right-[8%] text-sm animate-sparkleFloat opacity-35', delay: 1.3 },
        { emoji: '✨', className: 'absolute top-[22%] left-[50%] text-xs animate-sparkle opacity-30', delay: 0.3 },
        { emoji: '⭐', className: 'absolute top-[5%] right-[30%] text-sm animate-sparkleFloat opacity-35', delay: 1.8 },
        { emoji: '✨', className: 'absolute top-[28%] left-[15%] text-xs animate-sparkle opacity-30', delay: 2.2 },
      ];

    case 'tower-of-tens':
      return [
        // Tower/crystal ground elements
        { emoji: '🏰', className: 'absolute bottom-[2%] left-[3%] text-lg animate-sway opacity-40', delay: 0 },
        { emoji: '💎', className: 'absolute bottom-[3%] left-[25%] text-sm animate-sway opacity-35', delay: 0.6 },
        { emoji: '🏰', className: 'absolute bottom-[2%] right-[5%] text-lg animate-sway opacity-40', delay: 1.2 },
        { emoji: '💎', className: 'absolute bottom-[4%] right-[30%] text-sm animate-sway opacity-35', delay: 1.8 },
        // Lightning + sparkles floating
        { emoji: '⚡', className: 'absolute top-[5%] left-[8%] text-sm animate-sparkleFloat opacity-45', delay: 0.3 },
        { emoji: '✨', className: 'absolute top-[12%] right-[10%] text-sm animate-sparkle opacity-35', delay: 0.9 },
        { emoji: '⚡', className: 'absolute top-[20%] left-[45%] text-xs animate-sparkleFloat opacity-40', delay: 1.5 },
        { emoji: '⭐', className: 'absolute top-[8%] right-[25%] text-sm animate-sparkle opacity-30', delay: 2.0 },
        { emoji: '✨', className: 'absolute top-[28%] left-[20%] text-xs animate-sparkle opacity-30', delay: 0.5 },
        { emoji: '💎', className: 'absolute top-[18%] right-[3%] text-xs animate-sparkleFloat opacity-35', delay: 2.3 },
      ];

    case 'fives-forest':
      return [
        // Deep forest ground elements
        { emoji: '🌲', className: 'absolute bottom-[2%] left-[3%] text-xl animate-sway opacity-40', delay: 0 },
        { emoji: '🍃', className: 'absolute bottom-[3%] left-[18%] text-lg animate-sway opacity-35', delay: 0.5 },
        { emoji: '🌿', className: 'absolute bottom-[2%] left-[38%] text-sm animate-sway opacity-40', delay: 1.0 },
        { emoji: '🌲', className: 'absolute bottom-[3%] right-[20%] text-lg animate-sway opacity-45', delay: 1.5 },
        { emoji: '🍃', className: 'absolute bottom-[5%] right-[5%] text-xl animate-sway opacity-35', delay: 2.0 },
        // Forest creatures + sparkles floating
        { emoji: '🦊', className: 'absolute bottom-[4%] left-[55%] text-sm animate-sway opacity-40', delay: 0.8 },
        { emoji: '✨', className: 'absolute top-[10%] left-[5%] text-sm animate-sparkle opacity-35', delay: 1.3 },
        { emoji: '✨', className: 'absolute top-[18%] right-[12%] text-xs animate-sparkle opacity-30', delay: 0.3 },
        { emoji: '🍃', className: 'absolute top-[25%] left-[30%] text-xs animate-sparkleFloat opacity-30', delay: 1.8 },
        { emoji: '✨', className: 'absolute top-[7%] right-[35%] text-sm animate-sparkle opacity-35', delay: 2.4 },
      ];

    case 'quad-caverns':
      return [
        // Cave gems ground elements
        { emoji: '💎', className: 'absolute bottom-[2%] left-[5%] text-lg animate-sway opacity-45', delay: 0 },
        { emoji: '🔮', className: 'absolute bottom-[3%] left-[22%] text-sm animate-sway opacity-40', delay: 0.6 },
        { emoji: '💜', className: 'absolute bottom-[2%] left-[42%] text-sm animate-sway opacity-35', delay: 1.1 },
        { emoji: '💎', className: 'absolute bottom-[4%] right-[20%] text-lg animate-sway opacity-45', delay: 1.6 },
        { emoji: '🔮', className: 'absolute bottom-[3%] right-[5%] text-sm animate-sway opacity-40', delay: 2.1 },
        // Crystal sparkles floating
        { emoji: '✨', className: 'absolute top-[6%] left-[8%] text-sm animate-sparkle opacity-40', delay: 0.3 },
        { emoji: '⭐', className: 'absolute top-[14%] right-[10%] text-sm animate-sparkleFloat opacity-35', delay: 0.9 },
        { emoji: '✨', className: 'absolute top-[22%] left-[40%] text-xs animate-sparkle opacity-30', delay: 1.4 },
        { emoji: '💜', className: 'absolute top-[10%] right-[30%] text-xs animate-sparkleFloat opacity-35', delay: 1.9 },
        { emoji: '✨', className: 'absolute top-[28%] left-[18%] text-xs animate-sparkle opacity-30', delay: 2.5 },
      ];

    default:
      return [
        { emoji: '🌱', className: 'absolute bottom-[2%] left-[5%] text-lg animate-sway opacity-40', delay: 0 },
        { emoji: '🌿', className: 'absolute bottom-[3%] left-[20%] text-xl animate-sway opacity-40', delay: 0.5 },
        { emoji: '🌱', className: 'absolute bottom-[2%] left-[40%] text-sm animate-sway opacity-35', delay: 1.0 },
        { emoji: '🌿', className: 'absolute bottom-[3%] right-[25%] text-lg animate-sway opacity-40', delay: 1.5 },
        { emoji: '🌱', className: 'absolute bottom-[2%] right-[5%] text-xl animate-sway opacity-45', delay: 2.0 },
        { emoji: '✨', className: 'absolute top-[10%] left-[3%] text-sm animate-sparkle opacity-35', delay: 0.8 },
        { emoji: '⭐', className: 'absolute top-[5%] right-[8%] text-sm animate-sparkle opacity-30', delay: 1.3 },
        { emoji: '✨', className: 'absolute top-[15%] right-[12%] text-xs animate-sparkle opacity-30', delay: 0.3 },
      ];
  }
}

function getResultsDecorations(): Decoration[] {
  return [
    { emoji: '🎉', className: 'absolute top-[5%] left-[8%] text-2xl animate-flutter', delay: 0 },
    { emoji: '🎊', className: 'absolute top-[3%] right-[10%] text-2xl animate-flutter', delay: 0.5 },
    { emoji: '✨', className: 'absolute top-[15%] left-[15%] text-xl animate-sparkle', delay: 0.2 },
    { emoji: '⭐', className: 'absolute top-[10%] right-[20%] text-lg animate-sparkle', delay: 1.0 },
    { emoji: '🌟', className: 'absolute bottom-[20%] left-[10%] text-sm animate-sparkle', delay: 1.5 },
    { emoji: '💫', className: 'absolute bottom-[10%] right-[5%] text-xl animate-drift', delay: 0.8 },
    { emoji: '✨', className: 'absolute bottom-[15%] left-[5%] text-lg animate-sparkle', delay: 1.2 },
    { emoji: '🎆', className: 'absolute top-[30%] right-[3%] text-sm animate-sparkle', delay: 2.0 },
    { emoji: '🌟', className: 'absolute top-[20%] left-[50%] text-xl animate-drift', delay: 0.6 },
    { emoji: '🎉', className: 'absolute bottom-[5%] right-[15%] text-lg animate-flutter', delay: 1.8 },
  ];
}

export function Decorations({ scene, dungeonId }: DecorationsProps) {
  const decorations = useMemo(() => {
    switch (scene) {
      case 'home': return getHomeDecorations();
      case 'battle': return getBattleDecorations(dungeonId);
      case 'results': return getResultsDecorations();
    }
  }, [scene, dungeonId]);

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

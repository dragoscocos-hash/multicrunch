import { useEffect, useRef, useState } from 'react';

interface HeartsBarProps { hearts: number; maxHearts?: number; isPulsing?: boolean; }
export function HeartsBar({ hearts, maxHearts = 3, isPulsing = false }: HeartsBarProps) {
  const prevHearts = useRef(hearts);
  const [crackingIndex, setCrackingIndex] = useState<number | null>(null);

  useEffect(() => {
    if (hearts < prevHearts.current) {
      // The heart that just broke is at index = hearts (0-indexed, it was the last filled one)
      setCrackingIndex(hearts);
      const t = setTimeout(() => setCrackingIndex(null), 600);
      prevHearts.current = hearts;
      return () => clearTimeout(t);
    }
    prevHearts.current = hearts;
  }, [hearts]);

  return (
    <div className="flex gap-1">
      {Array.from({ length: maxHearts }, (_, i) => (
        <span key={i} className={`text-3xl transition-all duration-300 ${i < hearts ? 'drop-shadow-[0_0_6px_#ff4444]' : crackingIndex === i ? 'animate-heartCrack' : 'grayscale opacity-30'} ${isPulsing && i < hearts ? 'animate-heartPulse' : ''}`}>
          {'\u2764\uFE0F'}
        </span>
      ))}
    </div>
  );
}

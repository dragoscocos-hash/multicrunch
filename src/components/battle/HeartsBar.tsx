interface HeartsBarProps { hearts: number; maxHearts?: number; }
export function HeartsBar({ hearts, maxHearts = 3 }: HeartsBarProps) {
  return (
    <div className="flex gap-1">
      {Array.from({ length: maxHearts }, (_, i) => (
        <span key={i} className={`text-2xl transition-all duration-300 ${i < hearts ? 'drop-shadow-[0_0_6px_#ff4444]' : 'grayscale opacity-30'}`}>
          {'\u2764\uFE0F'}
        </span>
      ))}
    </div>
  );
}

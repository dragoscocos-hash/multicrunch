interface HPBarProps { current: number; max: number; }
export function HPBar({ current, max }: HPBarProps) {
  const pct = Math.max(0, (current / max) * 100);
  const color = pct > 60 ? 'bg-green-400' : pct > 30 ? 'bg-yellow-400' : 'bg-red-500';
  return (
    <div className="w-full h-3 bg-black/40 rounded-full overflow-hidden border border-white/10">
      <div className={`h-full ${color} transition-all duration-500 rounded-full`} style={{ width: `${pct}%` }} />
    </div>
  );
}

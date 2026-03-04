interface ButtonProps {
  onClick: () => void;
  children: React.ReactNode;
  variant?: 'primary' | 'secondary' | 'danger';
  size?: 'sm' | 'md' | 'lg';
  disabled?: boolean;
  className?: string;
}

export function Button({ onClick, children, variant = 'primary', size = 'md', disabled, className = '' }: ButtonProps) {
  const base = 'font-bold font-game border-2 rounded-2xl transition-all active:scale-[0.96] active:translate-y-0.5 select-none touch-manipulation';
  const sizes = { sm: 'px-4 py-2 text-sm', md: 'px-6 py-3 text-base', lg: 'px-8 py-4 text-xl' };
  const variants = {
    primary: 'bg-gradient-to-b from-yellow-400 via-orange-400 to-orange-500 text-white shadow-lg shadow-orange-500/30 border-t-yellow-300 border-b-orange-700 hover:brightness-110 active:shadow-none active:border-t-orange-500',
    secondary: 'bg-gradient-to-b from-sky-400 via-blue-500 to-indigo-500 text-white shadow-lg shadow-blue-500/20 border-t-sky-300 border-b-indigo-700 hover:brightness-110 active:shadow-none active:border-t-blue-500',
    danger: 'bg-gradient-to-b from-red-400 via-red-500 to-rose-600 text-white border-t-red-300 border-b-rose-800 hover:brightness-110 active:shadow-none active:border-t-red-500',
  };
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className={`${base} ${sizes[size]} ${variants[variant]} ${disabled ? 'opacity-50 pointer-events-none' : ''} ${className}`}
    >
      {children}
    </button>
  );
}

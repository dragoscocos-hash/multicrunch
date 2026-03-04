interface ButtonProps {
  onClick: () => void;
  children: React.ReactNode;
  variant?: 'primary' | 'secondary' | 'danger';
  size?: 'sm' | 'md' | 'lg';
  disabled?: boolean;
  className?: string;
}

export function Button({ onClick, children, variant = 'primary', size = 'md', disabled, className = '' }: ButtonProps) {
  const base = 'font-bold rounded-2xl transition-all active:scale-95 select-none touch-manipulation';
  const sizes = { sm: 'px-4 py-2 text-sm', md: 'px-6 py-3 text-base', lg: 'px-8 py-4 text-xl' };
  const variants = {
    primary: 'bg-yellow-400 text-gray-900 shadow-lg shadow-yellow-500/30 hover:bg-yellow-300',
    secondary: 'bg-white/10 text-white border border-white/20 hover:bg-white/20',
    danger: 'bg-red-500 text-white hover:bg-red-400',
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

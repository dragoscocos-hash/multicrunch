interface ButtonProps {
  onClick: () => void;
  children: React.ReactNode;
  variant?: 'primary' | 'secondary' | 'danger';
  size?: 'sm' | 'md' | 'lg';
  disabled?: boolean;
  className?: string;
}

export function Button({ onClick, children, variant = 'primary', size = 'md', disabled, className = '' }: ButtonProps) {
  const base = 'font-bold rounded-full transition-all active:scale-95 select-none touch-manipulation';
  const sizes = { sm: 'px-4 py-2 text-sm', md: 'px-6 py-3 text-base', lg: 'px-8 py-4 text-xl' };
  const variants = {
    primary: 'bg-gradient-to-r from-yellow-400 via-orange-400 to-pink-400 text-white shadow-lg shadow-orange-400/30 hover:shadow-orange-400/50 hover:brightness-110',
    secondary: 'bg-gradient-to-r from-sky-400 to-indigo-400 text-white shadow-lg shadow-sky-400/20 hover:brightness-110',
    danger: 'bg-gradient-to-r from-red-400 to-rose-500 text-white hover:brightness-110',
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

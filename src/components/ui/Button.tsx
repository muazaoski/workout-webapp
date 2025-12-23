import React from 'react';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'ghost' | 'danger' | 'outline';
  size?: 'sm' | 'md' | 'lg' | 'icon';
  fullWidth?: boolean;
  icon?: React.ReactNode;
  loading?: boolean;
}

const Button: React.FC<ButtonProps> = ({
  children,
  variant = 'primary',
  size = 'md',
  fullWidth = false,
  icon,
  loading,
  className = '',
  disabled,
  ...props
}) => {
  const baseStyles = 'inline-flex items-center justify-center font-semibold transition-all active:scale-95 disabled:pointer-events-none disabled:opacity-50';

  const variants = {
    primary: 'bg-primary text-black shadow-lg shadow-primary/20 hover:bg-primary/90',
    secondary: 'bg-muted border border-white/5 text-white hover:bg-muted/80',
    ghost: 'text-muted-foreground hover:text-white hover:bg-white/5',
    danger: 'bg-red-500/10 text-red-500 hover:bg-red-500/20',
    outline: 'border border-white/10 text-white hover:bg-white/5',
  };

  const sizes = {
    sm: 'h-9 px-4 text-xs rounded-xl',
    md: 'h-11 px-6 text-sm rounded-2xl',
    lg: 'h-14 px-8 text-base rounded-2xl',
    icon: 'h-11 w-11 rounded-2xl',
  };

  const width = fullWidth ? 'w-full' : '';

  return (
    <button
      className={`${baseStyles} ${variants[variant]} ${sizes[size]} ${width} ${className}`}
      disabled={disabled || loading}
      {...props}
    >
      {loading ? (
        <div className="mr-2 h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent" />
      ) : icon ? (
        <span className={children ? "mr-2" : ""}>{icon}</span>
      ) : null}
      {children}
    </button>
  );
};

export default Button;
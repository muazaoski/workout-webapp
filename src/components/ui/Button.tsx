import React from 'react';
import { motion } from 'framer-motion';

interface ButtonProps {
  variant?: 'primary' | 'secondary' | 'ghost' | 'danger';
  size?: 'sm' | 'md' | 'lg';
  loading?: boolean;
  icon?: React.ReactNode;
  children: React.ReactNode;
  className?: string;
  disabled?: boolean;
  onClick?: () => void;
  type?: 'button' | 'submit' | 'reset';
}

const Button: React.FC<ButtonProps> = ({
  variant = 'primary',
  size = 'md',
  loading = false,
  icon,
  children,
  className = '',
  disabled,
  onClick,
  type = 'button',
}) => {
  const baseClasses = 'inline-flex items-center justify-center font-medium rounded-xl transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-white/20 disabled:opacity-50 disabled:cursor-not-allowed';

  const variantClasses = {
    primary: 'bg-white text-dark-primary hover:scale-105 hover:shadow-lg hover:shadow-white/20 active:scale-95',
    secondary: 'bg-dark-secondary border border-gray-700 text-white hover:border-white/50 hover:bg-dark-tertiary/50',
    ghost: 'bg-transparent text-gray-400 hover:text-white hover:bg-dark-secondary/50',
    danger: 'bg-red-600/20 border border-red-600/50 text-red-400 hover:bg-red-600/30 hover:border-red-600 hover:text-red-300',
  };

  const sizeClasses = {
    sm: 'px-3 py-1.5 text-sm gap-1.5',
    md: 'px-4 py-2 text-sm gap-2',
    lg: 'px-6 py-3 text-base gap-2',
  };

  const classes = `${baseClasses} ${variantClasses[variant]} ${sizeClasses[size]} ${className}`;

  return (
    <motion.button
      whileHover={loading || disabled ? undefined : { scale: 1.02 }}
      whileTap={loading || disabled ? undefined : { scale: 0.98 }}
      className={classes}
      disabled={disabled || loading}
      onClick={onClick}
      type={type}
    >
      {loading ? (
        <>
          <div className="w-4 h-4 border-2 border-current/20 border-t-current rounded-full animate-spin mr-2" />
          {children}
        </>
      ) : icon ? (
        <>
          <span className="flex-shrink-0 mr-2">{icon}</span>
          <span className="truncate">{children}</span>
        </>
      ) : (
        children
      )}
    </motion.button>
  );
};

export default Button;
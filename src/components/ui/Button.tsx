import React from 'react';

interface ButtonProps {
  variant?: 'primary' | 'yellow' | 'ghost' | 'danger';
  size?: 'sm' | 'md' | 'lg';
  loading?: boolean;
  icon?: React.ReactNode;
  children: React.ReactNode;
  className?: string;
  disabled?: boolean;
  onClick?: () => void;
  fullWidth?: boolean;
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
  fullWidth = false,
  type = 'button'
}) => {
  const getVariantStyles = () => {
    switch (variant) {
      case 'yellow': return 'punk-button-yellow';
      case 'danger': return 'bg-red-600 border-2 border-white text-white shadow-[4px_4px_0px_#000] active:translate-x-1 active:translate-y-1 active:shadow-none';
      case 'ghost': return 'bg-transparent border-2 border-transparent text-white hover:border-punk-yellow';
      default: return 'punk-button';
    }
  };

  const getSizeStyles = () => {
    switch (size) {
      case 'sm': return 'text-[10px] py-1 px-3 tracking-tighter';
      case 'lg': return 'text-xl py-4 px-8';
      default: return 'text-sm py-3 px-6';
    }
  };

  return (
    <button
      type={type}
      disabled={disabled || loading}
      onClick={onClick}
      className={`
        ${getVariantStyles()} 
        ${getSizeStyles()} 
        ${fullWidth ? 'w-full' : ''} 
        ${className} 
        disabled:grayscale disabled:opacity-50 disabled:cursor-not-allowed
        font-black italic tracking-widest uppercase
      `}
    >
      {loading ? (
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 border-2 border-current border-t-transparent animate-spin" />
          <span>PROCESSING...</span>
        </div>
      ) : (
        <>
          {icon && <span className="flex-shrink-0">{icon}</span>}
          <span className="truncate">{children}</span>
        </>
      )}
    </button>
  );
};

export default Button;
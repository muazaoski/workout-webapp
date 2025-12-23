import React from 'react';

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  icon?: React.ReactNode;
}

const Input: React.FC<InputProps> = ({ label, error, icon, className = '', ...props }) => {
  return (
    <div className="w-full space-y-1">
      {label && (
        <label className="text-[10px] uppercase font-black tracking-widest text-punk-yellow ml-1">
          {label}
        </label>
      )}
      <div className="relative group">
        {icon && (
          <div className="absolute left-4 top-1/2 -translate-y-1/2 text-punk-white/40 group-focus-within:text-punk-yellow transition-colors">
            {icon}
          </div>
        )}
        <input
          className={`
            punk-input 
            ${icon ? 'pl-12' : ''} 
            ${error ? 'border-red-500' : ''} 
            ${className}
          `}
          {...props}
        />
      </div>
      {error && (
        <p className="text-[10px] font-mono text-red-500 uppercase mt-1 ml-1 font-bold">
          ! ERROR: {error}
        </p>
      )}
    </div>
  );
};

export default Input;
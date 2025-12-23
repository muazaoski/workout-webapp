import React from 'react';

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  icon?: React.ReactNode;
}

const Input: React.FC<InputProps> = ({ label, error, icon, className = '', ...props }) => {
  return (
    <div className="w-full space-y-2">
      {label && (
        <label className="block text-[10px] font-black uppercase tracking-widest text-brand-white/40 ml-1">
          {label}
        </label>
      )}
      <div className="relative">
        {icon && (
          <div className="absolute left-0 top-1/2 -translate-y-1/2 text-brand-white/40">
            {icon}
          </div>
        )}
        <input
          className={`minimal-input ${icon ? 'pl-8' : ''} ${error ? 'border-red-500' : ''} ${className}`}
          {...props}
        />
      </div>
      {error && <p className="text-[10px] text-red-500 font-bold uppercase tracking-tight">{error}</p>}
    </div>
  );
};

export default Input;
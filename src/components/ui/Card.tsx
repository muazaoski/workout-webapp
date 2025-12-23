import React from 'react';

interface CardProps {
  children: React.ReactNode;
  title?: string;
  subtitle?: string;
  className?: string;
  interactive?: boolean;
}

const Card: React.FC<CardProps> = ({ children, title, subtitle, className = '', interactive = false }) => {
  return (
    <div className={`${interactive ? 'minimal-card-interactive' : 'minimal-card'} ${className}`}>
      {(title || subtitle) && (
        <div className="mb-6">
          {title && (
            <h3 className="text-sm font-black uppercase tracking-[0.2em] mb-1">
              {title}
            </h3>
          )}
          {subtitle && (
            <p className="text-[10px] font-bold text-brand-white/40 uppercase tracking-widest">
              {subtitle}
            </p>
          )}
        </div>
      )}
      {children}
    </div>
  );
};

export default Card;
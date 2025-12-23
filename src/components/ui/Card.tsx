import React from 'react';

interface CardProps {
  children: React.ReactNode;
  title?: string;
  description?: string;
  className?: string;
  headerAction?: React.ReactNode;
}

const Card: React.FC<CardProps> = ({ children, title, description, className = '', headerAction }) => {
  return (
    <div className={`glass-card ${className}`}>
      {(title || description || headerAction) && (
        <div className="flex items-start justify-between mb-6">
          <div className="space-y-1">
            {title && (
              <h3 className="text-xl font-bold tracking-tight text-white">
                {title}
              </h3>
            )}
            {description && (
              <p className="text-sm text-muted-foreground">
                {description}
              </p>
            )}
          </div>
          {headerAction && (
            <div className="flex-shrink-0">
              {headerAction}
            </div>
          )}
        </div>
      )}
      <div>
        {children}
      </div>
    </div>
  );
};

export default Card;
import React from 'react';
import { motion } from 'framer-motion';

interface CardProps {
  children: React.ReactNode;
  className?: string;
  hover?: boolean;
  glow?: boolean;
  onClick?: () => void;
}

const Card: React.FC<CardProps> = ({
  children,
  className = '',
  hover = true,
  glow = false,
  onClick,
}) => {
  const baseClasses = 'bg-dark-secondary/50 border border-gray-800/50 rounded-lg p-4 relative overflow-hidden';
  const hoverClasses = hover ? 'hover:border-white/30 transition-all duration-200' : '';
  const glowClasses = glow ? 'shadow-sm' : '';
  const interactiveClasses = onClick ? 'cursor-pointer' : '';

  const classes = `${baseClasses} ${hoverClasses} ${glowClasses} ${interactiveClasses} ${className}`;

  return (
    <motion.div
      whileHover={hover && !onClick ? { y: -1 } : undefined}
      whileTap={onClick ? { scale: 0.98 } : undefined}
      className={classes}
      onClick={onClick}
    >
      {children}
    </motion.div>
  );
};

export const CardHeader: React.FC<{ children: React.ReactNode; className?: string }> = ({
  children,
  className = '',
}) => (
  <div className={`flex items-center justify-between mb-3 ${className}`}>
    {children}
  </div>
);

export const CardTitle: React.FC<{ children: React.ReactNode; className?: string }> = ({
  children,
  className = '',
}) => (
  <h3 className={`text-lg font-medium text-white ${className}`}>
    {children}
  </h3>
);

export const CardDescription: React.FC<{ children: React.ReactNode; className?: string }> = ({
  children,
  className = '',
}) => (
  <p className={`text-gray-400 text-sm ${className}`}>
    {children}
  </p>
);

export const CardContent: React.FC<{ children: React.ReactNode; className?: string }> = ({
  children,
  className = '',
}) => (
  <div className={`${className}`}>
    {children}
  </div>
);

export const CardFooter: React.FC<{ children: React.ReactNode; className?: string }> = ({
  children,
  className = '',
}) => (
  <div className={`flex items-center justify-between mt-4 pt-3 border-t border-gray-800 ${className}`}>
    {children}
  </div>
);

export default Card;
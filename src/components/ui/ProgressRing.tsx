import React from 'react';
import { motion } from 'framer-motion';

interface ProgressRingProps {
  progress: number; // 0 to 100
  size?: number;
  strokeWidth?: number;
  backgroundColor?: string;
  progressColor?: string;
  showPercentage?: boolean;
  className?: string;
  children?: React.ReactNode;
}

const ProgressRing: React.FC<ProgressRingProps> = ({
  progress,
  size = 120,
  strokeWidth = 8,
  backgroundColor = '#2a2a2a',
  progressColor = '#ffffff',
  showPercentage = true,
  className = '',
  children,
}) => {
  const normalizedRadius = (size - strokeWidth) / 2;
  const circumference = normalizedRadius * 2 * Math.PI;
  const strokeDashoffset = circumference - (progress / 100) * circumference;

  return (
    <div className={`relative inline-flex items-center justify-center ${className}`}>
      <svg
        height={size}
        width={size}
        className="transform -rotate-90"
      >
  
        {/* Background circle */}
        <circle
          stroke={backgroundColor}
          fill="transparent"
          strokeWidth={strokeWidth}
          r={normalizedRadius}
          cx={size / 2}
          cy={size / 2}
        />

        {/* Progress circle */}
        <motion.circle
          stroke={progressColor}
          fill="transparent"
          strokeWidth={strokeWidth}
          strokeDasharray={circumference + ' ' + circumference}
          strokeDashoffset={strokeDashoffset}
          r={normalizedRadius}
          cx={size / 2}
          cy={size / 2}
          strokeLinecap="round"
          initial={{ strokeDashoffset: circumference }}
          animate={{ strokeDashoffset }}
          transition={{ duration: 0.5, ease: "easeInOut" }}
        />
      </svg>

      {/* Center content */}
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        {children || (showPercentage && (
          <span className="text-2xl font-bold text-white">
            {Math.round(progress)}%
          </span>
        ))}
      </div>
    </div>
  );
};

export default ProgressRing;
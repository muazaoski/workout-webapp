import React from 'react';

interface FireIconProps {
  streak: number;
  size?: number;
}

const FireIcon: React.FC<FireIconProps> = ({ streak, size = 20 }) => {
  const getFireColor = () => {
    if (streak >= 30) return '#ff6b35'; // Bright orange for high streaks
    if (streak >= 14) return '#ff8c42'; // Medium orange
    if (streak >= 7) return '#ffa947'; // Light orange
    if (streak >= 3) return '#ffc757'; // Yellow-orange
    return '#8b9dc3'; // Gray-blue for low streaks
  };

  const getFireAnimation = () => {
    if (streak >= 30) return 'animate-pulse'; // Fast pulse for high streaks
    if (streak >= 14) return 'animate-pulse'; // Medium pulse
    if (streak >= 7) return 'animate-pulse'; // Slow pulse
    return ''; // No animation for low streaks
  };

  const fireColor = getFireColor();
  const animation = getFireAnimation();

  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      className={animation}
    >
      <path
        d="M12 2C12 2 8 6 8 10C8 10 6 11 6 13C6 13 4 14 4 16C4 16 2 17 2 19C2 19 4 21 4 21C4 21 8 20 8 20C8 20 12 22 12 22C12 22 16 20 16 20C16 20 20 21 20 21C20 21 22 19 22 19C22 19 20 16 20 16C20 16 18 13 18 13C18 13 16 10 16 10C16 10 12 2 12 2Z"
        fill={fireColor}
        stroke={fireColor}
        strokeWidth="1"
      />
      <path
        d="M12 8C12 8 11 10 11 11C11 11 10 12 10 13C10 13 9 14 9 15"
        stroke="#fff"
        strokeWidth="0.5"
        fill="none"
        opacity={streak >= 3 ? 0.8 : 0.3}
      />
      <path
        d="M12 12C12 12 13 13 13 14"
        stroke="#fff"
        strokeWidth="0.5"
        fill="none"
        opacity={streak >= 7 ? 0.6 : 0.2}
      />
    </svg>
  );
};

export default FireIcon;
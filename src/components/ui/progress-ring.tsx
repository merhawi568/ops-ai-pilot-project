
import React from 'react';
import { cn } from '@/lib/utils';

interface ProgressRingProps {
  progress: number;
  total: number;
  size?: 'sm' | 'md' | 'lg';
  showText?: boolean;
  className?: string;
}

export const ProgressRing: React.FC<ProgressRingProps> = ({
  progress,
  total,
  size = 'md',
  showText = true,
  className
}) => {
  const percentage = (progress / total) * 100;
  const sizeClasses = {
    sm: 'w-8 h-8',
    md: 'w-12 h-12',
    lg: 'w-16 h-16'
  };
  
  const strokeWidth = size === 'sm' ? 2 : size === 'md' ? 3 : 4;
  const radius = size === 'sm' ? 14 : size === 'md' ? 21 : 28;
  const circumference = 2 * Math.PI * radius;
  const strokeDasharray = circumference;
  const strokeDashoffset = circumference - (percentage / 100) * circumference;
  
  return (
    <div className={cn('relative inline-flex items-center justify-center', sizeClasses[size], className)}>
      <svg className="transform -rotate-90" width="100%" height="100%">
        <circle
          cx="50%"
          cy="50%"
          r={radius}
          stroke="currentColor"
          strokeWidth={strokeWidth}
          fill="transparent"
          className="text-gray-200"
        />
        <circle
          cx="50%"
          cy="50%"
          r={radius}
          stroke="currentColor"
          strokeWidth={strokeWidth}
          fill="transparent"
          strokeDasharray={strokeDasharray}
          strokeDashoffset={strokeDashoffset}
          className={cn(
            'transition-all duration-300 ease-in-out',
            percentage >= 80 ? 'text-green-500' : 
            percentage >= 60 ? 'text-yellow-500' : 'text-blue-500'
          )}
          strokeLinecap="round"
        />
      </svg>
      {showText && (
        <div className="absolute inset-0 flex items-center justify-center">
          <span className={cn(
            'font-medium text-gray-900',
            size === 'sm' ? 'text-xs' : size === 'md' ? 'text-sm' : 'text-base'
          )}>
            {progress}/{total}
          </span>
        </div>
      )}
    </div>
  );
};

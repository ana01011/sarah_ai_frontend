import React from 'react';

interface SkeletonProps {
  className?: string;
  width?: string | number;
  height?: string | number;
}

export const Skeleton: React.FC<SkeletonProps> = ({ 
  className = "", 
  width, 
  height 
}) => {
  return (
    <div 
      className={`animate-pulse bg-slate-200 rounded-xl ${className}`} 
      style={{ width, height }}
    />
  );
};
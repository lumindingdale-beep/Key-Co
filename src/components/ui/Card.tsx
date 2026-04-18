import React from 'react';
import { cn } from '@/lib/utils';

interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: 'default' | 'glass' | 'premium' | 'outline';
  className?: string;
  children?: React.ReactNode;
}

export function Card({ className, variant = 'default', children, ...props }: CardProps) {
  const variants = {
    default: 'bg-white shadow-[0_8px_30px_rgba(0,0,0,0.1)] border border-gray-200',
    glass: 'bg-white/80 backdrop-blur-md shadow-[0_8px_30px_rgba(0,0,0,0.1)] border border-gray-200',
    premium: 'bg-gradient-to-br from-gold to-red text-white shadow-xl border-none',
    outline: 'bg-transparent border-2 border-gray-200',
  };

  return (
    <div
      className={cn('rounded-[20px] p-6 transition-all', variants[variant], className)}
      {...props}
    >
      {children}
    </div>
  );
}

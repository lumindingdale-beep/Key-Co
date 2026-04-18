import React from 'react';
import { cn } from '@/lib/utils';
import { motion } from 'motion/react';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost' | 'gold' | 'danger';
  size?: 'sm' | 'md' | 'lg' | 'icon';
  isLoading?: boolean;
}

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = 'primary', size = 'md', isLoading, children, ...props }, ref) => {
    const variants = {
      primary: 'bg-red text-white hover:opacity-90',
      secondary: 'bg-gold text-white hover:opacity-90',
      outline: 'border-2 border-gold text-gold hover:bg-gold/5',
      ghost: 'text-gray-800 hover:bg-gray-100',
      gold: 'bg-gold text-white font-bold hover:opacity-90',
      danger: 'bg-red text-white hover:opacity-90',
    };

    const sizes = {
      sm: 'px-3 py-1.5 text-sm',
      md: 'px-6 py-3.5',
      lg: 'px-8 py-4 text-lg font-bold',
      icon: 'p-2',
    };

    return (
      <motion.button
        whileTap={{ scale: 0.95 }}
        ref={ref}
        className={cn(
          'inline-flex items-center justify-center rounded-[12px] font-bold transition-all focus:outline-none focus:ring-2 focus:ring-gold disabled:opacity-50 disabled:cursor-not-allowed uppercase tracking-wider text-xs',
          variants[variant],
          sizes[size],
          className
        )}
        {...props}
      >
        {isLoading ? (
          <div className="mr-2 h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent" />
        ) : null}
        {children}
      </motion.button>
    );
  }
);

Button.displayName = 'Button';

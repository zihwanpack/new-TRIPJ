import React from 'react';
import { clsx } from 'clsx';
interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  size?: 'sm' | 'md' | 'lg';
  variant?: 'primary' | 'secondary' | 'outline' | 'pill';
  children: React.ReactNode;
}

const SIZES = {
  sm: 'px-2 py-1 text-xs',
  md: 'px-3 py-2 text-sm',
  lg: 'px-4 py-3 text-base',
};

const VARIANTS = {
  primary:
    'bg-primary-base text-white hover:opacity-90 dark:bg-primary-dark dark:hover:bg-primary-base',
  secondary:
    'bg-gray-200 text-gray-900 hover:bg-gray-300 dark:bg-gray-800 dark:text-gray-100 dark:hover:bg-gray-700',
  outline:
    'border border-gray-400 text-gray-900 bg-transparent hover:bg-gray-50 dark:border-gray-600 dark:text-gray-100 dark:hover:bg-gray-800',
  pill: 'rounded-full',
};

export const Button = ({ size = 'md', variant, children, className, ...props }: ButtonProps) => {
  return (
    <button
      className={clsx(
        'cursor-pointer font-medium transition-colors',
        variant === 'pill' && 'transition',
        SIZES[size],
        variant && VARIANTS[variant],
        className
      )}
      {...props}
    >
      {children}
    </button>
  );
};

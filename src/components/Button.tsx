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
  primary: 'bg-primary-base text-white hover:opacity-90',
  secondary: 'bg-gray-200 text-gray-900 hover:bg-gray-300',
  outline: 'border border-gray-400 text-gray-900 bg-transparent hover:bg-gray-50',
  pill: 'rounded-full',
};

export const Button = ({ size = 'md', variant, children, className, ...props }: ButtonProps) => {
  return (
    <button
      className={clsx(
        'cursor-pointer font-medium',
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

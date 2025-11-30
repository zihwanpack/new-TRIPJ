import React from 'react';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  size?: 'sm' | 'md' | 'lg';
  variant?: 'primary' | 'secondary' | 'outline' | 'pill';
  children: React.ReactNode;
}

export const Button = ({ size, variant, children, className = '', ...props }: ButtonProps) => {
  const sizeClassMap = {
    sm: 'px-2 py-1 text-xs',
    md: 'px-3 py-2 text-sm',
    lg: 'px-4 py-3 text-base',
  };

  const sizeClass = size ? sizeClassMap[size] : '';

  const variantClassMap = {
    primary: 'bg-blue-600 text-white hover:bg-blue-700',
    secondary: 'bg-gray-200 text-gray-900 hover:bg-gray-300',
    outline: 'border border-gray-400 text-gray-900 bg-transparent hover:bg-gray-50',
    pill: 'rounded-full',
  };

  const variantClass = variant ? variantClassMap[variant] : '';

  return (
    <button className={`${sizeClass} ${variantClass} ${className}`} {...props}>
      {children}
    </button>
  );
};

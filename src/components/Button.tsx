import React from 'react';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  size?: 'sm' | 'md' | 'lg';
  variant?: 'primary' | 'secondary' | 'outline' | 'pill';
  children: React.ReactNode;
}

export const Button = ({
  size = 'md',
  variant,
  children,
  className = '',
  ...props
}: ButtonProps) => {
  const sizeClassMap = {
    sm: 'px-2 py-1 text-xs',
    md: 'px-3 py-2 text-sm',
    lg: 'px-4 py-3 text-base',
  };

  const variantClassMap = {
    primary: 'bg-primary-base text-white hover:opacity-90',
    secondary: 'bg-gray-200 text-gray-900 hover:bg-gray-300',
    outline: 'border border-gray-400 text-gray-900 bg-transparent hover:bg-gray-50',
    pill: 'rounded-full',
  };

  const baseStyles =
    variant === 'pill'
      ? 'transition cursor-pointer font-medium'
      : 'rounded-md transition cursor-pointer font-medium';

  const variantClass = variant ? variantClassMap[variant] : '';
  const sizeClass = sizeClassMap[size];

  return (
    <button className={`${baseStyles} ${sizeClass} ${variantClass} ${className}`.trim()} {...props}>
      {children}
    </button>
  );
};

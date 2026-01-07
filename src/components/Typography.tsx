import clsx from 'clsx';
import { type ReactNode, type ElementType } from 'react';

type TypographyVariant = 'h1' | 'h2' | 'h3' | 'body' | 'bodySmall' | 'caption' | 'label' | 'helper';

type TypographyColor = 'default' | 'primary' | 'secondary' | 'muted' | 'error';

interface TypographyProps {
  variant?: TypographyVariant;
  color?: TypographyColor;
  children: ReactNode;
  className?: string;
  as?: ElementType;
}

const variantStyles: Record<TypographyVariant, string> = {
  h1: 'text-xl font-semibold',
  h2: 'text-lg font-bold',
  h3: 'text-base font-semibold',
  body: 'text-sm',
  bodySmall: 'text-xs',
  caption: 'text-xs font-semibold',
  label: 'text-sm font-medium',
  helper: 'text-sm',
};

const colorStyles: Record<TypographyColor, string> = {
  default: 'text-slate-900 dark:text-slate-100',
  primary: 'text-primary-base',
  secondary: 'text-slate-800 dark:text-slate-100',
  muted: 'text-gray-500 dark:text-gray-400',
  error: 'text-red-500 dark:text-red-400',
};

const defaultElements: Record<TypographyVariant, ElementType> = {
  h1: 'h1',
  h2: 'h2',
  h3: 'h3',
  body: 'p',
  bodySmall: 'p',
  caption: 'span',
  label: 'label',
  helper: 'p',
};

export const Typography = ({
  variant = 'body',
  color = 'default',
  children,
  className,
}: TypographyProps) => {
  const Component = defaultElements[variant];

  return (
    <Component className={clsx(variantStyles[variant], colorStyles[color], className)}>
      {children}
    </Component>
  );
};

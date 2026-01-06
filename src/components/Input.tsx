import clsx from 'clsx';
import { forwardRef } from 'react';

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  containerClassName?: string;
}

export const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ label, containerClassName, className, ...props }, ref) => {
    return (
      <div className={containerClassName}>
        {label && (
          <label className="mb-1 block text-sm font-medium text-gray-600 dark:text-gray-300">
            {label}
          </label>
        )}
        <input
          ref={ref}
          className={clsx(
            'w-full outline-none text-slate-700 dark:text-slate-100 placeholder:text-gray-300 dark:placeholder:text-gray-500 bg-white dark:bg-slate-900 border border-gray-200 dark:border-gray-700 rounded-lg px-3 py-2',
            className
          )}
          {...props}
        />
      </div>
    );
  }
);

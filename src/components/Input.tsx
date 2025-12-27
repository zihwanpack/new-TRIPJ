import { forwardRef } from 'react';

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  containerClassName?: string;
}

export const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ label, containerClassName, className, ...props }, ref) => {
    return (
      <div className={containerClassName}>
        {label && <label className="mb-1 block text-sm font-medium text-gray-600">{label}</label>}
        <input
          ref={ref}
          className={`w-full outline-none text-slate-700 placeholder:text-gray-300 ${className}`}
          {...props}
        />
      </div>
    );
  }
);

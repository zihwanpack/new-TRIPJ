import { type ReactNode } from 'react';
import clsx from 'clsx';
import { Button } from './Button.tsx';

interface CustomButton {
  text: string;
  onClick: () => void;
  variant?: 'primary' | 'secondary' | 'danger';
  icon?: ReactNode;
  disabled?: boolean;
}

interface CTAProps {
  isValid?: boolean;
  setStep?: (step: number) => void;
  currentStep?: number;
  isLoading?: boolean;
  isLastStep?: boolean;
  onSubmit?: () => void;
  isNecessary?: boolean;
  previousButtonText?: string;
  nextButtonText?: string;
  customButtons?: CustomButton[];
  className?: string;
}

export const CTA = ({
  isValid,
  setStep,
  currentStep,
  isLoading,
  isLastStep,
  onSubmit,
  isNecessary = true,
  previousButtonText,
  nextButtonText,
  customButtons,
  className,
}: CTAProps) => {
  if (customButtons) {
    return (
      <div
        className={
          className ||
          'absolute bottom-0 left-0 right-0 p-4 pb-8 bg-white/90 dark:bg-slate-950/95 backdrop-blur-md border-t border-gray-100 dark:border-gray-800 flex gap-3 z-10'
        }
      >
        {customButtons.map((button, index) => (
          <Button
            key={index}
            type="button"
            onClick={button.onClick}
            disabled={button.disabled || isLoading}
            className={clsx(
              'flex-1 h-12 rounded-xl shadow-sm flex items-center justify-center gap-2 transition-colors font-semibold',
              button.variant === 'danger'
                ? 'bg-red-500 hover:bg-red-600 text-white border border-red-100 dark:border-red-500/40'
                : button.variant === 'secondary'
                  ? 'bg-gray-200 text-gray-900 hover:bg-gray-300 dark:bg-gray-800 dark:text-gray-100 dark:hover:bg-gray-700'
                  : 'bg-primary-base/90 border border-gray-200 dark:border-primary-base/50 text-white hover:bg-primary-dark'
            )}
          >
            {button.icon}
            <span>{button.text}</span>
          </Button>
        ))}
      </div>
    );
  }

  const handleNextOrSubmit = () => {
    if (isLoading || !setStep || currentStep === undefined) return;

    if (isLastStep) {
      onSubmit?.();
    } else {
      setStep(currentStep + 1);
    }
  };
  const isDisabled = isLoading || (isNecessary && !isValid);
  const buttonVariant = isDisabled ? 'secondary' : 'primary';

  return (
    <div className={className || 'flex gap-3 mb-4 px-4'}>
      {currentStep && currentStep > 1 && previousButtonText && (
        <Button
          type="button"
          onClick={() => setStep?.(currentStep - 1)}
          disabled={isLoading}
          className="w-full py-2 rounded-md font-semibold transition cursor-pointer bg-gray-100 text-slate-600 hover:bg-gray-200 m-1"
          variant="secondary"
        >
          {previousButtonText}
        </Button>
      )}

      {nextButtonText && (
        <Button
          type="button"
          onClick={handleNextOrSubmit}
          variant={buttonVariant}
          disabled={isDisabled}
          className="w-full rounded-md font-semibold transition m-1 cursor-pointer"
        >
          {nextButtonText}
        </Button>
      )}
    </div>
  );
};

import { Button } from './Button.tsx';

interface CTAProps {
  isValid?: boolean;
  setStep: (step: number) => void;
  currentStep: number;
  isLoading?: boolean;
  isLastStep?: boolean;
  onSubmit?: () => void;
  isNecessary?: boolean;
  previousButtonText: string;
  nextButtonText: string;
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
}: CTAProps) => {
  const handleNextOrSubmit = () => {
    if (isLoading) return;

    if (isLastStep) {
      onSubmit?.();
    } else {
      setStep(currentStep + 1);
    }
  };
  const isDisabled = isLoading || (isNecessary && !isValid);
  const buttonVariant = isDisabled ? 'secondary' : 'primary';

  return (
    <div className="flex gap-3 mb-4 px-4">
      {currentStep > 1 && (
        <Button
          type="button"
          onClick={() => setStep(currentStep - 1)}
          disabled={isLoading}
          className="w-full py-2 rounded-md font-semibold transition cursor-pointer bg-gray-100 text-slate-600 hover:bg-gray-200 m-1"
          variant="secondary"
        >
          {previousButtonText}
        </Button>
      )}

      <Button
        type="button"
        onClick={handleNextOrSubmit}
        variant={buttonVariant}
        disabled={isDisabled}
        className="w-full rounded-md  font-semibold transition m-1 cursor-pointer"
      >
        {nextButtonText}
      </Button>
    </div>
  );
};

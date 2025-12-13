import { useState, useEffect } from 'react';

export const usePersistedStep = (key: string, initialStep: number = 1) => {
  const [step, setStep] = useState<number>(() => {
    const storedStep = sessionStorage.getItem(key);
    return storedStep ? Number(storedStep) : initialStep;
  });

  useEffect(() => {
    sessionStorage.setItem(key, String(step));
  }, [key, step]);

  const resetStep = () => {
    sessionStorage.removeItem(key);
    setStep(initialStep);
  };

  return { step, setStep, resetStep };
};

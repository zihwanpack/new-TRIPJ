import { useState } from 'react';
import { DESTINATIONS } from '../constants/destinations.ts';
import { type TripFormValues } from '../schemas/tripSchema.ts';
import { useFormContext } from 'react-hook-form';
import { ChevronDownIcon } from 'lucide-react';
import type { DestinationKey } from '../constants/tripImages.ts';
import type { DestinationType } from '../types/trip.ts';
import { Button } from './Button.tsx';
import { CTA } from './CTA.tsx';
import clsx from 'clsx';

interface TripDestinationStepProps {
  setStep: (step: number) => void;
}

export const TripDestinationStep = ({ setStep }: TripDestinationStepProps) => {
  const { setValue, watch } = useFormContext<TripFormValues>();
  const [isRegionSelectOpen, setIsRegionSelectOpen] = useState<boolean>(false);
  const [isDestinationSelectOpen, setIsDestinationSelectOpen] = useState<boolean>(false);

  const destinationType = watch('destinationType');
  const destination = watch('destination');
  const isDestinationStepValid = Boolean(destinationType && destination);
  const destinationOptions = destinationType ? Object.entries(DESTINATIONS[destinationType]) : [];
  const isDestinationSelectDisabled = !destinationType;

  const handleDestinationTypeChange = (type: DestinationType) => {
    setValue('destinationType', type);
    setValue('destination', '' as DestinationKey);
    setIsRegionSelectOpen(false);
  };

  const REGION_LABELS: Record<DestinationType, string> = {
    domestic: '국내',
    overseas: '해외',
  } as const;

  const DESTINATION_PLACEHOLDERS: Record<DestinationType, string> = {
    domestic: '국내 도시 선택',
    overseas: '해외 국가 선택',
  } as const;

  const currentRegionLabel = destinationType ? REGION_LABELS[destinationType] : '국내/해외';

  const getCurrentDestinationLabel = () => {
    if (destination && destinationType) {
      return DESTINATIONS[destinationType]?.[destination];
    }
    if (destinationType) {
      return DESTINATION_PLACEHOLDERS[destinationType];
    }
    return '도시/국가 선택';
  };

  return (
    <div className="flex flex-col h-full">
      <div className="flex gap-2 items-center mt-4 mx-4 min-h-[70px]">
        <h1 className="text-xl font-semibold">어디로 떠나시나요</h1>
        <p className="text-sm text-primary-base">필수</p>
      </div>
      <div className="mb-4 mx-4 flex gap-2">
        <div className="relative flex-[1]">
          <Button
            type="button"
            onClick={() => setIsRegionSelectOpen(!isRegionSelectOpen)}
            className="flex items-center gap-2 border-2 border-gray-200 hover:border-primary-base cursor-pointer p-2 rounded-md justify-between w-full"
          >
            <span>{currentRegionLabel}</span>
            <ChevronDownIcon className="size-5" />
          </Button>
          {isRegionSelectOpen && (
            <div className="absolute z-10 top-full left-0 flex flex-col shadow-2xl w-full bg-white rounded-md p-1">
              <Button
                type="button"
                onClick={() => handleDestinationTypeChange('domestic')}
                className="mt-1 hover:bg-gray-100 block w-full text-left p-2 rounded-md"
              >
                국내
              </Button>
              <Button
                type="button"
                onClick={() => handleDestinationTypeChange('overseas')}
                className="block w-full text-left p-2 rounded-md hover:bg-gray-100"
              >
                해외
              </Button>
            </div>
          )}
        </div>
        <div className="relative flex-[2]">
          <Button
            type="button"
            onClick={() => {
              if (isDestinationSelectDisabled) return;
              setIsDestinationSelectOpen(!isDestinationSelectOpen);
            }}
            className={clsx(
              'flex items-center justify-between gap-2 border-2 p-2 rounded-md transition w-full',
              isDestinationSelectDisabled
                ? 'border-gray-200 bg-gray-100 text-gray-400 cursor-not-allowed'
                : 'border-primary-base cursor-pointer'
            )}
          >
            <span className={destination ? 'text-black' : 'text-gray-400'}>
              {getCurrentDestinationLabel()}
            </span>
            <ChevronDownIcon className="size-5" />
          </Button>
          {isDestinationSelectOpen && (
            <div className="absolute z-10 top-full left-0 flex flex-col shadow-xl min-w-full bg-white rounded-md p-1 max-h-[200px] overflow-y-auto scrollbar-hide">
              {destinationOptions.map(([value, label]) => (
                <Button
                  key={value}
                  type="button"
                  onClick={() => {
                    setValue('destination', value as DestinationKey);
                    setIsDestinationSelectOpen(false);
                  }}
                  className="px-2 py-2 rounded-md hover:bg-gray-100 text-left cursor-pointer w-full"
                >
                  {label}
                </Button>
              ))}
            </div>
          )}
        </div>
      </div>
      <div className="flex-1" />
      <CTA
        isValid={isDestinationStepValid}
        setStep={setStep}
        currentStep={1}
        previousButtonText="이전"
        nextButtonText="다음"
      />
    </div>
  );
};

import { useMemo, useState } from 'react';
import { useFormContext } from 'react-hook-form';
import { ChevronDownIcon } from 'lucide-react';
import clsx from 'clsx';

import { DESTINATIONS} from '../../constants/destinations';
import type { TripFormValues } from '../../schemas/tripSchema';
import type { DestinationType } from '../../types/trip';
import { Button } from '../common/Button';
import { CTA } from '../common/CTA';
import { Typography } from '../common/Typography';
import type { DestinationKey } from '../../constants/tripImages.ts';
import { getTypedEntries } from '../../utils/common/getTypedEntries.ts';
import { getTypedKeys } from '../../utils/common/getTypedKeys.ts';

const SELECT_OPTIONS: Record<DestinationType, { label: '국내' | '해외'; placeholder: '국내 도시 선택' | '해외 국가 선택' }> = {
  domestic: { label: '국내', placeholder: '국내 도시 선택' },
  overseas: { label: '해외', placeholder: '해외 국가 선택' },
} as const;

interface TripDestinationStepProps {
  setStep: (step: number) => void;
}

export const TripDestinationStep = ({ setStep }: TripDestinationStepProps) => {
  const { setValue, watch } = useFormContext<TripFormValues>();

  const [openDropdown, setOpenDropdown] = useState<'region' | 'destination' | null>(null);

  const currentType = watch('destinationType');
  const currentDest = watch('destination');

  const cityOptions = useMemo(() => {
    if (!currentType) return [];
    return getTypedEntries (DESTINATIONS[currentType]);
  }, [currentType]);

  const regionLabel = currentType ? SELECT_OPTIONS[currentType].label : '국내/해외';


  const getDestinationLabel = (
    destinationType: DestinationType | string, 
    destination: DestinationKey | string
  ) => {
    if (!destinationType) return '도시/국가 선택';
    const safeType = destinationType as DestinationType;
    if (!destination) return SELECT_OPTIONS[safeType].placeholder;
    return DESTINATIONS[safeType][destination as keyof (typeof DESTINATIONS)[typeof safeType]] || destination;
  };

  const handleRegionSelect = (type: DestinationType) => {
    setValue('destinationType', type);
    setValue('destination', '' );
    setOpenDropdown('destination');
  };

  const handleDestSelect = (destKey: DestinationKey) => {
    setValue('destination', destKey);
    setOpenDropdown(null);
  };

  return (
    <div className="flex flex-col h-full">
      <div className="flex gap-2 items-center mt-4 mx-4 min-h-[70px]">
        <Typography variant="h1">어디로 떠나시나요</Typography>
        <Typography variant="bodySmall" color="primary">
          필수
        </Typography>
      </div>

      <div className="mb-4 mx-4 flex gap-2">
        <div className="relative flex-[1]">
          <Button
            type="button"
            onClick={() => setOpenDropdown(openDropdown === 'region' ? null : 'region')}
            className="flex items-center justify-between w-full p-2 border-2 rounded-md border-gray-200 dark:border-gray-700 hover:border-primary-base bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-100"
          >
            <span>{regionLabel}</span>
            <ChevronDownIcon className="size-5" />
          </Button>

          {openDropdown === 'region' && (
            <div className="absolute z-10 top-full left-0 w-full mt-1 bg-white dark:bg-slate-900 border border-gray-100 dark:border-gray-700 rounded-md shadow-2xl overflow-hidden">
              {getTypedKeys(DESTINATIONS).map((type) => (
                <Button
                  key={type}
                  type="button"
                  onClick={() => handleRegionSelect(type)}
                  className="block w-full p-2 text-left hover:bg-gray-100 dark:hover:bg-gray-800 text-slate-900 dark:text-slate-100"
                >
                  {SELECT_OPTIONS[type].label}
                </Button>
              ))}
            </div>
          )}
        </div>

        <div className="relative flex-[2]">
          <Button
            type="button"
            disabled={!currentType}
            onClick={() => setOpenDropdown(openDropdown === 'destination' ? null : 'destination')}
            className={clsx(
              'flex items-center justify-between w-full p-2 border-2 rounded-md transition',
              !currentType
                ? 'border-gray-200 bg-gray-100 dark:bg-slate-900 dark:border-gray-700 cursor-not-allowed'
                : 'border-primary-base bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-100 cursor-pointer'
            )}
          >
            <span className={clsx(!currentDest && 'text-gray-400')}>{getDestinationLabel(currentType, currentDest)}</span>
            <ChevronDownIcon className="size-5" />
          </Button>

          {openDropdown === 'destination' && currentType && (
            <div className="absolute z-10 top-full left-0 w-full mt-1 max-h-[200px] overflow-y-auto bg-white dark:bg-slate-900 border border-gray-100 dark:border-gray-700 rounded-md shadow-xl scrollbar-hide">
              {cityOptions.map(([key, label]) => (
                <Button
                  key={key}
                  type="button"
                  onClick={() => handleDestSelect(key)}
                  className="block w-full p-2 text-left hover:bg-gray-100 dark:hover:bg-gray-800 text-slate-900 dark:text-slate-100"
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
        isValid={Boolean(currentType && currentDest)}
        setStep={setStep}
        currentStep={1}
        previousButtonText="이전"
        nextButtonText="다음"
      />
    </div>
  );
};

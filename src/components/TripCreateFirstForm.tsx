import { useState } from 'react';
import { DESTINATIONS, type RegionType } from '../constants/destinations.ts';
import { type TripFormValues } from '../schemas/tripSchema.ts';
import { type UseFormReturn } from 'react-hook-form';
import { ChevronDownIcon } from 'lucide-react';

export const TripCreateStepFirstForm = ({
  setStep,
  form,
}: {
  setStep: (step: number) => void;

  form: UseFormReturn<TripFormValues>;
}) => {
  const { setValue, watch, getValues } = form;
  const [isRegionSelectOpen, setIsRegionSelectOpen] = useState<boolean>(false);
  const [isDestinationSelectOpen, setIsDestinationSelectOpen] = useState<boolean>(false);

  const destination = watch('destination');
  const isStep1Valid = Boolean(destination);

  const [regionType, setRegionType] = useState<RegionType | ''>(() => {
    const savedDestination = getValues('destination');

    if (!savedDestination) return '';

    if (Object.keys(DESTINATIONS.domestic).includes(savedDestination)) {
      return 'domestic';
    }
    if (Object.keys(DESTINATIONS.overseas).includes(savedDestination)) {
      return 'overseas';
    }
    return '';
  });

  const destinationOptions = regionType ? Object.entries(DESTINATIONS[regionType]) : [];

  const isDestinationSelectDisabled = !regionType;
  return (
    <div className="flex flex-col h-full">
      <div className="flex gap-2 items-center mt-4 mx-4 min-h-[70px]">
        <h1 className="text-xl font-semibold">어디로 떠나시나요</h1>
        <p className="text-sm text-primary-base">필수</p>
      </div>
      <div className="mb-4 mx-4 flex gap-2">
        <div className="relative flex-[1]">
          <button
            type="button"
            onClick={() => setIsRegionSelectOpen(!isRegionSelectOpen)}
            className="flex items-center gap-2 border-2 border-gray-200 hover:border-primary-base cursor-pointer p-2 rounded-md justify-between w-full"
          >
            <span>
              {regionType === 'domestic'
                ? '국내'
                : regionType === 'overseas'
                  ? '해외'
                  : '국내/해외'}
            </span>
            <ChevronDownIcon className="size-5" />
          </button>
          {isRegionSelectOpen && (
            <div className="absolute z-10 top-full left-0 flex flex-col shadow-2xl w-full bg-white rounded-md p-1">
              <button
                type="button"
                onClick={() => {
                  setRegionType('domestic');
                  setIsRegionSelectOpen(false);
                  setValue('destination', '');
                }}
                className="mt-1 hover:bg-gray-100 block w-full text-left p-2 rounded-md"
              >
                국내
              </button>
              <button
                type="button"
                onClick={() => {
                  setRegionType('overseas');
                  setIsRegionSelectOpen(false);
                  setValue('destination', '');
                }}
                className="block w-full text-left p-2 rounded-md hover:bg-gray-100"
              >
                해외
              </button>
            </div>
          )}
        </div>
        <div className="relative flex-[2]">
          <button
            type="button"
            onClick={() => {
              if (isDestinationSelectDisabled) return;

              setIsDestinationSelectOpen(!isDestinationSelectOpen);
            }}
            className={`flex items-center justify-between gap-2 border-2 p-2 rounded-md transition w-full
${
  isDestinationSelectDisabled
    ? 'border-gray-200 bg-gray-100 text-gray-400 cursor-not-allowed'
    : 'border-primary-base cursor-pointer'
}
`}
          >
            <span>
              {destination
                ? DESTINATIONS[regionType as RegionType]?.[destination]
                : regionType === 'domestic'
                  ? '국내 도시 선택'
                  : regionType === 'overseas'
                    ? '해외 국가 선택'
                    : '도시/국가 선택'}
            </span>
            <ChevronDownIcon className="size-5" />
          </button>
          {isDestinationSelectOpen && (
            <div className="absolute z-10 top-full left-0 flex flex-col shadow-xl min-w-full bg-white rounded-md p-1 max-h-[200px] overflow-y-auto scrollbar-hide">
              {destinationOptions.map(([value, label]) => (
                <button
                  key={value}
                  type="button"
                  onClick={() => {
                    setValue('destination', value);

                    setIsDestinationSelectOpen(false);
                  }}
                  className="px-2 py-2 rounded-md hover:bg-gray-100 text-left cursor-pointer w-full"
                >
                  {label}
                </button>
              ))}
            </div>
          )}
        </div>
      </div>
      <div className="flex-1" />
      <div className="flex justify-center">
        <button
          type="submit"
          onClick={() => {
            if (!isStep1Valid) return;
            setStep(2);
          }}
          className={`
w-full py-2 rounded-md font-semibold transition m-4 cursor-pointer
${isStep1Valid ? 'bg-primary-base text-white' : 'bg-gray-200 text-gray-400 cursor-not-allowed'}
`}
        >
          다음
        </button>
      </div>
    </div>
  );
};

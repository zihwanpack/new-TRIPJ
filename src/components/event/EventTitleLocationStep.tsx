import { useEffect, useRef, useState } from 'react';
import { useDebounce } from '../../hooks/common/useDebounce.tsx';
import { Loader2 } from 'lucide-react';
import { useFormContext } from 'react-hook-form';
import type { EventFormValues } from '../../schemas/eventSchema.ts';
import { CTA } from '../common/CTA.tsx';
import { Input } from '../common/Input.tsx';
import { Typography } from '../common/Typography.tsx';
import { loadGoogleMaps } from '../../utils/trip/loadGoogleMaps.ts';

interface EventTitleLocationStepProps {
  setStep: (step: number) => void;
}

interface PlaceSuggestionWithAddress {
  placePrediction: google.maps.places.PlacePrediction;
  formattedAddress: string;
}

export const EventTitleLocationStep = ({ setStep }: EventTitleLocationStepProps) => {
  const {
    watch,
    formState: { errors },
    setValue,
    register,
  } = useFormContext<EventFormValues>();

  const [places, setPlaces] = useState<PlaceSuggestionWithAddress[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const isLocationSelectedRef = useRef<boolean>(false);
  const sessionTokenRef = useRef<google.maps.places.AutocompleteSessionToken | null>(null);

  const locationValue = watch('location');
  const debouncedSearchValue = useDebounce(locationValue, 500);

  useEffect(() => {
    if (isLocationSelectedRef.current) {
      isLocationSelectedRef.current = false;
      return;
    }
    const query = debouncedSearchValue?.trim();
    if (!query) {
      setPlaces([]);
      setIsDropdownOpen(false);
      return;
    }

    let cancelled = false;

    const search = async () => {
      await loadGoogleMaps();
      if (!window.google?.maps) return;

      setIsLoading(true);

      try {
        const { AutocompleteSuggestion, AutocompleteSessionToken } =
          (await window.google.maps.importLibrary('places')) as {
            AutocompleteSuggestion: typeof google.maps.places.AutocompleteSuggestion;
            AutocompleteSessionToken: typeof google.maps.places.AutocompleteSessionToken;
          };

        if (!sessionTokenRef.current) {
          sessionTokenRef.current = new AutocompleteSessionToken();
        }
        const { suggestions: fetchedSuggestions } =
          await AutocompleteSuggestion.fetchAutocompleteSuggestions({
            input: query,
            sessionToken: sessionTokenRef.current,
          });

        if (cancelled) return;

        const processedPlaces = await Promise.all(
          fetchedSuggestions.map(async (suggestion: google.maps.places.AutocompleteSuggestion) => {
            const placePrediction = suggestion.placePrediction;

            const place = placePrediction?.toPlace();
            await place?.fetchFields({
              fields: ['formattedAddress'],
            });

            return {
              placePrediction: placePrediction,
              formattedAddress: place?.formattedAddress,
            };
          })
        );

        setPlaces(processedPlaces as PlaceSuggestionWithAddress[]);
        setIsDropdownOpen(processedPlaces.length > 0);
      } catch (e) {
        console.error('Error fetching autocomplete suggestions:', e);
        setPlaces([]);
        setIsDropdownOpen(false);
      } finally {
        if (!cancelled) setIsLoading(false);
      }
    };

    search();

    return () => {
      cancelled = true;
    };
  }, [debouncedSearchValue]);

  const eventName = watch('eventName');
  const location = watch('location');
  const isEventTitleLocationStepValid = eventName?.length > 0 && location?.length > 0;

  const handleSelectPlace = (selectedAddress: string) => {
    setValue('location', selectedAddress);
    setIsDropdownOpen(false);
    isLocationSelectedRef.current = true;
    sessionTokenRef.current = null;
    setPlaces([]);
  };

  return (
    <div className="flex flex-col h-full">
      <div className="flex gap-2 items-center mt-4 mx-4 min-h-[70px]">
        <Typography variant="h1">이벤트 이름을 적어주세요</Typography>
        <Typography variant="body" color="primary">
          필수
        </Typography>
      </div>
      <div className="mx-4 mt-2 flex items-center gap-3 border border-gray-300 dark:border-gray-700 rounded-lg px-4 py-3 focus-within:ring-2 focus-within:ring-primary-base focus-within:border-transparent transition-all bg-white dark:bg-slate-900">
        <Input
          type="text"
          placeholder="예) 식당 예약"
          {...register('eventName')}
          containerClassName="w-full"
        />
      </div>
      <div className="mx-4 mt-1 min-h-[20px]">
        {errors.eventName && (
          <Typography variant="helper" color="error" className="pl-1">
            {errors.eventName.message}
          </Typography>
        )}
      </div>
      <div className="flex gap-2 items-center mt-4 mx-4 min-h-[70px]">
        <Typography variant="h1">장소를 검색해주세요</Typography>
        <Typography variant="body" color="primary">
          필수
        </Typography>
      </div>

      <div className="mx-4 mt-2 relative">
        <div className="flex items-center gap-3 border border-gray-300 dark:border-gray-700 rounded-lg px-4 py-3 focus-within:ring-2 focus-within:ring-primary-base focus-within:border-transparent transition-all bg-white dark:bg-slate-900">
          <Input
            type="text"
            {...register('location')}
            placeholder="예) 서울"
            autoComplete="off"
            containerClassName="w-full"
            className="w-full outline-none text-slate-700 dark:text-slate-100 placeholder:text-gray-300 dark:placeholder:text-gray-500 bg-transparent"
          />
          {isLoading && <Loader2 className="size-5 text-primary-base animate-spin" />}
        </div>
        {isDropdownOpen && places.length > 0 && (
          <ul className="absolute z-10 w-full bg-white dark:bg-slate-900 border border-gray-200 dark:border-gray-700 rounded-lg shadow-lg mt-1 max-h-48 overflow-y-auto">
            {places.map((placeItem) => (
              <li
                key={placeItem.placePrediction.placeId}
                onClick={() => handleSelectPlace(placeItem.formattedAddress)}
                className="px-4 py-3 hover:bg-gray-100 dark:hover:bg-slate-800 cursor-pointer text-sm text-slate-700 dark:text-slate-100 border-b border-gray-100 dark:border-gray-700 last:border-none"
              >
                <div className="font-semibold text-slate-800 dark:text-slate-100">
                  {placeItem.placePrediction.mainText?.text}
                </div>
                <div className="text-xs text-gray-500 dark:text-gray-500">
                  {placeItem.formattedAddress}
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>
      <div className="mx-4 mt-1 min-h-[20px]">
        {errors.location && <p className="text-sm text-red-500 pl-1">{errors.location.message}</p>}
      </div>
      <div className="flex-1" />
      <CTA
        isValid={isEventTitleLocationStepValid}
        setStep={setStep}
        currentStep={1}
        previousButtonText="이전"
        nextButtonText="다음"
      />
    </div>
  );
};

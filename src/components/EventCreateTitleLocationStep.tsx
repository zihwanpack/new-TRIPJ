import { useEffect, useRef, useState } from 'react';
import { useDebounce } from '../hooks/useDebounce.tsx';
import { Loader2 } from 'lucide-react';
import { useFormContext } from 'react-hook-form';
import type { EventFormValues } from '../schemas/eventSchema.ts';
import { CTA } from './CTA.tsx';

interface EventCreateTitleLocationStepProps {
  setStep: (step: number) => void;
}

interface PlaceSuggestionWithAddress {
  placePrediction: google.maps.places.PlacePrediction;
  formattedAddress: string;
}

export const EventCreateTitleLocationStep = ({ setStep }: EventCreateTitleLocationStepProps) => {
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

  const locationValue = watch('location');
  const debouncedSearchValue = useDebounce(locationValue, 500);

  const createMapSessionToken = () => {
    const existing = sessionStorage.getItem('mapSessionToken');

    if (existing) {
      return existing;
    }

    const token = new google.maps.places.AutocompleteSessionToken();
    sessionStorage.setItem('mapSessionToken', token.toString());
    return token;
  };

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
      if (!window.google?.maps) return;

      setIsLoading(true);

      try {
        const { AutocompleteSuggestion } = (await window.google.maps.importLibrary('places')) as {
          AutocompleteSuggestion: typeof google.maps.places.AutocompleteSuggestion;
        };
        const sessionToken = createMapSessionToken();
        const { suggestions: fetchedSuggestions } =
          await AutocompleteSuggestion.fetchAutocompleteSuggestions({
            input: query,
            sessionToken: sessionToken,
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
  const isStep1Valid = eventName?.length > 0 && location?.length > 0;

  const handleSelectPlace = (selectedAddress: string) => {
    setValue('location', selectedAddress);
    setIsDropdownOpen(false);
    isLocationSelectedRef.current = true;
    sessionStorage.removeItem('mapSessionToken');
    setPlaces([]);
  };

  return (
    <div className="flex flex-col h-full">
      <div className="flex gap-2 items-center mt-4 mx-4 min-h-[70px]">
        <h1 className="text-xl font-semibold">이벤트 이름을 적어주세요</h1>
        <p className="text-sm text-primary-base">필수</p>
      </div>
      <div className="mx-4 mt-2 flex items-center gap-3 border border-gray-300 rounded-lg px-4 py-3 focus-within:ring-2 focus-within:ring-primary-base focus-within:border-transparent transition-all bg-white">
        <input
          type="text"
          {...register('eventName')}
          placeholder="예) 식당 예약"
          className="w-full outline-none text-slate-700 placeholder:text-gray-300"
        />
      </div>
      <div className="mx-4 mt-1 min-h-[20px]">
        {errors.eventName && (
          <p className="text-sm text-red-500 pl-1">{errors.eventName.message}</p>
        )}
      </div>
      <div className="flex gap-2 items-center mt-4 mx-4 min-h-[70px]">
        <h1 className="text-xl font-semibold">장소를 검색해주세요</h1>
        <p className="text-sm text-primary-base">필수</p>
      </div>

      <div className="mx-4 mt-2 relative">
        <div className="flex items-center gap-3 border border-gray-300 rounded-lg px-4 py-3 focus-within:ring-2 focus-within:ring-primary-base focus-within:border-transparent transition-all bg-white">
          <input
            type="text"
            {...register('location')}
            placeholder="예) 서울"
            autoComplete="off"
            className="w-full outline-none text-slate-700 placeholder:text-gray-300"
          />
          {isLoading && <Loader2 className="size-5 text-primary-base animate-spin" />}
        </div>
        {isDropdownOpen && places.length > 0 && (
          <ul className="absolute z-10 w-full bg-white border border-gray-200 rounded-lg shadow-lg mt-1 max-h-48 overflow-y-auto">
            {places.map((placeItem) => (
              <li
                key={placeItem.placePrediction.placeId}
                onClick={() => handleSelectPlace(placeItem.formattedAddress)} // formattedAddress 전달
                className="px-4 py-3 hover:bg-gray-100 cursor-pointer text-sm text-slate-700 border-b last:border-none"
              >
                <div className="font-semibold">{placeItem.placePrediction.mainText?.text}</div>
                <div className="text-xs text-gray-500">{placeItem.formattedAddress}</div>
              </li>
            ))}
          </ul>
        )}
      </div>
      <div className="mx-4 mt-1 min-h-[20px]">
        {errors.location && <p className="text-sm text-red-500 pl-1">{errors.location.message}</p>}
      </div>
      <div className="flex-1" />
      <CTA isValid={isStep1Valid} setStep={setStep} currentStep={1} />
    </div>
  );
};

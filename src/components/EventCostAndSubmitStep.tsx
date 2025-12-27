import { useFormContext } from 'react-hook-form';
import type { EventFormValues } from '../schemas/eventSchema.ts';
import { CTA } from './CTA.tsx';
import { Trash2, Plus, ChevronDownIcon } from 'lucide-react';
import { Button } from './Button.tsx';
import { useState } from 'react';
import { produce } from 'immer';
import { useCreateAction } from '../hooks/useCreateAction.tsx';
import { createEventApi } from '../api/event.ts';
import { EVENT_CREATE_STEP_KEY, EVENT_CREATE_STORAGE_KEY } from '../constants/event.ts';
import { useNavigate, useParams } from 'react-router-dom';
import { Input } from './Input.tsx';

const COST_CATEGORIES = ['식비', '교통비', '숙박비', '기타'];

interface EventCostAndSubmitStepProps {
  setStep: (step: number) => void;
}

export const EventCostAndSubmitStep = ({ setStep }: EventCostAndSubmitStepProps) => {
  const { watch, setValue, getValues } = useFormContext<EventFormValues>();
  const [openIndex, setOpenIndex] = useState<number | null>(null);
  const navigate = useNavigate();
  const { tripId } = useParams();
  const costs = watch('cost');

  const addCost = () => {
    setValue(
      'cost',
      produce<EventFormValues['cost']>(costs, (draft) => {
        draft.push({ category: '', value: 0 });
      })
    );
  };

  const updateCost = (index: number, updated: Partial<(typeof costs)[number]>) => {
    setValue(
      'cost',
      produce<EventFormValues['cost']>(costs, (draft) => {
        draft[index] = { ...draft[index], ...updated };
      })
    );
  };

  const removeCost = (index: number) => {
    setValue(
      'cost',
      produce<EventFormValues['cost']>(costs, (draft) => {
        draft.splice(index, 1);
      })
    );
  };
  const {
    execute,
    isLoading: isCreateEventLoading,
    error: createEventError,
  } = useCreateAction(createEventApi);

  const handleCreateEvent = async () => {
    const formData = getValues();
    const { eventId } = await execute({ ...formData, tripId: Number(tripId) });

    sessionStorage.removeItem(EVENT_CREATE_STEP_KEY);
    sessionStorage.removeItem(EVENT_CREATE_STORAGE_KEY);
    navigate(`/trips/${tripId}/events/${eventId}`);
  };

  return (
    <div className="flex flex-col h-full">
      <div className="flex gap-2 items-center mt-4 mx-4 min-h-[70px]">
        <h1 className="text-xl font-semibold">경비</h1>
        <p className="text-sm text-primary-base">필수</p>
      </div>
      <div className="mx-4 space-y-3">
        {costs.map((item, index) => (
          <div key={index} className="flex gap-2 items-center">
            <div className="relative flex-1">
              <Button
                type="button"
                onClick={() => setOpenIndex(openIndex === index ? null : index)}
                className={`
          flex items-center justify-between gap-2
          border-2 rounded-xl p-3 w-full text-sm
          ${item.category ? 'border-primary-base text-black' : 'border-gray-200 text-gray-400'}
        `}
              >
                <span>{item.category || '항목 선택'}</span>
                <ChevronDownIcon className="size-4" />
              </Button>

              {openIndex === index && (
                <div className="absolute z-10 top-full left-0 mt-1 w-full bg-white rounded-xl shadow-xl p-1">
                  {COST_CATEGORIES.map((cost) => (
                    <Button
                      key={cost}
                      type="button"
                      onClick={() => {
                        updateCost(index, { category: cost });
                        setOpenIndex(null);
                      }}
                      className="w-full text-left px-3 py-2 rounded-lg hover:bg-gray-100"
                    >
                      {cost}
                    </Button>
                  ))}
                </div>
              )}
            </div>

            <div className="flex items-center flex-1 border rounded-xl px-3">
              <Input
                type="text"
                inputMode="numeric"
                placeholder="0"
                value={item.value ? String(item.value) : ''}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                  updateCost(index, { value: Number(e.target.value) })
                }
                className="py-3 text-right"
              />
              <span className="ml-1 text-sm text-gray-500">원</span>
            </div>

            <Button
              type="button"
              onClick={() => removeCost(index)}
              className="p-3 rounded-xl bg-gray-100 hover:bg-gray-200"
            >
              <Trash2 size={18} />
            </Button>
          </div>
        ))}
      </div>
      <Button
        type="button"
        onClick={addCost}
        className="mx-4 mt-4 py-4 rounded-xl bg-gray-100 flex items-center justify-center gap-2 text-sm font-medium"
      >
        <Plus size={16} /> 경비 추가
      </Button>
      <div className="mx-4 mt-1 min-h-[20px]">
        {createEventError && (
          <p className="text-sm text-red-500 pl-1">{createEventError.message}</p>
        )}
      </div>
      <div className="flex-1" />

      <CTA
        setStep={setStep}
        currentStep={3}
        isLastStep={true}
        isNecessary={false}
        isLoading={isCreateEventLoading}
        onSubmit={handleCreateEvent}
      />
    </div>
  );
};

import { useFormContext } from 'react-hook-form';
import type { EventFormValues } from '../../schemas/eventSchema.ts';
import { CTA } from '../common/CTA.tsx';
import { Trash2, Plus, ChevronDownIcon } from 'lucide-react';
import { Button } from '../common/Button.tsx';
import { useState } from 'react';
import { produce } from 'immer';
import { EVENT_CREATE_STEP_KEY, EVENT_CREATE_STORAGE_KEY } from '../../constants/event.ts';
import { useNavigate, useParams } from 'react-router-dom';
import { Input } from '../common/Input.tsx';
import toast from 'react-hot-toast';
import clsx from 'clsx';
import { Typography } from '../common/Typography.tsx';
import { createEventApi, updateEventApi } from '../../api/event.ts';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { eventQueryKeys } from '../../constants/queryKeys.ts';

const COST_CATEGORIES = ['식비', '교통비', '숙박비', '기타'];

interface EventCostAndSubmitStepProps {
  setStep: (step: number) => void;
  mode: 'create' | 'edit';
}

export const EventCostAndSubmitStep = ({ setStep, mode }: EventCostAndSubmitStepProps) => {
  const { watch, setValue, getValues } = useFormContext<EventFormValues>();
  const [openIndex, setOpenIndex] = useState<number | null>(null);
  const navigate = useNavigate();
  const { tripId } = useParams();
  const { eventId } = useParams();
  const eventIdNumber = Number(eventId!);
  const tripIdNumber = Number(tripId!);
  const costs = watch('cost');
  const queryClient = useQueryClient();

  const {
    mutate: createEvent,
    isPending: isCreateEventPending,
    error: createEventError,
  } = useMutation({
    mutationFn: (data: EventFormValues) => createEventApi({ ...data, tripId: tripIdNumber }),
    onSuccess: (createdEvent) => {
      sessionStorage.removeItem(EVENT_CREATE_STEP_KEY);
      sessionStorage.removeItem(EVENT_CREATE_STORAGE_KEY);

      queryClient.invalidateQueries({
        queryKey: eventQueryKeys.list(tripIdNumber),
      });

      toast.success('이벤트 생성에 성공했습니다.');
      navigate(`/trips/${tripIdNumber}/events/${createdEvent.eventId}`);
    },
    onError: (error) => {
      toast.error(`이벤트 생성에 실패했습니다. : ${error.message}`);
    },
  });

  const {
    mutate: updateEvent,
    isPending: isUpdateEventPending,
    error: updateEventError,
  } = useMutation({
    mutationFn: (data: EventFormValues) =>
      updateEventApi({
        eventId: eventIdNumber,
        body: { ...data, tripId: tripIdNumber },
      }),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: eventQueryKeys.detail(eventIdNumber),
      });

      toast.success('이벤트 수정에 성공했습니다.');
      navigate(`/trips/${tripIdNumber}/events/${eventIdNumber}`);
    },
    onError: (error) => {
      toast.error(`이벤트 수정에 실패했습니다. : ${error.message}`);
    },
  });

  const isLoading = mode === 'create' ? isCreateEventPending : isUpdateEventPending;
  const error = mode === 'create' ? createEventError : updateEventError;

  const addCost = () => {
    setValue(
      'cost',
      produce<EventFormValues['cost']>(costs, (draft) => {
        draft.push({ id: Date.now(), category: '', value: 0 });
      })
    );
  };

  const updateCost = (id: number, updated: Partial<(typeof costs)[number]>) => {
    setValue(
      'cost',
      produce(costs, (draft) => {
        const index = draft.findIndex((item) => item.id === id);
        if (index !== -1) {
          draft[index] = { ...draft[index], ...updated };
        }
      })
    );
  };

  const removeCost = (id: number) => {
    setValue(
      'cost',
      produce<EventFormValues['cost']>(costs, (draft) => {
        draft.splice(
          draft.findIndex((item) => item.id === id),
          1
        );
      })
    );
  };

  const handleCreateEvent = async () => {
    const formData = getValues();
    createEvent(formData);
  };

  const handleUpdateEvent = async () => {
    const formData = getValues();
    updateEvent(formData);
  };

  return (
    <div className="flex flex-col h-full">
      <div className="flex gap-2 items-center mt-4 mx-4 min-h-[70px]">
        <Typography variant="h1">경비</Typography>
        <Typography variant="body" color="primary">
          선택
        </Typography>
      </div>
      <div className="mx-4 space-y-3">
        {costs.map((item) => (
          <div key={item.id} className="flex gap-2 items-center">
            <div className="relative flex-1">
              <Button
                type="button"
                onClick={() => setOpenIndex(openIndex === item.id ? null : item.id)}
                className={clsx(
                  'flex items-center justify-between gap-2 border-2 rounded-xl p-3 w-full text-sm bg-white dark:bg-slate-900',
                  item.category
                    ? 'border-primary-base text-black dark:text-slate-100'
                    : 'border-gray-200 dark:border-gray-700 text-gray-400 dark:text-gray-500'
                )}
              >
                <span>{item.category || '항목 선택'}</span>
                <ChevronDownIcon className="size-4" />
              </Button>

              {openIndex === item.id && (
                <div className="absolute z-10 top-full left-0 mt-1 w-full bg-white dark:bg-slate-900 rounded-xl shadow-xl p-1 border border-gray-100 dark:border-gray-700">
                  {COST_CATEGORIES.map((cost) => (
                    <Button
                      key={cost}
                      type="button"
                      onClick={() => {
                        updateCost(item.id, { category: cost });
                        setOpenIndex(null);
                      }}
                      className="w-full text-left px-3 py-2 rounded-lg hover:bg-gray-100 dark:hover:bg-slate-800"
                    >
                      {cost}
                    </Button>
                  ))}
                </div>
              )}
            </div>

            <div className="flex items-center flex-1 border border-gray-200 dark:border-gray-700 rounded-xl px-3 bg-white dark:bg-slate-900">
              <Input
                type="text"
                inputMode="numeric"
                placeholder="0"
                value={item.value ? String(item.value) : ''}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                  updateCost(item.id, { value: Number(e.target.value) })
                }
                className="py-3 text-right"
              />
              <span className="ml-1 text-sm text-gray-500 dark:text-gray-400">원</span>
            </div>

            <Button
              type="button"
              onClick={() => removeCost(item.id)}
              className="p-3 rounded-xl bg-gray-100 dark:bg-slate-800 hover:bg-gray-200 dark:hover:bg-slate-700"
            >
              <Trash2 size={18} />
            </Button>
          </div>
        ))}
      </div>
      <Button
        type="button"
        onClick={addCost}
        className="mx-4 mt-4 py-4 rounded-xl bg-gray-100 dark:bg-slate-800 flex items-center justify-center gap-2 text-sm font-medium text-slate-900 dark:text-slate-100"
      >
        <Plus size={16} /> 경비 추가
      </Button>
      <div className="mx-4 mt-1 min-h-[20px]">
        {error && <p className="text-sm text-red-500 pl-1">{error.message}</p>}
      </div>
      <div className="flex-1" />

      <CTA
        setStep={setStep}
        currentStep={3}
        isLastStep={true}
        isNecessary={false}
        isLoading={isLoading}
        onSubmit={mode === 'create' ? handleCreateEvent : handleUpdateEvent}
        previousButtonText="이전"
        nextButtonText={mode === 'create' ? '추가하기' : '수정하기'}
      />
    </div>
  );
};

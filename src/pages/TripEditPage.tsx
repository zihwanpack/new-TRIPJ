import { useNavigate, useParams } from 'react-router-dom';
import { TripFormTemplate } from '../components/trip/TripFormTemplate.tsx';
import { useEffect, useState } from 'react';
import { tripFormSchema, type TripFormValues } from '../schemas/tripSchema.ts';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { FullscreenLoader } from '../components/common/FullscreenLoader.tsx';
import { tripQueryKeys } from '../constants/queryKeys.ts';
import { getTripDetailApi } from '../api/trip.ts';
import { useQuery } from '@tanstack/react-query';
export const TripEditPage = () => {
  const navigate = useNavigate();
  const { tripId } = useParams();
  const tripIdNumber = Number(tripId);
  const [step, setStep] = useState(1);

  const {
    data: tripDetail,
    isPending: isTripDetailPending,
    isError: isTripDetailError,
    error: tripDetailError,
  } = useQuery({
    queryKey: tripQueryKeys.detail(tripIdNumber),
    queryFn: () => getTripDetailApi({ id: tripIdNumber }),
    enabled: !!tripIdNumber,
    staleTime: 5 * 60 * 1000,
    gcTime: 30 * 60 * 1000,
  });

  const defaultValues = {
    destinationType: '',
    destination: '',
    startDate: '',
    endDate: '',
    members: [],
    title: '',
    createdBy: '',
  };

  const form = useForm<TripFormValues>({
    resolver: zodResolver(tripFormSchema),
    mode: 'onChange',
    defaultValues: defaultValues as TripFormValues,
  });

  useEffect(() => {
    if (!tripDetail) return;

    form.reset({
      destinationType: tripDetail.destinationType,
      destination: tripDetail.destination,
      startDate: tripDetail.startDate,
      endDate: tripDetail.endDate,
      members: tripDetail.members,
      title: tripDetail.title,
      createdBy: tripDetail.createdBy,
    });
  }, [tripDetail, form]);

  if (isTripDetailPending) {
    return <FullscreenLoader />;
  }

  if (isTripDetailError) {
    return <div>에러가 발생했습니다: {tripDetailError?.message}</div>;
  }

  const handleCloseForm = () => {
    navigate(`/trips/${tripId}`);
  };

  return (
    <TripFormTemplate
      mode="edit"
      step={step}
      headerTitle="여행 정보 수정"
      setStep={setStep}
      handleCloseForm={handleCloseForm}
      form={form}
    />
  );
};

import { useNavigate, useParams } from 'react-router-dom';
import { fetchTripDetail, type TripState } from '../redux/slices/tripSlice.ts';
import { useDispatch, useSelector } from '../redux/hooks/useCustomRedux.tsx';
import { TripFormTemplate } from '../components/TripFormTemplate.tsx';
import { useEffect, useState } from 'react';
import { tripSchema, type TripFormValues } from '../schemas/tripSchema.ts';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { FullscreenLoader } from '../components/FullscreenLoader.tsx';

export const TripEditPage = () => {
  const navigate = useNavigate();
  const { tripId } = useParams();
  const [step, setStep] = useState(1);
  const { tripDetail, isTripDetailLoading, tripDetailError } = useSelector(
    (state: { trip: TripState }) => state.trip
  );
  const dispatch = useDispatch();

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
    resolver: zodResolver(tripSchema),
    mode: 'onChange',
    defaultValues: defaultValues as TripFormValues,
  });

  useEffect(() => {
    if (tripId) {
      dispatch(fetchTripDetail({ id: Number(tripId) }));
    }
  }, [dispatch, tripId]);

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

  if (isTripDetailLoading) {
    return <FullscreenLoader />;
  }

  if (tripDetailError) {
    return <div>여행 정보를 불러올 수 없습니다.</div>;
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

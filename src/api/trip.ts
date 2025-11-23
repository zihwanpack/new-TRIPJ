import { httpClient } from './http/httpClient.ts';

export const getTrips = async () => {
  const { data } = await httpClient.get('/trips');

  return data;
};

export const getTrip = async (id: string) => {
  const { data } = await httpClient.get(`/trips/${id}`);

  return data;
};

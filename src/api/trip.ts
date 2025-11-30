import { httpClient } from './http/httpClient.ts';

export const getMyAllTripsApi = async () => {
  const { data } = await httpClient.get('/trips');

  return data;
};

export const getMyTripByIdApi = async (id: string) => {
  const { data } = await httpClient.get(`/trips/${id}`);

  return data;
};

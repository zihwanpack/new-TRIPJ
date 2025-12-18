import { httpClient } from './http/httpClient.ts';
import type { Trip } from '../types/trip.ts';
import TripError from '../errors/TripError.ts';
import { AxiosError } from 'axios';
import type { TripCreateRequest } from '../types/trip.ts';

const getMyAllTripsApi = async (id: string): Promise<Trip[]> => {
  try {
    const { data } = await httpClient.get<Trip[]>(`/trips/user/${id}`);
    return data;
  } catch (error: unknown) {
    if (error instanceof AxiosError) {
      const status = error.response?.status ?? 500;
      const message = error.response?.data?.message ?? error.message;
      throw new TripError(message, status);
    }
    throw new TripError('An unknown error occurred', 500);
  }
};

const createTripApi = async (trip: TripCreateRequest): Promise<Trip> => {
  try {
    const { data } = await httpClient.post<Trip>('/trips', trip);
    return data;
  } catch (error: unknown) {
    if (error instanceof AxiosError) {
      const status = error.response?.status ?? 500;
      const message = error.response?.data?.message ?? error.message;
      throw new TripError(message, status);
    }
    throw new TripError('An unknown error occurred', 500);
  }
};

const getTripDetailApi = async (id: number): Promise<Trip> => {
  try {
    const { data } = await httpClient.get<Trip>(`/trips/${id}`);
    return data;
  } catch (error: unknown) {
    if (error instanceof AxiosError) {
      const status = error.response?.status ?? 500;
      const message = error.response?.data?.message ?? error.message;
      throw new TripError(message, status);
    }
    throw new TripError('An unknown error occurred', 500);
  }
};

const deleteTripApi = async (id: number): Promise<void> => {
  try {
    await httpClient.delete(`/trips/${id}`);
  } catch (error: unknown) {
    if (error instanceof AxiosError) {
      const status = error.response?.status ?? 500;
      const message = error.response?.data?.message ?? error.message;
      throw new TripError(message, status);
    }
    throw new TripError('An unknown error occurred', 500);
  }
};

export { getMyAllTripsApi, createTripApi, getTripDetailApi, deleteTripApi };

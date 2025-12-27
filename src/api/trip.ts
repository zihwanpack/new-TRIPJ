import { authenticatedClient } from './client/authenticatedClient.ts';
import type {
  CreateTripRequest,
  CreateTripResponse,
  DeleteTripResponse,
  GetMyAllTripsResponse,
  GetMyOnGoingTripResponse,
  GetMyPastTripsResponse,
  GetMyUpcomingTripsResponse,
  GetTripDetailResponse,
  Trip,
} from '../types/trip.ts';
import { TripError } from '../errors/customErrors.ts';
import { requestHandler } from './util/requestHandler.ts';

type GetMyAllTripsParams = {
  id: string;
};

export const getMyAllTripsApi = async ({ id }: GetMyAllTripsParams): Promise<Trip[]> => {
  return requestHandler(
    () => authenticatedClient.get<GetMyAllTripsResponse>(`/trips/user/${id}`),
    TripError
  );
};

export const createTripApi = async (trip: CreateTripRequest): Promise<Trip> => {
  return requestHandler(
    () => authenticatedClient.post<CreateTripResponse>('/trips', trip),
    TripError
  );
};

type GetTripDetailParams = {
  id: number;
};

export const getTripDetailApi = async ({ id }: GetTripDetailParams): Promise<Trip> => {
  return requestHandler(
    () => authenticatedClient.get<GetTripDetailResponse>(`/trips/${id}`),
    TripError
  );
};

type DeleteTripParams = {
  id: number;
};

export const deleteTripApi = async ({ id }: DeleteTripParams): Promise<null> => {
  return requestHandler(
    () => authenticatedClient.delete<DeleteTripResponse>(`/trips/${id}`),
    TripError
  );
};

type GetMyPastTripsParams = {
  id: string;
};

export const getMyPastTripsApi = async ({ id }: GetMyPastTripsParams): Promise<Trip[]> => {
  return requestHandler(
    () => authenticatedClient.get<GetMyPastTripsResponse>(`/trips/user/${id}/past`),
    TripError
  );
};

type GetMyOnGoingTripParams = {
  id: string;
};

export const getMyOnGoingTripApi = async ({ id }: GetMyOnGoingTripParams): Promise<Trip> => {
  return requestHandler(
    () => authenticatedClient.get<GetMyOnGoingTripResponse>(`/trips/user/${id}/current`),
    TripError
  );
};

type GetMyUpcomingTripsParams = {
  id: string;
};

export const getMyUpcomingTripsApi = async ({ id }: GetMyUpcomingTripsParams): Promise<Trip[]> => {
  return requestHandler(
    () => authenticatedClient.get<GetMyUpcomingTripsResponse>(`/trips/user/${id}/upcoming`),
    TripError
  );
};

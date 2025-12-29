import { authenticatedClient } from './client/authenticatedClient.ts';
import type {
  CreateTripRequest,
  CreateTripResponse,
  DeleteTripParam,
  DeleteTripResponse,
  GetMyOnGoingTripParam,
  GetMyOnGoingTripResponse,
  GetMyPastTripsParam,
  GetMyPastTripsResponse,
  GetMyUpcomingTripsParam,
  GetMyUpcomingTripsResponse,
  GetTripDetailParam,
  GetTripDetailResponse,
  Trip,
} from '../types/trip.ts';
import { TripError } from '../errors/customErrors.ts';
import { requestHandler } from './util/requestHandler.ts';

export const createTripApi = async (trip: CreateTripRequest): Promise<Trip> => {
  return requestHandler(
    () => authenticatedClient.post<CreateTripResponse>('/trips', trip),
    TripError
  );
};

export const getTripDetailApi = async ({ id }: GetTripDetailParam): Promise<Trip> => {
  return requestHandler(
    () => authenticatedClient.get<GetTripDetailResponse>(`/trips/${id}`),
    TripError
  );
};

export const deleteTripApi = async ({ id }: DeleteTripParam): Promise<null> => {
  return requestHandler(
    () => authenticatedClient.delete<DeleteTripResponse>(`/trips/${id}`),
    TripError
  );
};

export const getMyPastTripsApi = async ({ id }: GetMyPastTripsParam): Promise<Trip[]> => {
  return requestHandler(
    () => authenticatedClient.get<GetMyPastTripsResponse>(`/trips/user/${id}/past`),
    TripError
  );
};

export const getMyOnGoingTripApi = async ({ id }: GetMyOnGoingTripParam): Promise<Trip> => {
  return requestHandler(
    () => authenticatedClient.get<GetMyOnGoingTripResponse>(`/trips/user/${id}/current`),
    TripError
  );
};

export const getMyUpcomingTripsApi = async ({ id }: GetMyUpcomingTripsParam): Promise<Trip[]> => {
  return requestHandler(
    () => authenticatedClient.get<GetMyUpcomingTripsResponse>(`/trips/user/${id}/upcoming`),
    TripError
  );
};

import { authenticatedClient } from './client/authenticatedClient.ts';
import type {
  CreateTripRequest,
  CreateTripResponse,
  DeleteTripParam,
  DeleteTripResponse,
  GetMyOnGoingTripParam,
  GetMyOnGoingTripResponse,
  GetMyPastTripsByCursorParam,
  GetMyPastTripsByCursorResponse,
  GetMyPastTripsParam,
  GetMyPastTripsResponse,
  GetMyUpcomingTripsByCursorParam,
  GetMyUpcomingTripsByCursorResponse,
  GetMyUpcomingTripsParam,
  GetMyUpcomingTripsResponse,
  GetTripDetailParam,
  GetTripDetailResponse,
  Trip,
  UpdateTripParam,
  UpdateTripResponse,
} from '../types/trip.ts';
import { TripError } from '../errors/customErrors.ts';
import { requestHandler } from './util/requestHandler.ts';

export const createTripApi = async (body: CreateTripRequest): Promise<Trip> => {
  return requestHandler(
    () => authenticatedClient.post<CreateTripResponse>('/trips', body),
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

export const getMyPastTripsCursorApi = async ({
  id,
  cursor,
  limit,
}: GetMyPastTripsByCursorParam): Promise<GetMyPastTripsByCursorResponse['result']> => {
  return requestHandler(
    () =>
      authenticatedClient.get<GetMyPastTripsByCursorResponse>(`/trips/user/${id}/past/cursor`, {
        params: {
          cursor,
          limit,
        },
      }),
    TripError
  );
};

export const getMyUpcomingTripsCursorApi = async ({
  id,
  cursor,
  limit,
}: GetMyUpcomingTripsByCursorParam): Promise<GetMyUpcomingTripsByCursorResponse['result']> => {
  return requestHandler(
    () =>
      authenticatedClient.get<GetMyUpcomingTripsByCursorResponse>(
        `/trips/user/${id}/upcoming/cursor`,
        {
          params: {
            cursor,
            limit,
          },
        }
      ),
    TripError
  );
};

export const updateTripApi = async ({ id, body }: UpdateTripParam): Promise<Trip> => {
  return requestHandler(
    () => authenticatedClient.patch<UpdateTripResponse>(`/trips/${id}`, body),
    TripError
  );
};

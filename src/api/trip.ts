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
import { tripSchema, tripListSchema, tripListWithCursorSchema } from '../schemas/tripSchema.ts';
export const createTripApi = async (body: CreateTripRequest): Promise<Trip> => {
  return requestHandler({
    request: () => authenticatedClient.post<CreateTripResponse>('/trips', body),
    ErrorClass: TripError,
    schema: tripSchema,
  });
};

export const getTripDetailApi = async ({ id }: GetTripDetailParam): Promise<Trip> => {
  return requestHandler({
    request: () => authenticatedClient.get<GetTripDetailResponse>(`/trips/${id}`),
    ErrorClass: TripError,
    schema: tripSchema,
  });
};

export const deleteTripApi = async ({ id }: DeleteTripParam): Promise<null> => {
  return requestHandler({
    request: () => authenticatedClient.delete<DeleteTripResponse>(`/trips/${id}`),
    ErrorClass: TripError,
  });
};

export const getMyPastTripsApi = async ({ userId }: GetMyPastTripsParam): Promise<Trip[]> => {
  return requestHandler({
    request: () => authenticatedClient.get<GetMyPastTripsResponse>(`/trips/user/${userId}/past`),
    ErrorClass: TripError,
    schema: tripListSchema,
  });
};

export const getMyOnGoingTripApi = async ({ userId }: GetMyOnGoingTripParam): Promise<Trip> => {
  return requestHandler({
    request: () =>
      authenticatedClient.get<GetMyOnGoingTripResponse>(`/trips/user/${userId}/current`),
    ErrorClass: TripError,
    schema: tripSchema,
  });
};

export const getMyUpcomingTripsApi = async ({
  userId,
}: GetMyUpcomingTripsParam): Promise<Trip[]> => {
  return requestHandler({
    request: () =>
      authenticatedClient.get<GetMyUpcomingTripsResponse>(`/trips/user/${userId}/upcoming`),
    ErrorClass: TripError,
    schema: tripListSchema,
  });
};

export const getMyPastTripsCursorApi = async ({
  userId,
  cursor,
  limit,
}: GetMyPastTripsByCursorParam): Promise<GetMyPastTripsByCursorResponse['result']> => {
  return requestHandler({
    request: () =>
      authenticatedClient.get<GetMyPastTripsByCursorResponse>(`/trips/user/${userId}/past/cursor`, {
        params: {
          cursor,
          limit,
        },
      }),
    ErrorClass: TripError,
    schema: tripListWithCursorSchema,
  });
};

export const getMyUpcomingTripsCursorApi = async ({
  userId,
  cursor,
  limit,
}: GetMyUpcomingTripsByCursorParam): Promise<GetMyUpcomingTripsByCursorResponse['result']> => {
  return requestHandler({
    request: () =>
      authenticatedClient.get<GetMyUpcomingTripsByCursorResponse>(
        `/trips/user/${userId}/upcoming/cursor`,
        {
          params: {
            cursor,
            limit,
          },
        }
      ),
    ErrorClass: TripError,
    schema: tripListWithCursorSchema,
  });
};

export const updateTripApi = async ({ id, body }: UpdateTripParam): Promise<Trip> => {
  return requestHandler({
    request: () => authenticatedClient.patch<UpdateTripResponse>(`/trips/${id}`, body),
    ErrorClass: TripError,
    schema: tripSchema,
  });
};

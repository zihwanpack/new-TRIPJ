import type { DestinationKey } from '../constants/tripImages.ts';
import type { CursorResponse, SuccessResponse } from './defaultResponse.ts';

export type DestinationType = 'domestic' | 'overseas';

export type Trip = {
  id: number;
  title: string;
  destination: DestinationKey;
  destinationType: DestinationType;
  startDate: string;
  endDate: string;
  members?: string[];
  createdBy?: string;
};

export type TripsResponse = SuccessResponse<Trip[]>;

export type GetMyPastTripsResponse = TripsResponse;
export type GetMyOnGoingTripResponse = TripResponse;
export type GetMyUpcomingTripsResponse = TripsResponse;

export type TripResponse = SuccessResponse<Trip>;

export type CreateTripResponse = TripResponse;
export type CreateTripRequest = Omit<Trip, 'id'>;

export type GetTripDetailResponse = TripResponse;

export type DeleteTripResponse = SuccessResponse<null>;

export type GetTripDetailParam = {
  tripId: number;
};

export type DeleteTripParam = GetTripDetailParam;

export type GetMyPastTripsParam = {
  userId: string;
};

export type GetMyOnGoingTripParam = GetMyPastTripsParam;

export type GetMyUpcomingTripsParam = GetMyPastTripsParam;

export type GetMyPastTripsByCursorParam = {
  userId: string;
  cursor: number | null;
  limit?: number;
};

export type GetMyPastTripsByCursorResponse = CursorResponse<Trip>;

export type GetMyUpcomingTripsByCursorParam = GetMyPastTripsByCursorParam;

export type GetMyUpcomingTripsByCursorResponse = GetMyPastTripsByCursorResponse;

export type UpdateTripRequest = CreateTripRequest;

export type UpdateTripParam = GetTripDetailParam & {
  body: UpdateTripRequest;
};

export type UpdateTripResponse = SuccessResponse<Trip>;

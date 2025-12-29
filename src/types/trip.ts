import type { DestinationKey } from '../constants/tripImages.ts';
import type { SuccessResponse } from './defaultResponse.ts';

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
  id: number;
};

export type DeleteTripParam = GetTripDetailParam;

export type GetMyPastTripsParam = GetTripDetailParam;

export type GetMyOnGoingTripParam = GetTripDetailParam;

export type GetMyUpcomingTripsParam = GetTripDetailParam;

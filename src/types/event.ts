import type { Cost } from './cost.ts';
import type { SuccessResponse } from './defaultResponse.ts';

export type Event = {
  eventId: number;
  tripId: number;
  eventName: string;
  location: string;
  startDate: string;
  endDate: string;
  cost: Cost[];
  latitude?: number;
  longitude?: number;
  placeImage?: string;
};

export type GetMyAllEventsResponse = SuccessResponse<Event[]>;
export type EventResponse = SuccessResponse<Event>;

export type CreateEventResponse = EventResponse;
export type CreateEventRequest = Omit<Event, 'eventId'>;

export type GetEventDetailParams = {
  eventId: number;
};

export type GetEventDetailResponse = SuccessResponse<Event>;

export type GetMyAllEventsParam = {
  tripId: number;
};

export type GetEventDetailParam = {
  eventId: number;
};

export type DeleteEventParam = GetEventDetailParam;

export type DeleteEventResponse = SuccessResponse<null>;

export type UpdateEventRequest = Omit<Event, 'eventId'>;
export type UpdateEventParam = GetEventDetailParam & {
  body: UpdateEventRequest;
};
export type UpdateEventResponse = SuccessResponse<Event>;

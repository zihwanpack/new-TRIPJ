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
};

export type GetMyAllEventsResponse = SuccessResponse<Event[]>;
export type EventResponse = SuccessResponse<Event>;

export type CreateEventResponse = EventResponse;
export type CreateEventRequest = Omit<Event, 'eventId'>;

export type GetEventDetailParams = {
  id: number;
};

export type GetEventDetailResponse = SuccessResponse<Event>;

export type GetMyAllEventsParam = {
  tripId: number;
};

export type GetEventDetailParam = {
  id: number;
};

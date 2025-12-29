import { authenticatedClient } from './client/authenticatedClient.ts';
import type {
  CreateEventRequest,
  CreateEventResponse,
  Event,
  GetEventDetailResponse,
  GetMyAllEventsResponse,
  GetMyAllEventsParam,
  GetEventDetailParam,
  DeleteEventParam,
  DeleteEventResponse,
} from '../types/event.ts';
import { EventError } from '../errors/customErrors.ts';
import { requestHandler } from './util/requestHandler.ts';

export const getMyAllEventsApi = async ({ tripId }: GetMyAllEventsParam): Promise<Event[]> => {
  return requestHandler(
    () => authenticatedClient.get<GetMyAllEventsResponse>(`/event/all/${tripId}`),
    EventError
  );
};

export const createEventApi = async (event: CreateEventRequest): Promise<Event> => {
  return requestHandler(
    () => authenticatedClient.post<CreateEventResponse>('/event', event),
    EventError
  );
};

export const getEventDetailApi = async ({ id }: GetEventDetailParam): Promise<Event> => {
  return requestHandler(
    () => authenticatedClient.get<GetEventDetailResponse>(`/event/${id}`),
    EventError
  );
};

export const deleteEventApi = async ({ id }: DeleteEventParam): Promise<null> => {
  return requestHandler(
    () => authenticatedClient.delete<DeleteEventResponse>(`/event/${id}`),
    EventError
  );
};

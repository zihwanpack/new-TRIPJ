import { authenticatedClient } from './client/authenticatedClient.ts';
import type {
  CreateEventRequest,
  CreateEventResponse,
  Event,
  GetMyAllEventsResponse,
} from '../types/event.ts';
import { EventError } from '../errors/customErrors.ts';
import { requestHandler } from './util/requestHandler.ts';

type GetMyAllEventsParams = {
  tripId: number;
};

export const getMyAllEventsApi = async ({ tripId }: GetMyAllEventsParams): Promise<Event[]> => {
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

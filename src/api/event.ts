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
  UpdateEventResponse,
  UpdateEventParam,
} from '../types/event.ts';
import { EventError } from '../errors/customErrors.ts';
import { requestHandler } from './util/requestHandler.ts';
import { eventListSchema, eventSchema } from '../schemas/eventSchema.ts';

export const getMyAllEventsApi = async ({ tripId }: GetMyAllEventsParam): Promise<Event[]> => {
  return requestHandler({
    request: () => authenticatedClient.get<GetMyAllEventsResponse>(`/event/all/${tripId}`),
    ErrorClass: EventError,
    schema: eventListSchema,
  });
};

export const createEventApi = async (body: CreateEventRequest): Promise<Event> => {
  return requestHandler({
    request: () => authenticatedClient.post<CreateEventResponse>('/event', body),
    ErrorClass: EventError,
    schema: eventSchema,
  });
};

export const getEventDetailApi = async ({ eventId }: GetEventDetailParam): Promise<Event> => {
  return requestHandler({
    request: () => authenticatedClient.get<GetEventDetailResponse>(`/event/${eventId}`),
    ErrorClass: EventError,
    schema: eventSchema,
  });
};

export const deleteEventApi = async ({ eventId }: DeleteEventParam): Promise<null> => {
  return requestHandler({
    request: () => authenticatedClient.delete<DeleteEventResponse>(`/event/${eventId}`),
    ErrorClass: EventError,
  });
};

export const updateEventApi = async ({ eventId, body }: UpdateEventParam): Promise<Event> => {
  return requestHandler({
    request: () => authenticatedClient.patch<UpdateEventResponse>(`/event/${eventId}`, body),
    ErrorClass: EventError,
    schema: eventSchema,
  });
};

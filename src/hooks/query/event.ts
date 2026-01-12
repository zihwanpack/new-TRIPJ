const eventStaleGcTime = {
  staleTime: 5 * 60 * 1000,
  gcTime: 30 * 60 * 1000,
} as const;

export const useEventDetailQueryOptions = ({ eventId }: { eventId: number }) => {
  return {
    ...eventStaleGcTime,
    enabled: eventId > 0,
  };
};

export const useEventListQueryOptions = ({ tripId }: { tripId: number }) => {
  return {
    ...eventStaleGcTime,
    enabled: tripId > 0,
  };
};

const tripStaleGcTime = {
  staleTime: 5 * 60 * 1000,
  gcTime: 30 * 60 * 1000,
} as const;

export const useTripDetailQueryOptions = ({ id }: { id: number }) => {
  return {
    ...tripStaleGcTime,
    enabled: id > 0,
  };
};

export const useOngoingTripQueryOptions = () => {
  return {
    ...tripStaleGcTime,
  };
};

export const useUpcomingTripsQueryOptions = ({ userId }: { userId: string }) => {
  return {
    ...tripStaleGcTime,
    enabled: userId.trim().length > 0,
  };
};

export const usePastTripsQueryOptions = ({ userId }: { userId: string }) => {
  return {
    ...tripStaleGcTime,
    enabled: userId.trim().length > 0,
  };
};

export const useMyTripsQueryOptions = () => {
  return {
    ...tripStaleGcTime,
  };
};

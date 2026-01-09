export const tripQueryKeys = {
  all: ['trip'] as const,
  ongoing: (userId: string) => [...tripQueryKeys.all, 'ongoing', userId] as const,
  upcoming: (userId: string) => [...tripQueryKeys.all, 'upcoming', userId] as const,
  past: (userId: string) => [...tripQueryKeys.all, 'past', userId] as const,
  detail: (tripId: number) => [...tripQueryKeys.all, 'detail', tripId] as const,
};

export const userQueryKeys = {
  all: ['user'] as const,
  byEmails: (emails: string[]) => [...userQueryKeys.all, 'byEmails', [...emails].sort()] as const,
  search: (query: string) => [...userQueryKeys.all, 'search', query] as const,
};
export const eventQueryKeys = {
  all: ['event'] as const,
  detail: (id: number) => [...eventQueryKeys.all, 'detail', id] as const,
  list: (tripId: number) => [...eventQueryKeys.all, 'list', tripId] as const,
};

export const useUsersByEmailsQueryOptions = ({ members }: { members: string[] }) => {
  return {
    staleTime: 5 * 60 * 1000,
    gcTime: 30 * 60 * 1000,
    enabled: members.length > 0,
  };
};

export const useSearchUsersQueryOptions = ({ data }: { data: string }) => {
  return {
    staleTime: 0,
    gcTime: 0,
    enabled: data.trim().length > 0,
  };
};

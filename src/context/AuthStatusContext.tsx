import { createContext } from 'react';
import { getUserInfoApi, logoutApi } from '../api/auth.ts';
import type { AuthContextValue } from '../types/auth.ts';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { userQueryKeys } from '../constants/queryKeys.ts';
import type { User } from '../types/user.ts';
import { withdrawApi } from '../api/user.ts';
import { useUserInfoQueryOptions } from '../hooks/query/auth.ts';
import { AuthError } from '../errors/customErrors.ts';

const AuthStatusContext = createContext<AuthContextValue | null>(null);

const AuthStatusProvider = ({ children }: { children: React.ReactNode }) => {
  const queryClient = useQueryClient();

  const { data: user, isPending: loading } = useQuery<User | null>({
    queryKey: userQueryKeys.info(),
    queryFn: async () => {
      return await getUserInfoApi();
    },
    retry: (failureCount, error) => {
      if (error instanceof AuthError && error.statusCode === 401) {
        return false;
      }
      return failureCount < 1;
    },
    ...useUserInfoQueryOptions(),
  });

  const logout = async () => {
    try {
      await logoutApi();
    } finally {
      queryClient.setQueryData(userQueryKeys.info(), null);
    }
  };

  const withdrawal = async () => {
    if (!user?.id) return;
    await withdrawApi({ id: user?.id });
    await logout();
  };

  return (
    <AuthStatusContext.Provider value={{ user: user ?? null, logout, loading, withdrawal }}>
      {children}
    </AuthStatusContext.Provider>
  );
};

export { AuthStatusContext, AuthStatusProvider };

import { createContext } from 'react';
import { getUserInfoApi, logoutApi } from '../api/auth.ts';
import type { AuthContextValue } from '../types/auth.ts';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { userQueryKeys } from '../constants/queryKeys.ts';
import type { User } from '../types/user.ts';
import { withdrawApi } from '../api/user.ts';
import { useUserInfoQueryOptions } from '../hooks/query/auth.ts';

const AuthStatusContext = createContext<AuthContextValue | null>(null);

const AuthStatusProvider = ({ children }: { children: React.ReactNode }) => {
  const queryClient = useQueryClient();

  const { data: user, isPending: loading } = useQuery<User | null>({
    queryKey: userQueryKeys.info(),
    queryFn: async () => {
      try {
        const user = await getUserInfoApi();
        return user;
      } catch {
        return null;
      }
    },
    ...useUserInfoQueryOptions(),
  });

  const logout = async () => {
    await logoutApi();
    queryClient.clear();
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

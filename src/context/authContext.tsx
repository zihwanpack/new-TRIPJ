import { createContext, useEffect, useState } from 'react';
import { getAuthenticatedUserApi, logoutApi } from '../api/auth.ts';
import type { User } from '../types/user.ts';
import type { AuthContextValue } from '../types/auth.ts';

const AuthContext = createContext<AuthContextValue | null>(null);

const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    const authLogin = async () => {
      try {
        const { user } = await getAuthenticatedUserApi();
        setUser(user);
      } catch {
        setUser(null);
      } finally {
        setLoading(false);
      }
    };
    authLogin();
  }, []);

  const logout = async () => {
    await logoutApi();
    setUser(null);
  };

  return <AuthContext.Provider value={{ user, logout, loading }}>{children}</AuthContext.Provider>;
};

export { AuthContext, AuthProvider };

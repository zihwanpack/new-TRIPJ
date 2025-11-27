import { createContext, useEffect, useState } from 'react';
import type { User } from '../types/user.ts';
import { getAuthedUser, logoutApi } from '../api/auth.ts';

type AuthContextType = {
  user: User | null;
  logout: () => Promise<void>;
  loading: boolean;
};

const AuthContext = createContext<AuthContextType | null>(null);

const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    const authLogin = async () => {
      try {
        const { user } = await getAuthedUser();
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

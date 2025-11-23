import { createContext, useEffect, useState } from 'react';
import type { User } from '../types/user.ts';
import { tokenManager } from '../utils/tokenManager.ts';
import { authAPI } from '../api/auth.ts';

type AuthContextType = {
  user: User | null;
  accessToken: string | null;
  login: (accessToken: string) => Promise<void>;
  logout: () => Promise<void>;
  loading: boolean;
};

const AuthContext = createContext<AuthContextType | null>(null);

const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [accessToken, setAccessToken] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    const authLogin = async () => {
      try {
        const { accessToken, user } = await authAPI.me();
        setUser(user);
        setAccessToken(accessToken);
        tokenManager.set(accessToken);
      } catch {
        setUser(null);
        setAccessToken(null);
        tokenManager.set(null);
      } finally {
        setLoading(false);
      }
    };
    authLogin();
  }, []);

  const login = async (accessToken: string) => {
    setAccessToken(accessToken);
    tokenManager.set(accessToken);
    const { user } = await authAPI.me();
    setUser(user);
  };

  const logout = async () => {
    await authAPI.logout();
    setAccessToken(null);
    setUser(null);
    tokenManager.set(null);
  };

  return (
    <AuthContext.Provider value={{ user, accessToken, login, logout, loading }}>
      {children}
    </AuthContext.Provider>
  );
};

export { AuthContext, AuthProvider };

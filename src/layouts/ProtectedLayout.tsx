import { Outlet, Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { Loader } from 'lucide-react';

export const ProtectedLayout = () => {
  const { user, loading } = useAuth();
  const location = useLocation();

  if (loading) {
    return <Loader />;
  }

  if (!user) {
    const isHome = location.pathname === '/';
    return (
      <Navigate
        to="/login"
        replace
        state={{ from: location, message: isHome ? null : '로그인이 필요합니다.' }}
      />
    );
  }

  return <Outlet />;
};

import { Navigate, Outlet } from 'react-router-dom';
import { useAuthStatus } from '../hooks/user/useAuthStatus.tsx';
import { FullscreenLoader } from '../components/common/FullscreenLoader.tsx';

export const ProtectedLayout = () => {
  const { user, loading } = useAuthStatus();

  if (loading) {
    return <FullscreenLoader />;
  }

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  return <Outlet />;
};

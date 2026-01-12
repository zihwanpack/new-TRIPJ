import { useContext } from 'react';

import { AuthStatusContext } from '../../context/AuthStatusContext.tsx';
export const useAuthStatus = () => {
  const ctx = useContext(AuthStatusContext);
  if (!ctx) throw new Error('useAuthStatus must be used within AuthStatusProvider');
  return ctx;
};

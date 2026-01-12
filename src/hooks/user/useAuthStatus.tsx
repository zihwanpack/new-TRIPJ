import { useContext } from 'react';

import { AuthStatusContext } from '../../context/AuthStatusContext.tsx';
export const useAuthStatusContext = () => {
  const ctx = useContext(AuthStatusContext);
  if (!ctx) throw new Error('useAuthStatusContext must be used within AuthStatusProvider');
  return ctx;
};

import { QueryClientProvider } from '@tanstack/react-query';
import type { PropsWithChildren } from 'react';
import { AuthProvider } from '../context/authContext.tsx';
import { devtools, queryClient } from '../main.tsx';
import { RouterProvider } from 'react-router-dom';
import { router } from '../router/index.tsx';

export const Provider = ({ children }: PropsWithChildren) => {
  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        {children}
        <RouterProvider router={router} />
        {devtools}
      </AuthProvider>
    </QueryClientProvider>
  );
};

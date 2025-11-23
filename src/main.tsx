import './index.css';
import { router } from './router';
import { AuthProvider } from './context/authContext.tsx';

import { ReactQueryDevtools } from '@tanstack/react-query-devtools';
import { Toaster } from 'react-hot-toast';
import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { RouterProvider } from 'react-router-dom';
import { QueryClientProvider, QueryClient } from '@tanstack/react-query';

export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
      retry: 1,
    },
  },
});

const devtools = import.meta.env.DEV ? (
  <ReactQueryDevtools buttonPosition="bottom-left" initialIsOpen={false} />
) : null;

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <Toaster
          position="top-center"
          toastOptions={{
            duration: 2000,
          }}
        />
        <RouterProvider router={router} />
        {devtools}
      </AuthProvider>
    </QueryClientProvider>
  </StrictMode>
);

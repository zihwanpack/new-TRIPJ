import './index.css';

import { ReactQueryDevtools } from '@tanstack/react-query-devtools';
import { Toaster } from 'react-hot-toast';
import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { QueryClient } from '@tanstack/react-query';
import { Provider } from './providers/Provider.tsx';

export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
      retry: 1,
    },
  },
});

export const devtools = import.meta.env.DEV ? (
  <ReactQueryDevtools buttonPosition="bottom-left" initialIsOpen={false} />
) : null;

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <Provider>
      <Toaster
        position="top-center"
        toastOptions={{
          duration: 2000,
        }}
      />
    </Provider>
  </StrictMode>
);

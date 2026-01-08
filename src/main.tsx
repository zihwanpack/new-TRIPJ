import './index.css';
import './schemas/envSchema.ts';

import { ReactQueryDevtools } from '@tanstack/react-query-devtools';
import { Toaster } from 'react-hot-toast';
import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { Provider } from './providers/Provider.tsx';
import { RouterProvider } from 'react-router-dom';
import { router } from './router/index.tsx';

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
      <RouterProvider router={router} />
    </Provider>
  </StrictMode>
);

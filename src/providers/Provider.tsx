import { QueryClient } from '@tanstack/react-query';
import type { PropsWithChildren } from 'react';

import { ReactQueryDevtools } from '@tanstack/react-query-devtools';
import { ThemeProvider } from '../context/ThemeContext.tsx';
import { PersistQueryClientProvider } from '@tanstack/react-query-persist-client';
import { createAsyncStoragePersister } from '@tanstack/query-async-storage-persister';
import { AuthStatusProvider } from '../context/AuthStatusContext.tsx';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
      retry: 1,
    },
  },
});
const persister = createAsyncStoragePersister({
  storage: window.localStorage,
});

export const Provider = ({ children }: PropsWithChildren) => {
  return (
    <PersistQueryClientProvider
      client={queryClient}
      persistOptions={{
        persister,
        maxAge: 24 * 60 * 60 * 1000,
      }}
    >
      <ThemeProvider defaultTheme="dark" storageKey="theme-storage-key">
        <AuthStatusProvider>
          {children}
          {import.meta.env.DEV && (
            <ReactQueryDevtools buttonPosition="bottom-left" initialIsOpen={false} />
          )}
        </AuthStatusProvider>
      </ThemeProvider>
    </PersistQueryClientProvider>
  );
};

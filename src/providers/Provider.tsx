import { QueryClient } from '@tanstack/react-query';
import type { PropsWithChildren } from 'react';
import { AuthProvider } from '../context/AuthContext.tsx';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';
import { ThemeProvider } from '../context/ThemeContext.tsx';
import { PersistQueryClientProvider } from '@tanstack/react-query-persist-client';
import { createAsyncStoragePersister } from '@tanstack/query-async-storage-persister';

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
        maxAge: 24 * 60 * 60 * 1000, // 24시간
      }}
    >
      <ThemeProvider defaultTheme="dark" storageKey="theme-storage-key">
        <AuthProvider>
          {children}
          {import.meta.env.DEV && (
            <ReactQueryDevtools buttonPosition="bottom-left" initialIsOpen={false} />
          )}
        </AuthProvider>
      </ThemeProvider>
    </PersistQueryClientProvider>
  );
};

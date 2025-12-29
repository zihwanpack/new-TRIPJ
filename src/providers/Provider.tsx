import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import type { PropsWithChildren } from 'react';
import { AuthProvider } from '../context/AuthContext.tsx';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';
import { store } from '../redux/slices/store.ts';
import { Provider as ReduxProvider } from 'react-redux';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
      retry: 1,
    },
  },
});

export const Provider = ({ children }: PropsWithChildren) => {
  return (
    <QueryClientProvider client={queryClient}>
      <ReduxProvider store={store}>
        <AuthProvider>
          {children}
          {import.meta.env.VITE_ENV === 'development' && (
            <ReactQueryDevtools buttonPosition="bottom-left" initialIsOpen={false} />
          )}
        </AuthProvider>
      </ReduxProvider>
    </QueryClientProvider>
  );
};

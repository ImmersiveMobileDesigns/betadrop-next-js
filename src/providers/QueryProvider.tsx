'use client';

import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';
import { useState, useEffect } from 'react';

export default function QueryProvider({ children }: { children: React.ReactNode }) {
  const [queryClient] = useState(() => new QueryClient({
    defaultOptions: {
      queries: {
        // Prevent automatic refetching on window focus/reconnect for now
        // to avoid "double call" confusion unless specifically needed
        refetchOnWindowFocus: false,
        retry: 5,
        staleTime: 2 * 60 * 1000, // Data is fresh for 2 minutes
      },
    },
  }));
  
  // Listen for logout events from other tabs
  useEffect(() => {
    const handleStorage = (event: StorageEvent) => {
      if (event.key === 'logout-event') {
        queryClient.setQueryData(['session'], null);
        queryClient.invalidateQueries({ queryKey: ['session'] });
      }
    };
    
    window.addEventListener('storage', handleStorage);
    return () => window.removeEventListener('storage', handleStorage);
  }, [queryClient]);

  return (
    <QueryClientProvider client={queryClient}>
      {children}
      <ReactQueryDevtools initialIsOpen={false} />
    </QueryClientProvider>
  );
}

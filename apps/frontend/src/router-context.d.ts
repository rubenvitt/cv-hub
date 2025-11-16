// Router Context Type Declaration
// Makes queryClient available in route loaders via context

import { QueryClient } from '@tanstack/react-query';

declare module '@tanstack/react-router' {
  interface Register {
    router: {
      context: {
        queryClient: QueryClient;
      };
    };
  }
}

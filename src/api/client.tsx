"use client";

// import useApiError from "@/app/hooks/useApiError";
import {
  defaultShouldDehydrateQuery,
  QueryCache,
  QueryClient,
  QueryClientConfig,
  QueryClientProvider,
} from "@tanstack/react-query";

import React from "react";
// import useApiError from "@/app/hooks/useApiError";

function makeQueryClient(options: QueryClientConfig) {
  return new QueryClient(options);
}

let browserQueryClient: QueryClient | undefined = undefined;

function getQueryClient(options: QueryClientConfig) {
  //서버
  if (typeof window === "undefined") {
    return makeQueryClient(options);
  } else {
    //클라이언트
    if (!browserQueryClient) browserQueryClient = makeQueryClient(options);
    return browserQueryClient;
  }
}

const ClientProvider: React.FC<React.PropsWithChildren> = ({ children }) => {
  // const { handleError } = useApiError();

  const options: QueryClientConfig = {
    queryCache: new QueryCache({
      onError: (error, query) => {
        // handleError(error);
      },
    }),
    defaultOptions: {
      queries: {
        staleTime: 60 * 1000,
        // gcTime: 60 * 1000 * 5,
        // gcTime: 60 * 1000 * 5,
        // staleTime: 1000 * 60 * 5,

        // retry: 1,
        // throwOnError: true,
        retry: false,
        refetchOnMount: false,
        refetchOnWindowFocus: false,
      },

      // dehydrate: {
      //   // include pending queries in dehydration
      //   shouldDehydrateQuery: (query) => {
      //     return (
      //       defaultShouldDehydrateQuery(query) ||
      //       query.state.status === "pending"
      //     );
      //   },
      // },
    },
  };

  const queryClient = getQueryClient(options);

  return (
    <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
  );
};

export { getQueryClient, ClientProvider };

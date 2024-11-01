import {
  defaultShouldDehydrateQuery,
  QueryClient,
} from "@tanstack/react-query";
import { cache } from "react";

const getQueryClient = cache(
  () =>
    new QueryClient({
      defaultOptions: {
        dehydrate: {
          shouldDehydrateQuery(query) {
            return (
              defaultShouldDehydrateQuery(query) ||
              query.state.status === "pending"
            );
          },
        },
      },
    })
);
export default getQueryClient;

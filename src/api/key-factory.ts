import {
  createQueryKeys,
  inferQueryKeyStore,
  mergeQueryKeys,
} from "@lukemorales/query-key-factory";

const mapKeys = createQueryKeys("map", {
  list: (level) => ({
    queryKey: ["getMap"],
  }),

  // info: () => ({
  //   // queryKey: ["user-info", pathName],
  //   queryKey: ["user-info"],
  // }),
});

export const queryKeys = mergeQueryKeys(mapKeys);

export type QueryKeys = inferQueryKeyStore<typeof queryKeys>;

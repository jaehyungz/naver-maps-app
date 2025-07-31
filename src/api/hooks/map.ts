import { useQuery } from "@tanstack/react-query";
import { GetMapResponse, GetMapVariables } from "../types";
import { queryKeys } from "../key-factory";
import { fetcher } from "../fetcher";

export const useGetMap = ({ level }: GetMapVariables) => {
  const { data } = useQuery({
    queryKey: queryKeys.map.list(level)["queryKey"],
    queryFn: () =>
      getMap({
        level,
      }),
    // retryOnMount: true,
    // gcTime: 0,
  });
  return { data };
};

const getMap = async (res: GetMapVariables) => {
  const queryString = new URLSearchParams({
    level: res.level.toString(),
  });

  const response = await fetcher(`/api/map?` + queryString);

  const data: { ok: boolean; data: GetMapResponse[] } = await response.json();

  return data.data;
};

export const useGetMapDetail = ({ id }: { id: string }) => {
  const { data } = useQuery({
    queryKey: queryKeys.map.detail(id)["queryKey"],
    queryFn: () =>
      getMapDetail({
        id,
      }),
    enabled: id !== "",
    // retryOnMount: true,
    // gcTime: 0,
  });
  return { data };
};

const getMapDetail = async (res: { id: string }) => {
  const response = await fetcher(`/api/map/${res.id}`);

  const data: { ok: boolean; data: any } = await response.json();

  return data.data;
};

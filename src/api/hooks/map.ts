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
  });
  return { data };
};

const getMap = async (res: GetMapVariables) => {
  const queryString = new URLSearchParams({
    level: res.level.toString(),
  });

  const response = await fetcher(`/map?` + queryString);

  console.log(response);

  const data: GetMapResponse[] = await response.json();
  console.log(data);

  return data;
};

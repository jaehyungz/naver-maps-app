import { useQuery } from "@tanstack/react-query";

export const useGetPosts = (id: string) => {
  const { data, isFetching } = useQuery({
    queryKey: ["getPosts", id],
    queryFn: () => getPosts(id),
  });
  return { data, isFetching };
};

const getPosts = async (id: string) => {
  const response = await fetch(`https://dummyjson.com/posts/${id}`);

  const data = await response.json();

  return data;
};

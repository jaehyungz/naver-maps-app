type GetMapVariables = {
  level: number;
};
type GetMapResponse = {
  id: number;
  lat: number;
  lng: number;
  name: string;
  size: "big" | "small";
};

export type { GetMapResponse, GetMapVariables };

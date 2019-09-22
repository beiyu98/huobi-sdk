import { Huobi } from "./huobi";

export const getRestInstance = (accessKey: string, secretKey: string) => {
  const sdk = new Huobi(accessKey, secretKey);
  return sdk;
};

import { apiRequest, ReqType } from "./utils";
import { BASE_URL } from "./constant";

export class Huobi {
  private accessKey: string;
  private secretKey: string;
  private socksproxy: string = "";

  constructor(accessKey: string, secretKey: string) {
    this.accessKey = accessKey;
    this.secretKey = secretKey;
  }

  setSocketProxy(proxyUrl: string) {
    this.socksproxy = proxyUrl;
    return this;
  }

  private buildRequest(
    url: string,
    method: ReqType,
    data: object | {},
    accessKey: string,
    secretKey: string,
    needSign = false
  ) {
    return apiRequest(
      url,
      method,
      data,
      accessKey,
      secretKey,
      needSign,
      this.socksproxy
    );
  }

  /**
   * : Promise<{
    data: {
      "base-currency": string;
      "quote-currency": string;
      "price-precision": number;
      "amount-precision": number;
      "symbol-partition": string;
      symbol: string;
    }[];
  }>
   */
  commonSympols() {
    return this.buildRequest(
      `${BASE_URL}/v1/common/symbols`,
      "GET",
      {},
      this.accessKey,
      this.secretKey
    );
  }
}

import * as urlUtils from "url";
import * as crypto from "crypto";
import request from "request";
//@ts-ignore
import * as SocksProxyAgent from "socks-proxy-agent";

export type ReqType = "GET" | "POST" | "WS";

export const apiSignature = (
  url: string,
  method: ReqType,
  data: object | {},
  accessKey: string,
  secretKey: string
) => {
  const params = {
    ...data,
    SignatureMethod: "HmacSHA256",
    SignatureVersion: 2,
    Timestamp: encodeURIComponent(new Date().toISOString().slice(0, 19)),
    AccessKeyId: accessKey
  };
  const query = Object.keys(params)
    .sort()
    .reduce((a, k) => {
      //@ts-ignore
      a.push(k + "=" + encodeURIComponent(params[k]));
      return a;
    }, [])
    .join("&");
  const { host, path } = urlUtils.parse(url);
  //@ts-ignore
  const meta = [method.toUpperCase(), host.toLowerCase(), path, query].join(
    "\n"
  );
  let signature = crypto
    .createHmac("sha256", secretKey)
    .update(meta)
    .digest("base64");
  signature = encodeURIComponent(signature);
  if (method === "GET") {
    return {
      url: url + "?" + query + "&Signature=" + signature,
      qs: data,
      method
    };
  } else if (method === "POST") {
    return {
      url: url + "?" + "Signature=" + signature,
      form: data,
      method
    };
  } else {
    return { ...data, Signature: signature, op: "auth" };
  }
};

export const apiRequest = (
  url: string,
  method: ReqType,
  data: object | {},
  accessKey: string,
  secretKey: string,
  needSign = false,
  proxy?:string
) => {
  let opts: any = { url, method };
  if (method == "GET") {
    opts.qs = data;
  }
  if (method == "POST") {
    opts.form = data;
  }
  if (needSign) {
    opts = apiSignature(url, method, data, accessKey, secretKey);
  }
  if (proxy) {
    opts.agentClass = SocksProxyAgent;
    opts.agentOptions = {
      protocol: parseProxy(proxy)[0],
      host: parseProxy(proxy)[1],
      port: parseProxy(proxy)[2],
    };
  }
  return new Promise((resolve, reject) => {
    request({
      url: opts.url,
      method: opts.method,
      qs: opts.qs,
      form: opts.form,
      callback: (err: any, res: any, body: any) => {
        if (err) return reject(err);
        if (res.statusCode != 200) reject(res);
        resolve(body);
      }
    });
  });
};

const parseProxy = (connString: string) => {
  const arr = connString.split("/");
  const host = arr[2].split(":")[0];
  const port = arr[2].split(":")[1];
  return [arr[0], host, port];
};

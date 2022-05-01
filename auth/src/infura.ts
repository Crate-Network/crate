import fetch from "node-fetch";

const options = {
  url: "https://filecoin.infura.io",
  method: "POST",
  headers: {
    "content-type": "application/json",
  },
  auth: {
    user: process.env.INFURA_PROJECT_ID,
    pass: process.env.INFURA_PROJECT_SECRET,
  },
};

function makeRPCRequest(method: string, params: string[] = []) {
  return JSON.stringify({
    jsonrpc: "2.0",
    id: 1,
    method,
    params,
  });
}

type RPCResponse = {
  id: number;
  jsonrpc: string;
  result: string;
  params: string[];
};

export default async function call(method: string, params: string[] = []) {
  const res = await fetch(options.url, {
    ...options,
    body: makeRPCRequest(method, params),
  });
  return res.json() as Promise<RPCResponse>;
}

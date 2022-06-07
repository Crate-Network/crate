import path from "path";
import fetch, { Response } from "node-fetch";
import { URL } from "url";

export default async function call(
  method: string,
  args: Record<string, string> = {}
) {
  const url = new URL(`http://${process.env.IPFS_HOST}/api/v0/`);
  url.pathname = url.pathname.concat(
    method.endsWith("/") ? method.slice(0, -1) : method
  );
  Object.keys(args).forEach((key) => {
    url.searchParams.append(key, args[key]);
  });
  const res = await fetch(url.toString(), {
    method: "POST",
  });
  return res.text();
}

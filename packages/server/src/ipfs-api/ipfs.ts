import { create } from "ipfs-http-client";

const clientURL = process.env.IPFS_CLIENT_URL || "http://127.0.0.1:5001/api/v0";

console.log(process.env.IPFS_CLIENT_URL);

export const client = create({ url: clientURL });

(async () => {
  for await (const file of client.files.ls("/test")) {
    console.log(file.cid);
  }
})();

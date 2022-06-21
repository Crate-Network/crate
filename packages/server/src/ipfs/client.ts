import { create } from "ipfs-http-client";
const clientURL = process.env.IPFS_CLIENT_URL || "http://127.0.0.1:5001/api/v0";
export const client = create({ url: clientURL });

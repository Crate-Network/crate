import { IPFSHTTPClient } from "ipfs-http-client"

export type CreateDirOptions = {
  path?: string
  uid?: string
  name: string
}

export default (client: IPFSHTTPClient) => async (opts: CreateDirOptions) => {
  return ""
}

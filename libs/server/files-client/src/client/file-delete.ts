import { IPFSHTTPClient } from "ipfs-http-client"

export type FileDeleteOptions = {
  path: string
  uid?: string
}

export default (client: IPFSHTTPClient) => async (opts: FileDeleteOptions) => {
  return ""
}

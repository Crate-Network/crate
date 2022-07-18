import { IPFSHTTPClient } from "ipfs-http-client"

export type FileDeleteOptions = {
  path: string
}

export default (client: IPFSHTTPClient) => async (opts: FileDeleteOptions) => {
  return ""
}

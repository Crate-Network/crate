import { CID } from "@crate/common"
import { IPFSHTTPClient } from "ipfs-http-client"
import { fetchFModel, walk } from "./utils"

export type FileRetrieveOptions = { path: string } | { cid: CID }
export default (client: IPFSHTTPClient) => async (opts: FileRetrieveOptions) => {
  if ("cid" in opts) {
    return fetchFModel(client, opts.cid)
  } else {
    const arr = await walk(client, opts.path)
    return fetchFModel(client, arr[arr.length - 1])
  }
}

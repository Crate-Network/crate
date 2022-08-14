import { CID } from "@crate/common"
import { IPFSHTTPClient } from "ipfs-http-client"
import { fetchFModel, walk } from "../lib/resolution"

export type FileRetrieveOptions = { path: string } | { cid: CID }

/**
 * Retrieve a file by {@link CID} or path.
 * @param opts a {@link FileRetrieveOptions} object, either specifying path or
 *             CID.
 * @returns A {@link FileModel} representing the retrieved file.
 */
export default (client: IPFSHTTPClient) => async (opts: FileRetrieveOptions) => {
  if ("cid" in opts) {
    return fetchFModel(client, opts.cid)
  } else {
    const arr = await walk(client, opts.path)
    return fetchFModel(client, arr[arr.length - 1])
  }
}

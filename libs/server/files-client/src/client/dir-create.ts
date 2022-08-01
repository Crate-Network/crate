import { createFile, Node } from "@crate/common"
import { FileType } from "@crate/types"
import { IPFSHTTPClient } from "ipfs-http-client"
import dirAdd from "./dir-add"

export type CreateDirOptions = {
  path: string
  uid?: string
  name: string
  type: FileType
}

export default (client: IPFSHTTPClient) => async (opts: CreateDirOptions) => {
  const emptyDir = await createFile(opts.type, opts.name)
  const cid = (
    await client.dag.put(Node.toRawBlock(Node.fromFile(emptyDir)), {
      inputCodec: "dag-pb",
      storeCodec: "dag-pb",
    })
  ).toV0()

  return await dirAdd(client)({
    cid,
    ...opts,
  })
}

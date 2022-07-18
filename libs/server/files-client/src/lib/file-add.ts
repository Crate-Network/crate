import { IPFSHTTPClient } from "ipfs-http-client"
import { CID, Node, UnixFS } from "@crate/common"
import { fetchFModel, walk } from "./utils"
import { FileModel } from "@crate/types"
import dirAdd from "./dir-add"

export type FileAddOptions = {
  path: string
  fileNames?: string[]
} & (
  | {
      files: NodeJS.ReadableStream[]
    }
  | {
      cids: CID[]
    }
)

type AddResult = {
  cid: CID
  size: number
}

async function resolveCIDs(
  client: IPFSHTTPClient,
  cids: CID[]
): Promise<AddResult[]> {
  return await Promise.all(
    cids.map(async (cid) => {
      const model = await fetchFModel(client, cid)
      return {
        cid,
        size: model.size,
      }
    })
  )
}

async function addFileBuffers(
  client: IPFSHTTPClient,
  files: NodeJS.ReadableStream[]
): Promise<AddResult[]> {
  return await Promise.all(
    files.map(async (fBuffer) => {
      const res = await client.add(fBuffer)
      const block = await client.block.get(res.cid)
      const size = await UnixFS.unmarshal(block).fileSize()
      return {
        ...res,
        size,
      }
    })
  )
}

export default (client: IPFSHTTPClient) => async (opts: FileAddOptions) => {
  // parse files, forward to IPFS to get the CID
  const results =
    "files" in opts
      ? await addFileBuffers(client, opts.files)
      : await resolveCIDs(client, opts.cids)

  const filenames = opts.fileNames
  const models = results.map((res, idx) => {
    const hasFName = filenames && filenames.length > idx
    const name = hasFName ? filenames[idx] : res.cid.toString()

    return {
      cid: res.cid.toString(),
      name,
      type: "file",
      size: res.size,
      date: new Date().toISOString(),
    }
  })

  for (const i in models) {
    const { cid, name } = models[i]
    await client.pin.add(cid)
    // const pin = await client.pin.remote.add(addResult.cid, {
    //   name: file.name,
    //   service: "crate",
    // });
    await dirAdd(client)({
      path: opts.path,
      name,
      cid: CID.parse(cid),
    })
  }

  return models as FileModel[]
}

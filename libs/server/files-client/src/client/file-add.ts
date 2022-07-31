import { IPFSHTTPClient } from "ipfs-http-client"
import { CID, joinPath, splitPath, UnixFS } from "@crate/common"
import { fetchFModel } from "../lib/resolution"
import { FileModel } from "@crate/types"
import dirAdd from "./dir-add"
import { setRootCID } from "@crate/user-client"
import { pin } from "../lib/pinning"

export type FileAddOptions = {
  path: string
  uid?: string
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

/**
 * Resolve existing CIDs on IPFS to determine size of the files.
 * @param client the {@link IPFSHTTPClient}
 * @param cids an array of {@link CID} to add
 * @returns an array of {@link AddResult} objects, which specify CID and size
 */
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

/**
 * Add a series of files to the IPFS client by way of NodeJS file buffers.
 * @param client the {@link IPFSHTTPClient}
 * @param files an array of {@link NodeJS.ReadableStream} to read bytes from
 * @returns an array of {@link AddResult} objects, which specify CID and size
 */
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

  // resolve filenames, if they exist
  const filenames = opts.fileNames
  const namedResults = results.map((res, idx) => ({
    name:
      filenames && filenames.length > idx ? filenames[idx] : res.cid.toString(),
    ...res,
  }))

  // finish up file model convention
  const models = namedResults.map((res) => ({
    cid: res.cid,
    name: res.name,
    type: "file",
    size: res.size,
    date: new Date().toISOString(),
  }))

  // update the directory sequentially, one file at a time, to generate new
  // hashes as we go.
  let dirPath = opts.path
  for (const i in models) {
    const { cid, name } = models[i]

    // pin the file using our remote pinning service
    await pin(client, cid, name)

    const filePath = await dirAdd(client)({
      path: dirPath,
      name,
      cid,
      uid: opts.uid,
    })

    dirPath = joinPath("ipfs", ...splitPath(filePath).slice(0, -1))
  }

  if (opts.uid) await setRootCID(opts.uid, CID.parse(splitPath(dirPath)[0]))

  // for API consistency, we require the CID be a string
  return models.map((model) => ({
    ...model,
    cid: model.cid.toString(),
  })) as FileModel[]
}
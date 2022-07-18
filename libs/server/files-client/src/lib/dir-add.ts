import {
  CID,
  FileError,
  FileErrorType,
  Node,
  splitPath,
  UnixFS,
} from "@crate/common"
import { IPFSHTTPClient } from "ipfs-http-client"
import { walk } from "./utils"

/**
 * path: path to directory to modify
 * name: name of file to add or update
 * cid: the CID to link
 */
export type AddToDirOptions = {
  path: string
  name: string
  cid: CID
}

type FileDesc = { name: string; cid: CID }

/**
 *
 * @param client the {@link IPFSHTTPClient}
 * @param parent the {@link CID} of the directory being updated.
 * @param newFile the name and {@link CID} of the new file. If a file already
 *                exists with that name, it will be replaced by this new link.
 * @returns the updated {@link CID} of the directory with the new file added.
 */
async function addToDir(
  client: IPFSHTTPClient,
  parent: CID,
  newFile: FileDesc
): Promise<CID> {
  const rawDirBlock = await client.block.get(parent)
  const rawFileBlock = await client.block.get(newFile.cid)

  const dirNode = Node.fromRawBlock(rawDirBlock)
  if (!dirNode.Data) throw new FileError(FileErrorType.NO_DATA)

  const fileNode = Node.fromRawBlock(rawFileBlock)
  if (!fileNode.Data) throw new FileError(FileErrorType.NO_DATA)
  const fileUfs = UnixFS.unmarshal(rawFileBlock)

  const idx = dirNode.Links.findIndex((link) => link.Name === newFile.name)
  if (idx !== -1) dirNode.Links.splice(idx)

  dirNode.Links.push({
    Hash: newFile.cid,
    Name: newFile.name,
    Tsize: fileUfs.fileSize(),
  })

  const newDirCID = (
    await client.dag.put(Node.toRawBlock(dirNode), {
      inputCodec: "dag-pb",
      storeCodec: "dag-pb",
    })
  ).toV0()

  return newDirCID
}

export default (client: IPFSHTTPClient) => async (opts: AddToDirOptions) => {
  const pathArr = splitPath(opts.path)
  const pathCIDs = await walk(client, opts.path)
  const pathInfo = pathArr.map((v, i) => ({ name: v, cid: pathCIDs[i] }))

  let dirCID = pathInfo[pathInfo.length - 1].cid
  pathInfo.push({
    name: opts.name,
    cid: opts.cid,
  })

  // walk from the end up the beginning, updating the directories as we go.
  for (const info of pathInfo.reverse()) {
    const newDirCID = await addToDir(client, dirCID, info)
    dirCID = newDirCID

    await client.pin.add(newDirCID)
  }

  const strippedRootPath = pathArr.slice(1).join("/")
  const newPath = `/ipfs/${dirCID}/${strippedRootPath}${
    strippedRootPath !== "" ? "/" : ""
  }${opts.name}`

  return newPath
}

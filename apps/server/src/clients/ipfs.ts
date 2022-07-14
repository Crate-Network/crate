import { FileModel } from "@crate/types"
import fs from "fs"
import {
  CID,
  FileError,
  FileErrorType,
  Node,
  splitPath,
  validPath,
} from "@crate/common"
import fileUpload from "express-fileupload"
import { create } from "ipfs-http-client"

const clientURL =
  process.env["IPFS_CLIENT_URL"] || "http://127.0.0.1:5001/api/v0"
const client = create({ url: clientURL })

const fetchFModel = async (cid: CID): Promise<FileModel> => {
  return await Node.toFile(Node.fromRawBlock(await client.block.get(cid)))
}

const walk = async (path: string): Promise<CID[]> => {
  const walkDir = async (dirCID: string, path: string[]): Promise<CID[]> => {
    if (path.length === 0) return [CID.parse(dirCID)]
    const fModel = await fetchFModel(CID.parse(dirCID))
    if (!fModel.links || fModel.type !== "directory")
      throw new FileError(FileErrorType.FILE_INVALID)
    if (!fModel.links.some((link) => link.name === path[0]))
      throw new FileError(FileErrorType.NO_DATA)
    const nextCID = fModel.links.find((el) => el.name === path[0])?.cid
    if (!nextCID) throw new Error("nextCID is undefined")
    return [CID.parse(nextCID)].concat(await walkDir(nextCID, path.slice(1)))
  }
  const segments = splitPath(path)
  const rootCID = segments[0]
  const resolvedCIDs: CID[] = await walkDir(rootCID, segments.slice(1))
  return resolvedCIDs
}

async function resolve(path: string): Promise<CID> {
  if (!validPath(path)) throw new Error("Invalid path.")
  const arr = await walk(path)
  return arr[arr.length - 1]
}

async function get(path: string): Promise<FileModel> {
  const pathCid = await resolve(path)
  return await fetchFModel(pathCid)
}

async function add(files: fileUpload.UploadedFile[]): Promise<FileModel[]> {
  // parse files, forward to IPFS to get the CID
  const models = await Promise.all(
    files.map(async (file): Promise<FileModel> => {
      const addResult = await client.add(fs.createReadStream(file.tempFilePath))
      await client.pin.add(addResult.cid)
      console.log(addResult.cid.toString())
      // const pin = await client.pin.remote.add(addResult.cid, {
      //   name: file.name,
      //   service: "crate",
      // });
      return {
        cid: addResult.cid.toString(),
        name: file.name,
        type: "file",
        size: file.size,
        date: new Date().toISOString(),
      }
    })
  )
  return models
}

// async function mkdir(path: string): Promise<string> {}

// async function addToDir(path: string, fileCID: CID): Promise<string> {}

// async function rm(path: string): Promise<string> {}

// export default { client, get, add, mkdir, addToDir, rm }
export default { client, get, add }

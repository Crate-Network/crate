import { FileModel } from "@crate/types"
import { create as createIPFS, IPFSHTTPClient, Options } from "ipfs-http-client"
import getFile, { FileRetrieveOptions } from "./file-retrieve"
import addFile, { FileAddOptions } from "./file-add"
import rmFile, { FileDeleteOptions } from "./file-delete"
import mkdir, { CreateDirOptions } from "./dir-create"
import dirAdd, { AddToDirOptions } from "./dir-add"

type FileClient = {
  ipfsClient: IPFSHTTPClient
  getFile: (opts: FileRetrieveOptions) => Promise<FileModel>
  addFile: (opts: FileAddOptions) => Promise<FileModel[]>
  rmFile: (opts: FileDeleteOptions) => Promise<string>
  mkdir: (opts: CreateDirOptions) => Promise<string>
  dirAdd: (opts: AddToDirOptions) => Promise<string>
}

export default function create(options?: Options): FileClient {
  const opts = { url: "http://127.0.0.1:5001/api/v0", ...options }
  const ipfsClient = createIPFS(opts)

  return {
    ipfsClient,
    getFile: getFile(ipfsClient),
    addFile: addFile(ipfsClient),
    rmFile: rmFile(ipfsClient),
    mkdir: mkdir(ipfsClient),
    dirAdd: dirAdd(ipfsClient),
  }
}
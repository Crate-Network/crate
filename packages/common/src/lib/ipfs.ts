import { FileError, FileErrorType } from "../error"
import { FileModel, FileType } from "../model"
import { UnixFS } from "ipfs-unixfs"
import { CID } from "multiformats/cid"
import { encode, decode } from "@ipld/dag-pb"

export function addFileToDirectory(directory: FileModel, file: FileModel) {
  if (directory.type !== FileType.DIRECTORY)
    throw new FileError(FileErrorType.FILE_INVALID, directory)
}

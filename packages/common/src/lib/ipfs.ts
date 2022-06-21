import { FileError, FileErrorType } from "../error"
import { FileModel, FileType } from "../model"
import { UnixFS as _UnixFS, parseMtime } from "ipfs-unixfs"
import { CID as _CID } from "multiformats/cid"
import { encode, decode, prepare } from "@ipld/dag-pb"
import Hash from "ipfs-only-hash"

export class CID extends _CID {
  static async fromBlock(bytes: Uint8Array): Promise<CID> {
    return CID.parse(await Hash.of(bytes))
  }

  static async fromFile(file: FileModel): Promise<CID> {
    return CID.fromBlock(Block.fromFile(file))
  }

  static async recalculate(file: FileModel): Promise<FileModel> {
    return { ...file, cid: (await CID.fromFile(file)).toString() }
  }
}
export class Block {
  static fromFile(file: FileModel, content?: Uint8Array): Uint8Array {
    if (file.type === FileType.FILE && !content) {
      console.error("Pass file contents as second parameter for files.")
      throw new FileError(FileErrorType.FILE_INVALID)
    }
    return encode(
      prepare({
        Links: file.links
          ? file.links.map(({ cid, name, size }) => ({
              Hash: CID.parse(cid),
              Name: "",
              Tsize: size,
            }))
          : [],
        Data: UnixFS.from(file.type, file.date, content).marshal(),
      })
    )
  }

  static async toFile(bytes: Uint8Array): Promise<FileModel> {
    const dag = decode(bytes)
    if (!dag.Data) throw new FileError(FileErrorType.NO_DATA)

    const ufs = UnixFS.unmarshal(dag.Data)
    const isDir = ufs.type === "directory"
    return {
      cid: (await CID.fromBlock(bytes)).toString(),
      fullName: "",
      name: "",
      extension: "",
      size: ufs.fileSize(),
      date: new Date(ufs.mtime.secs),
      ...(isDir
        ? {
            type: FileType.DIRECTORY,
            links: dag.Links.map((link) => link.Hash.toString()),
            cumulativeSize: dag.Links.map((link) => link.Tsize).reduce(
              (a, b) => a + b,
              0
            ),
          }
        : {
            type: FileType.FILE,
          }),
    }
  }
}

export class UnixFS extends _UnixFS {
  static from(type: FileType, date: Date, content?: Uint8Array) {
    return new UnixFS({
      type: type === FileType.DIRECTORY ? "directory" : "file",
      data: content,
      hashType: undefined,
      fanout: undefined,
      blockSizes: [],
      mtime: parseMtime(date),
      mode: type === FileType.DIRECTORY ? 493 : 420,
    })
  }
}

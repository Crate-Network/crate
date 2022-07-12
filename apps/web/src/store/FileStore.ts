/**
 * A global file store to maintain the state of loaded files and operations
 * upon them throughout the app. This store operates separately of any
 * particular file views, such as dealing with file selection or directory
 * visibility.
 */

import {
  FileError,
  FileErrorType,
  CID as CIDOp,
  Node,
  splitPath,
} from "@crate/common"
import create, { StateCreator } from "zustand"
import { FileModel } from "@crate/types"
import { subscribeWithSelector } from "zustand/middleware"
import { immer } from "zustand/middleware/immer"
import FileAPI from "api/FileAPI"
import { useUserStore } from "./UserStore"

type CID = string
type CIDRefFileModel = Exclude<FileModel, { name: string }>

interface FileState {
  // the file list mapping CID to FileModel
  files: Record<CID, CIDRefFileModel>
  // retrieval
  get: (path: string) => Promise<FileModel>
  getCID: (cid: CID) => Promise<FileModel>
  getChildren: (path: string) => Promise<Record<string, FileModel>>
  // common operations on files
  // pass in a path and get back a path to updated file
  add: (path: string, file: FileModel) => Promise<string>
  update: (path: string, updated: Partial<FileModel>) => Promise<string>
  delete: (path: string) => Promise<string>
  rename: (path: string, newName: string) => Promise<string>
}

const fileStore: StateCreator<
  FileState,
  [["zustand/immer", never], ["zustand/subscribeWithSelector", never]]
> = (set, get): FileState => {
  const calculateCID = async (model: FileModel): Promise<CID> => {
    if (model.type !== "directory") return model.cid
    const node = Node.fromFile(model)
    const cid = (await CIDOp.fromNode(node)).toString()
    return cid
  }

  const getCID = async (cid: CID): Promise<FileModel> => {
    const { files } = get()
    if (cid in files) return files[cid]
    const fModel = await FileAPI.getCID(cid)
    if (cid.startsWith("/"))
      throw new Error("Invalid use of path in place of CID.")
    set(({ files }) => {
      files[cid] = fModel
    })
    return { ...fModel }
  }

  /**
   * The walk function resolves a string path to an array of CIDs,
   * representing each directory passed through down to the target file/dir.
   * @param path the input path, e.g. "/ipfs/Qm.../dir1/dir2/file.txt"
   * @returns array of CIDs
   */
  const walk = async (path: string): Promise<CID[]> => {
    const walkDir = async (dirCID: CID, path: string[]): Promise<CID[]> => {
      if (path.length === 0) return [dirCID]
      const fModel = await getCID(dirCID)
      if (fModel.type !== "directory")
        throw new FileError(FileErrorType.FILE_INVALID)
      if (!fModel.links.some((link) => link.name === path[0]))
        throw new FileError(FileErrorType.NO_DATA)

      const nextCID = fModel.links.find((el) => el.name === path[0]).cid
      return [nextCID].concat(await walkDir(nextCID, path.slice(1)))
    }
    const segments = splitPath(path)
    const rootCID = segments[0]
    const resolvedCIDs: CID[] = await walkDir(rootCID, segments.slice(1))
    return resolvedCIDs
  }

  const resolve = async (path: string) => {
    const arr = await walk(path)
    return await getCID(arr[arr.length - 1])
  }

  const getChildren = async (path: string) => {
    const model = await resolve(path)
    const childrenArr = await Promise.all(model.links.map((l) => getCID(l.cid)))
    return Object.fromEntries(childrenArr.map((child) => [child.name, child]))
  }

  /**
   * Updates a file at a particular path. Could be a directory or file.
   * Synchronizes up to the server.
   * @param path the input path, e.g. "/ipfs/Qm.../dir1/dir2/file.txt"
   * @param updatedFile a partial FileModel object representing modifications
   * @returns the new path to the file from a different root CID
   */
  const update = async (path: string, updatedFile: Partial<FileModel>) => {
    const allCIDs = await walk(path)
    const origModel = await getCID(allCIDs.pop())
    const newModel = { ...origModel, ...updatedFile }
    delete newModel.name
    let nextCID = await calculateCID(newModel)
    newModel.cid = nextCID
    set(({ files }) => {
      files[newModel.cid] = newModel
    })

    const segments = splitPath(path)
    while (allCIDs.length > 0) {
      const cid = allCIDs.pop()
      const model = await getCID(cid)
      const fName = segments.pop()
      const newModel = { ...model }
      newModel.links = newModel.links.map((link) => {
        if (link.name === fName) {
          return { ...link, cid: nextCID }
        }
        return link
      })
      delete newModel.name
      nextCID = await calculateCID(newModel)
      if (cid === useUserStore.getState().userDoc.rootCID) {
        console.log(cid, nextCID)
      }
      newModel.cid = nextCID
      set(({ files }) => {
        files[newModel.cid] = newModel
      })
    }
    const newPath = `/ipfs/${nextCID}/${splitPath(path).slice(1).join("/")}`
    return newPath
  }

  /**
   * The add function simplifies adding a file to a directory path.
   * @param path the input directory, e.g. "/ipfs/Qm.../dir1/dir2"
   * @param file the file object to add at the input path. To resolve a file
   *             name, the object must have the `name` parameter set, or else
   *             the name will default to the CID of the file.
   * @returns the path to the file.
   */
  const add = async (path: string, file: FileModel) => {
    const dirModel = await resolve(path)
    const newModel = { ...dirModel }
    newModel.links = newModel.links.concat([
      {
        cid: file.cid,
        name: file.name || file.cid,
        size: file.size,
      },
    ])
    return `${update(path, newModel)}/${file.name || file.cid}`
  }

  /**
   * Deletes a file object at a particular path, including recursive deletions.
   * @param path the input path, e.g. "/ipfs/Qm.../dir1/dir2/file.txt"
   * @returns updated directory path of the parent
   */
  const del = async (path: string) => {
    const pSegments = splitPath(path)
    const fName = pSegments.pop()
    const dirPath = `/${pSegments.join("/")}`

    const dirModel = await resolve(dirPath)
    const fileModel = await resolve(path)

    set(({ files }) => {
      delete files[fileModel.cid]
    })
    dirModel.links = dirModel.links.filter((l) => l.name !== fName)
    return update(dirPath, dirModel)
  }

  const rename = (path: string, newName: string) =>
    update(path, { name: newName })

  return {
    files: {},
    get: resolve,
    getCID,
    getChildren,
    add,
    update,
    delete: del,
    rename,
  }
}

export const useFileStore = create(immer(subscribeWithSelector(fileStore)))

useFileStore.subscribe(({ files }) => {
  console.log(files)
})

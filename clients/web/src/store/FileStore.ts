/**
 * A global file store to maintain the state of loaded files and operations
 * upon them throughout the app. This store operates separately of any
 * particular file views, such as dealing with file selection or directory
 * visibility.
 */

import { FileError, FileErrorType, CID as CIDOp, Node } from "@crate/common"
import create, { StateCreator } from "zustand"
import { FileModel, FileModelLinksInner } from "@crate/api-lib"
import { subscribeWithSelector } from "zustand/middleware"
import { immer } from "zustand/middleware/immer"
import FileAPI from "api/FileAPI"
import { useErrorStore } from "./ErrorStore"
import { useUserStore } from "./UserStore"

type CID = string
type CIDRefFileModel = Exclude<FileModel, { name: string }>
export type VisibleFile =
  | ({ loaded: false } & FileModelLinksInner)
  | ({ loaded: true } & FileModel)
export type VisibleFiles = Record<string, VisibleFile>

interface FileState {
  // the file list mapping CID to FileModel
  files: Record<CID, CIDRefFileModel>
  // retrieve single FileModel
  retrieve: (directory: CID) => Promise<FileModel>
  // get contents of a directory as a mapping of name to VisibleFiles objects
  getContents: (directory: CID) => Promise<VisibleFiles>
  // common operations on files
  add: (directory: CID, file: FileModel) => Promise<CID>
  update: (cid: CID, updatedFile: Partial<FileModel>) => void
  delete: (cid: CID) => void
  rename: (cid: CID, newName: string) => void
}

const fileStore: StateCreator<
  FileState,
  [["zustand/immer", never], ["zustand/subscribeWithSelector", never]]
> = (set, get): FileState => {
  const retrieve = async (cid: CID): Promise<FileModel> => {
    const { files } = get()
    if (cid in files) return files[cid]
    const fModel = await FileAPI.getCID(cid)
    set((state) => {
      state.files[cid] = fModel
    })
    return fModel
  }

  const getContents = async (directory: CID): Promise<VisibleFiles> => {
    const { files } = get()
    const vFiles: VisibleFiles = {}
    const localDir = files[directory]
    const dir = localDir ? localDir : await FileAPI.get("/")
    const p = dir.links.map(async (link) => {
      if (link.cid in files)
        vFiles[link.name] = { loaded: true, ...files[link.cid], ...link }
      else {
        vFiles[link.name] = { loaded: false, ...link }
        const fModel = await retrieve(link.cid)
        try {
          set(({ files: innerFiles }) => {
            innerFiles[fModel.cid] = fModel
          })
          vFiles[link.name] = {
            loaded: true,
            ...files[link.cid],
            ...link,
          }
        } catch (e) {
          useErrorStore.getState().showError(e)
        }
      }
    })
    await Promise.all(p)
    return vFiles
  }

  const recalculateCID = async (ref: CID): Promise<CID> => {
    const { files } = get()
    const node = Node.fromFile(files[ref])
    const cid = (await CIDOp.fromNode(node)).toString()
    set((state) => {
      const { files } = state
      files[cid] = { ...files[ref], cid }
    })
    // propagate state changes up the tree
    Object.values(files).map((fileModel) => {
      if (fileModel.links && fileModel.links.some((link) => link.cid === cid)) {
        recalculateCID(fileModel.cid)
      }
    })
    return cid
  }

  const update = (cid: CID, updatedFile: Partial<FileModel>) => {
    set((state) => {
      if (!Object.keys(state.files).includes(cid))
        throw new FileError(FileErrorType.INVALID)
      const fileModel = { ...updatedFile, ...state.files[cid] }
      delete fileModel.name
      state.files[cid] = fileModel
      if (fileModel.type === "directory") recalculateCID(cid)
    })
  }

  return {
    files: {},
    retrieve,
    getContents,
    add: (directory: CID, file: FileModel) => {
      set(({ files }) => {
        if (files[directory].type === "file")
          throw new FileError(FileErrorType.FILE_INVALID)
        const fWithoutName = file
        delete fWithoutName.name
        files[file.cid] = fWithoutName
        const { name, cid, size } = file
        files[directory].links.push({ name: name || cid, cid, size })
      })
      return recalculateCID(directory)
    },
    update,
    delete: (cid: CID) =>
      set(({ files }) => {
        delete files[cid]
      }),
    rename: (cid: CID, newName: string) => update(cid, { name: newName }),
  }
}

export const useFileStore = create(immer(subscribeWithSelector(fileStore)))

// type Operation = "create" | "update" | "delete"
// const getOp = (difference: number): Operation => {
//   if (difference < 0) return "delete"
//   else if (difference === 0) return "update"
//   return "create"
// }

// retrieve root CID on user change
useUserStore.subscribe(
  (state) => state.userDoc,
  (userDoc) => {
    useFileStore.getState().retrieve(userDoc.rootCID)
  }
)

useFileStore.subscribe(({ files }) => {
  console.log(files)
})

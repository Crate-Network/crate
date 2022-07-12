/**
 * A local file store which exports a Context provider, which can be
 * consumed by any file view.
 */

import create, { StateCreator, StoreApi } from "zustand"
import createContext from "zustand/context"
import { immer } from "zustand/middleware/immer"

export type SelectionInfo = { name: string; cid: string }
type FileViewState = {
  // list of files names in visible directory
  selectedFiles: SelectionInfo[]
  selectedNames: () => string[]
  selectedCIDs: () => string[]
  // functions to modify selection
  select: (name: SelectionInfo | SelectionInfo[], replace: boolean) => void
  deselect: (name: SelectionInfo | SelectionInfo[]) => void
  // local inspector state
  inspectorVisible: boolean
  showInspector: () => void
  hideInspector: () => void
  // currently visible path
  path: string
  setPath: (newPath: string) => void
}

const { Provider, useStore } = createContext<StoreApi<FileViewState>>()

const fileViewStore =
  (rootCID: string): StateCreator<FileViewState, [["zustand/immer", never]]> =>
  (set, get) => ({
    selectedFiles: [],
    path: `/ipfs/${rootCID}`,
    selectedNames: () => get().selectedFiles.map((f) => f.name),
    selectedCIDs: () => get().selectedFiles.map((f) => f.cid),
    select: (name: SelectionInfo | SelectionInfo[], replace = false) =>
      set((state) => {
        const nameArr = Array.isArray(name) ? name : [name]
        if (replace) state.selectedFiles = nameArr
        state.selectedFiles.concat(nameArr)
      }),
    deselect: (name: SelectionInfo | SelectionInfo[]) =>
      set((state) => {
        const nameArr = Array.isArray(name) ? name : [name]
        state.selectedFiles = state.selectedFiles.filter((elName) => {
          return nameArr.every((e) => e !== elName)
        })
      }),
    inspectorVisible: false,
    showInspector: () => set((state) => ({ ...state, inspectorVisible: true })),
    hideInspector: () =>
      set((state) => ({ ...state, inspectorVisible: false })),
    setPath: (path: string) =>
      set((state) => {
        state.path = path
      }),
  })

const createStore = (userRootCID: string) => () =>
  create(immer(fileViewStore(userRootCID)))
export { createStore, useStore, Provider }

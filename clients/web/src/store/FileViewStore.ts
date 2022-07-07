/**
 * A local file store which exports a Context provider, which can be
 * consumed by any file view.
 */

import create, { StateCreator, StoreApi } from "zustand"
import createContext from "zustand/context"
import { immer } from "zustand/middleware/immer"

type FileViewState = {
  // list of files names in visible directory
  selectedFiles: string[]
  // functions to modify selection
  select: (name: string | string[], replace: boolean) => void
  deselect: (name: string | string[]) => void
  // local inspector state
  inspectorVisible: boolean
  showInspector: () => void
  hideInspector: () => void
  // visible dir info
  visible: string
  show: (cid: string) => void
}

const { Provider, useStore } = createContext<StoreApi<FileViewState>>()

const fileViewStore: StateCreator<FileViewState, [["zustand/immer", never]]> = (
  set
) => ({
  selectedFiles: [],
  select: (name: string | string[], replace = false) =>
    set((state) => {
      const nameArr = Array.isArray(name) ? name : [name]
      if (replace) state.selectedFiles = nameArr
      state.selectedFiles.concat(nameArr)
    }),
  deselect: (name: string | string[]) =>
    set((state) => {
      const nameArr = Array.isArray(name) ? name : [name]
      state.selectedFiles = state.selectedFiles.filter((elName) => {
        return nameArr.every((e) => e !== elName)
      })
    }),
  inspectorVisible: false,
  showInspector: () => set((state) => ({ ...state, inspectorVisible: true })),
  hideInspector: () => set((state) => ({ ...state, inspectorVisible: false })),
  visible: "",
  show: (cid: string) => set((state) => ({ ...state, visible: cid })),
})

const createStore = () => create(immer(fileViewStore))
export { createStore, useStore, Provider }

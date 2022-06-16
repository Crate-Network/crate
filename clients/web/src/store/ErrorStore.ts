import create, { StateCreator } from "zustand"

interface ErrorState {
  message: string
  displayed: boolean
  showMessage: (message: string) => void
  hide: () => void
}

const errorStateCreator: StateCreator<ErrorState> = (set): ErrorState => ({
  message: "",
  displayed: false,
  showMessage: (message: string) => {
    set({ message, displayed: true })
  },
  hide: () => {
    set((state) => ({ ...state, displayed: false }))
  },
})

export const useErrorStore = create(errorStateCreator)

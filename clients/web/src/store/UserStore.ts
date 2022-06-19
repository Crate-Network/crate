import { UserModel } from "@crate/common"
import { onAuthStateChanged, signOut, User } from "firebase/auth"
import { doc, DocumentReference, getDoc, onSnapshot } from "firebase/firestore"
import { auth, db } from "vendor/firebase"
import create, { StateCreator } from "zustand"
import { persist, subscribeWithSelector } from "zustand/middleware"
import { useErrorStore } from "./ErrorStore"

const defaultUserModel: UserModel = {
  firstName: "",
  lastName: "",
  organization: "",
  uses2FA: false,
  dataKey: "",
}

interface FirebaseState {
  signedIn: boolean
  user: User | null
  userDoc: UserModel | null
  logout: () => Promise<void>
}

const firebaseStateCreator: StateCreator<
  FirebaseState,
  [
    ["zustand/subscribeWithSelector", never],
    ["zustand/persist", Partial<FirebaseState>]
  ]
> = (set): FirebaseState => ({
  signedIn: false,
  user: null,
  userDoc: null,
  logout: async () => {
    try {
      await signOut(auth)
      set({ user: null, userDoc: null, signedIn: false })
    } catch (err) {
      useErrorStore.getState().showMessage(err.message)
    }
  },
})

export const useUserStore = create(
  subscribeWithSelector(
    persist(firebaseStateCreator, {
      name: "crate-session", // unique name
    })
  )
)

useUserStore.subscribe(
  (state) => state.user,
  async (user) => {
    if (!user) return

    const userDocRef = doc(
      db,
      "users",
      user.uid.toString()
    ) as DocumentReference<UserModel>

    const update = (newDoc: UserModel) =>
      useUserStore.setState({ userDoc: { ...defaultUserModel, ...newDoc } })

    try {
      const doc = await getDoc(userDocRef)
      update(doc.data())
    } catch (err) {
      useErrorStore.getState().showMessage(err.message)
    }

    const unsub = onSnapshot(userDocRef, (doc) => update(doc.data()))
    return unsub
  }
)

onAuthStateChanged(auth, (user) => {
  useUserStore.setState({ user: user, signedIn: !!user })
})

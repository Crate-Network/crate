import { UserModel } from "@crate/types"
import { CID } from "@crate/common"
import { onAuthStateChanged, signOut, User } from "firebase/auth"
import {
  doc,
  DocumentReference,
  getDoc,
  onSnapshot,
  setDoc,
} from "firebase/firestore"
import { auth, db } from "../vendor/firebase"
import create, { StateCreator } from "zustand"
import { persist, subscribeWithSelector } from "zustand/middleware"

const makeDefaultUserModel = async (): Promise<UserModel> => ({
  firstName: "",
  lastName: "",
  organization: "",
  uses2FA: false,
  dataKey: "",
  devices: {},
  signedDataKey: {},
  recoveryKey: null,
  rootCID: (await CID.from({ type: "directory" })).toString(),
})

interface FirebaseState {
  signedIn: boolean
  authenticating: boolean
  user: User | null
  userDoc: UserModel | null
  logout: () => Promise<void>
  updateUser: (newDoc: Partial<UserModel>) => void
}

const firebaseStateCreator: StateCreator<
  FirebaseState,
  [
    ["zustand/subscribeWithSelector", never],
    ["zustand/persist", Partial<FirebaseState>]
  ]
> = (set): FirebaseState => ({
  signedIn: false,
  authenticating: true,
  user: null,
  userDoc: null,
  logout: async () => {
    await signOut(auth)
    set({ user: null, userDoc: null, signedIn: false })
  },
  updateUser: (newDoc: Partial<UserModel>) => {
    set(({ userDoc }) => ({ userDoc: { ...userDoc, ...newDoc } }))
  },
})

export const useUserStore = create(
  subscribeWithSelector(
    persist(firebaseStateCreator, {
      name: "crate-session", // unique name
      partialize: (state) =>
        Object.fromEntries(
          Object.entries(state).filter(
            ([key]) => !["authenticating"].includes(key)
          )
        ),
    })
  )
)

// UserStore subscription - update the remote UserStore on change.
useUserStore.subscribe(
  (state) => state.userDoc,
  (userDoc) => {
    const state = useUserStore.getState()
    if (!state.user) return

    const userDocRef = doc(
      db,
      "users",
      state.user.uid.toString()
    ) as DocumentReference<UserModel>

    setDoc(userDocRef, userDoc)
  }
)

// on auth state change, set the user in the state
onAuthStateChanged(auth, async (user) => {
  useUserStore.setState({ user, signedIn: !!user, authenticating: false })
})

// user subscription - update the UserStore when the user changes
useUserStore.subscribe(
  (state) => state.user,
  async (user) => {
    if (!user) return

    const userDocRef = doc(
      db,
      "users",
      user.uid.toString()
    ) as DocumentReference<UserModel>

    const snapshot = await getDoc(userDocRef)
    useUserStore
      .getState()
      .updateUser({ ...(await makeDefaultUserModel()), ...snapshot.data() })

    const unsub = onSnapshot(userDocRef, (newSnapshot) =>
      useUserStore.getState().updateUser(newSnapshot.data())
    )
    return unsub
  }
)

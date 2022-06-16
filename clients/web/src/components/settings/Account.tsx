import FormInput from "components/FormInput"
import { useCallback, useContext } from "preact/hooks"
import { doc, DocumentReference, setDoc } from "firebase/firestore"
import { UserModel } from "@crate/common"
import { db } from "vendor/firebase"
import { useUserStore } from "store/UserStore"
import shallow from "zustand/shallow"

export default function Profile() {
  const [user, userDoc] = useUserStore(
    (state) => [state.user, state.userDoc],
    shallow
  )

  const updateUserDoc = useCallback(
    (newDoc: Partial<UserModel>) => {
      const userDocRef = doc(
        db,
        "users",
        user.uid.toString()
      ) as DocumentReference<UserModel>
      setDoc(userDocRef, { ...userDoc, ...newDoc })
    },
    [userDoc]
  )

  const { firstName, lastName, organization } = userDoc

  return (
    <div className="space-y-4">
      <h1 className="text-3xl font-bold text-neutral-800 dark:text-neutral-100">
        Profile
      </h1>
      <div className="flex justify-center items-center">
        <span className="w-36">First Name</span>
        <FormInput
          id="fname"
          placeholder="Bob"
          type="text"
          value={firstName}
          onInput={(e) => {
            if (e && e.target.value !== firstName)
              updateUserDoc({ firstName: e.target.value })
          }}
        />
      </div>
      <div className="flex justify-center items-center">
        <span className="w-36">Last Name</span>
        <FormInput
          id="lname"
          placeholder="Jones"
          type="text"
          value={lastName}
          onInput={(e) => {
            if (e && e.target.value !== lastName)
              updateUserDoc({ lastName: e.target.value })
          }}
        />
      </div>
      <div className="flex justify-center items-center">
        <span className="w-36">Organization</span>
        <FormInput
          id="org"
          placeholder="Apple, Inc."
          type="text"
          value={organization}
          onInput={(e) => {
            if (e && e.target.value !== organization)
              updateUserDoc({ organization: e.target.value })
          }}
        />
      </div>
    </div>
  )
}

import FormInput from "components/FormInput"
import { useCallback, useContext } from "preact/hooks"
import { doc, DocumentReference, setDoc } from "firebase/firestore"
import AuthContext, { AuthObject } from "context/AuthContext"
import { UserModel } from "@crate/common"

export default function Security() {
  const { db, user } = useContext<AuthObject>(AuthContext)

  const update2FA = useCallback(
    (e) => {
      const userDocRef = doc(
        db,
        "users",
        user.uid.toString()
      ) as DocumentReference<UserModel>
      setDoc(userDocRef, { ...user.doc, uses2FA: e.target.checked })
    },
    [user.doc]
  )

  const { uses2FA } = user.doc

  return (
    <div className="space-y-4">
      <h1 className="text-3xl font-bold text-neutral-800 dark:text-neutral-100">
        Security
      </h1>
      <div className="flex justify-start">
        <div className="form-check mb-4 mt-2">
          <input
            className="form-check-input h-4 w-4 border border-gray-300 rounded-sm mt-1 align-top bg-no-repeat bg-center bg-contain float-left mr-2 cursor-pointer"
            type="checkbox"
            value=""
            checked={uses2FA}
            onInput={update2FA}
            role="switch"
            id="check2FA"
          />
          <label
            className="form-check-label inline-block text-stone-800 dark:text-stone-100"
            for="check2FA"
          >
            Use 2-Factor Authentication
          </label>
        </div>
      </div>
      <span className="text-sm text-stone-800 dark:text-stone-200">
        Using 2-Factor Authentication (2FA) ensures that no one, not even Crate
        Network, can access your data. However, if no other devices can
        authenticate and you lose the recovery password, your data will not be
        recoverable.
      </span>
    </div>
  )
}

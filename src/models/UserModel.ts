import { FileModel } from "./FileModel"

type UserModel = {
  devices: string[]
  firstName: string
  lastName: string
  organization: string
  recoveryKey: string
  signedDataKey: Record<string, string>
  uses2FA: boolean
  files: FileModel
}

const defaultUserModel = {
  devices: [],
  firstName: "",
  lastName: "",
  organization: "",
  recoveryKey: "",
  signedDataKey: {},
  uses2FA: false,
  files: {
    id: "",
  },
}

export { defaultUserModel }
export default UserModel

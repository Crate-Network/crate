type UserModel = {
  devices: string[]
  firstName: string
  lastName: string
  organization: string
  recoveryKey: string
  signedDataKey: Record<string, string>
  uses2FA: boolean
}

const defaultUserModel = {
  devices: [],
  firstName: "",
  lastName: "",
  organization: "",
  recoveryKey: "",
  signedDataKey: {},
  uses2FA: false,
}

export { defaultUserModel }
export default UserModel

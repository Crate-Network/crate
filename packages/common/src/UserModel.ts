type UserInfo = {
  firstName: string
  lastName: string
  organization: string
  uses2FA: boolean
}

type UserSecurity = {
  uses2FA: boolean
  // unencrypted data key, stored securely in Firestore
  // however, still accessible by Crate
  // mapping of device UUID to the device's public key
  devices: Record<string, string>
  // mapping of device UUID to the user's data key, signed by each device
  signedDataKey: Record<string, string>
  // the user's data key, signed by the recovery passcode
  recoveryKey: string | null
  // unencrypted data key
  dataKey: string | null
}

type UserFiles = {
  // CID of the user's current file root
  rootCID: string | null
}

export type UserModel = UserInfo & UserSecurity & UserFiles

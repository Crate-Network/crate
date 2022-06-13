export type UserModel = {
  devices: string[]
  firstName: string
  lastName: string
  organization: string
  recoveryKey: string
  signedDataKey: Record<string, string>
  uses2FA: boolean
}

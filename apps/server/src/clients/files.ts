import { create } from "@crate/files-client"

export default create({
  url: process.env["IPFS_CLIENT_URL"],
  timeout: 30000,
})

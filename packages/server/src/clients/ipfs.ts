import create from "../ipfs-client"
import logger from "../logger"

const client = create({
  url: process.env["IPFS_CLIENT_URL"],
  timeout: 30000,
})

client.ipfsClient.id().then(() => logger.info("Connected to IPFS"))

export default client

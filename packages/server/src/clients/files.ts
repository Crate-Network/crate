import create from "../ipfs-client"
import logger from "../logger"

const client = create({
  url: process.env["IPFS_CLIENT_URL"],
  timeout: 30000,
})

logger.info("IPFS Client Started")

export default client

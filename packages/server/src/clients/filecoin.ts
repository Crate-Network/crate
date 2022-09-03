import { mainnet } from "@filecoin-shipyard/lotus-client-schema"
import { NodejsProvider } from "@filecoin-shipyard/lotus-client-provider-nodejs"
import { LotusRPC } from "@filecoin-shipyard/lotus-client-rpc"
import logger from "../logger"

const endpointURL = process.env["FILECOIN_CLIENT_URL"]
const provider = new NodejsProvider(endpointURL)
const client = new LotusRPC(provider, { schema: mainnet.fullNode })

client
  .chainHead()
  .then((chainHead) => logger.info(`Connected to Lotus: ${chainHead}`))

export default client

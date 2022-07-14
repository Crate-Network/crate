import { mainnet } from "@filecoin-shipyard/lotus-client-schema"
import { NodejsProvider } from "@filecoin-shipyard/lotus-client-provider-nodejs"
import { LotusRPC } from "@filecoin-shipyard/lotus-client-rpc"

const user = process.env["INFURA_PROJECT_ID"]
const pass = process.env["INFURA_PROJECT_SECRET"]

const endpointURL = "https://filecoin.infura.io"
const provider = new NodejsProvider(endpointURL, {
  authorizationHeader: `Basic ${Buffer.from(`${user}:${pass}`).toString(
    "base64"
  )}`,
})
const client = new LotusRPC(provider, { schema: mainnet.fullNode })

export default client

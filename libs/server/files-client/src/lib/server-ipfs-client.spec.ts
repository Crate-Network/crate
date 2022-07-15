import { serverIpfsClient } from "./server-ipfs-client"

describe("serverIpfsClient", () => {
  it("should work", () => {
    expect(serverIpfsClient()).toEqual("server-ipfs-client")
  })
})

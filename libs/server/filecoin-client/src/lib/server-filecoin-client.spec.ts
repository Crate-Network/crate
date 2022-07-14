import { serverFilecoinClient } from "./server-filecoin-client"

describe("serverFilecoinClient", () => {
  it("should work", () => {
    expect(serverFilecoinClient()).toEqual("server-filecoin-client")
  })
})

import { CID, joinPath, splitPath } from "@crate/common"
import { getRootCID, setRootCID } from "../user/user-client"
import { IPFSHTTPClient } from "ipfs-http-client"
import { addToDir } from "../lib/directories"
import { pin } from "../lib/pinning"
import { walk } from "../lib/resolution"
import updatePath from "../lib/update-path"

/**
 * path: path to directory to modify
 * uid: a uid, where if the path's root matches the user's root CID,
 *      after the add is complete, the user's root directory will be
 *      automatically updated.
 * name: name of file to add or update
 * cid: the CID to link
 */
export type AddToDirOptions = {
  path: string
  uid?: string
  name: string
  cid: CID
}

/**
 * Add a file to an existing directory, specified by it's path, and the CID of
 * the file to add.
 *
 * @param opts the {@link AddToDirOptions} object
 * @returns the updated path to the file.
 */
export default (client: IPFSHTTPClient) => async (opts: AddToDirOptions) => {
  const pathArr = splitPath(opts.path)

  const pathCIDs = await walk(client, opts.path)
  const dirCID = pathCIDs[pathCIDs.length - 1]

  const newDirCID = await addToDir(client, dirCID, {
    ...opts,
  })
  const newPath = await updatePath(client, opts.path, newDirCID)
  const newRootCID = CID.parse(splitPath(newPath)[0])

  await pin(client, newRootCID)

  // update the user's root CID if the file matches
  if (opts.uid && (await getRootCID(opts.uid)) === pathArr[0]) {
    setRootCID(opts.uid, newRootCID)
  }

  return joinPath("ipfs", ...splitPath(newPath), opts.name)
}

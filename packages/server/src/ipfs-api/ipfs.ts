import { create } from "ipfs-http-client";
import { UnixFS } from "ipfs-unixfs";
import { CID } from "multiformats/cid";
import { encode, decode } from "@ipld/dag-pb";

const clientURL = process.env.IPFS_CLIENT_URL || "http://127.0.0.1:5001/api/v0";

console.log(process.env.IPFS_CLIENT_URL);

export const client = create({ url: clientURL });

(async () => {
  try {
    const folderCID = (await client.files.stat("/test/")).cid;
    const fileCID = (await client.files.stat("/test/goo.jpg")).cid;

    const folderBlock = await client.block.get(folderCID);
    const fileBlock = await client.block.get(fileCID);

    // console.log(UnixFS.unmarshal(folderBlock));
    // console.log(UnixFS.unmarshal(decode(folderBlock).Data));
    // console.log(decode(folderBlock));

    console.log(UnixFS.unmarshal(fileBlock));
    console.log(UnixFS.unmarshal(decode(fileBlock).Data));
    console.log(decode(fileBlock));

    // const folderDAG = await client.dag.get(folderCID);
    // const fileDAG = await client.dag.get(fileCID);

    // console.log(folderDAG);
    // console.log(fileDAG);
  } catch (e) {
    console.log(e);
  }
})();

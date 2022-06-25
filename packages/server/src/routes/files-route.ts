import { Router } from "express";
import ipfs from "../clients/ipfs";
import filecoin from "../clients/filecoin";
import path from "path";
import { FileModel } from "@crate/api-lib";
import { Block } from "@crate/common";

const router = Router();

router.get("/", async (req, res) => {
  res.send("Got!");
});

router.post("/", async (req, res) => {
  if (!req.files.files || Object.keys(req.files).length === 0) {
    return res.status(400).send("No files were uploaded.");
  }

  // parse files, forward to IPFS to get the CID
  const { files: origFiles } = req.files;
  const files = Array.isArray(origFiles) ? origFiles : [origFiles];
  const models = await Promise.all(
    files.map(async (file): Promise<FileModel> => {
      try {
        const res = await ipfs.add(file.data);
        const pin = await ipfs.pin.remote.add(res.cid, {
          name: file.name,
          service: "crate",
        });
        console.log(pin);
        const block = await ipfs.block.get(res.cid);
        console.log(block);
        console.log(await Block.toFile(block));
        return {
          cid: res.cid.toString(),
          name: file.name,
          type: "file",
          size: 10,
          date: new Date().toISOString(),
          mode: 420,
        };
      } catch (e) {
        console.log(e);
      }
    })
  );

  res.send(models);
});

export default router;

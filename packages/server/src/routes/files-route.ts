import { Router } from "express";
import fs from "fs";
import ipfs from "../clients/ipfs";
import logger from "../logger";
import { firestore } from "../firebase";
import { FileModel } from "@crate/api-lib";
import { Node, parsePath } from "@crate/common";

const router = Router();

const getRootCID = async (uid: string) =>
  (await firestore.collection("users").doc(uid).get()).get("rootCID");

const setRootCID = async (uid: string, newCID: string) =>
  await firestore.collection("users").doc(uid).set({ rootCID: newCID });

const makeError = (type: string, msg: string) => ({
  reason: type,
  message: msg,
});

router.get("/", async (req, res) => {
  const { path, cid } = {
    path: "/",
    cid: null,
    ...req.query,
  };
  logger.info(cid);
  const block = await ipfs.block.get(await getRootCID(req.token.uid));
  res.send(await Node.toFile(Node.fromRawBlock(block)));
});

router.post("/", async (req, res) => {
  const { path } = {
    path: "/",
    ...req.query,
  };
  const pArr = parsePath(path);

  if (!req.files.files || Object.keys(req.files).length === 0) {
    return res.status(400).send({
      error: { reason: "BAD_REQUEST", details: "No files were uploaded." },
    });
  }

  // parse files, forward to IPFS to get the CID
  const { files: origFiles } = req.files;
  const files = Array.isArray(origFiles) ? origFiles : [origFiles];
  const models = await Promise.all(
    files.map(async (file): Promise<FileModel> => {
      const res = await ipfs.add(fs.createReadStream(file.tempFilePath));
      await ipfs.pin.add(res.cid);
      console.log(res.cid.toString());
      // const pin = await ipfs.pin.remote.add(res.cid, {
      //   name: file.name,
      //   service: "crate",
      // });
      return {
        cid: res.cid.toString(),
        name: file.name,
        type: "file",
        size: file.size,
        date: new Date().toISOString(),
      };
    })
  ).catch((e) => {
    logger.info(e.message);
    res.status(500).send(e);
  });

  logger.info(JSON.stringify(models));

  res.send(models);
});

export default router;

import { Router } from "express";
import { client } from "../files/ipfs";
import fileUpload from "express-fileupload";
import path from "path";
import { Block } from "@crate/common";

const router = Router();

router.get("/", async (req, res) => {
  res.send("Got!");
});

router.use(
  fileUpload({
    useTempFiles: true,
    tempFileDir: "/tmp/",
  })
);

router.post("/", async (req, res) => {
  if (!req.files.files || Object.keys(req.files).length === 0) {
    return res.status(400).send("No files were uploaded.");
  }

  // parse files, forward to IPFS to get the CID
  const { files: origFiles } = req.files;
  const files = Array.isArray(origFiles) ? origFiles : [origFiles];
  files.forEach(async (file) => {
    const res = await client.add(file.data);
    const block = await client.block.get(res.cid);
    console.log(block);
    try {
      console.log(await Block.toFile(block));
    } catch (e) {
      console.log(e);
    }
  });

  const pathObj = req.query.path
    ? path.parse(req.query.path as string)
    : path.parse("/");

  res.send(pathObj.base);
});

export default router;

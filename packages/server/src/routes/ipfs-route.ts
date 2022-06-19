import { Router } from "express";
import { client } from "../ipfs-api/ipfs";

const router = Router();

router.get("/", async (req, res) => {
  res.send(await client.add("hello"));
});

export default router;

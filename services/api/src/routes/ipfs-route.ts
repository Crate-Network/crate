import { Router } from "express";

const router = Router();

router.get("/", (req, res) => {
  res.send("Root IPFS endpoint.");
});

export default router;

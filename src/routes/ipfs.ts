import { Router } from "express";
import ipfs from "../ipfs";
import logger from "../logger";

const router = Router();

router.get(/\/(.*)$/, async (req, res) => {
  try {
    const ipfsRes = await ipfs(
      req.params[0],
      req.query as Record<string, string>
    );
    // const contentType = ipfsRes.headers.get("content-type");
    // if (contentType && contentType.indexOf("application/json") !== -1) {
    //   res.send(await ipfsRes.json());
    //   return;
    // }
    res.send(ipfsRes);
  } catch (err) {
    logger.error(err);
    res.status(500).send(err);
  }
});

export default router;

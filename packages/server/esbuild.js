import { build } from "esbuild";

build({
  outfile: "dist/index.js",
  bundle: true,
  platform: "node",
});

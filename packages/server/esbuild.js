const { build } = require("esbuild");

build({
  outfile: "dist/index.js",
  bundle: true,
  platform: "node",
});

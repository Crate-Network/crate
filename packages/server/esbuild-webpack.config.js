const { merge } = require("webpack-merge")
const nodeExternals = require("webpack-node-externals")

module.exports = (config, context) => {
  return merge(config, {
    module: {
      rules: [
        {
          test: /\.ts$/i,
          loader: "esbuild-loader",
          options: {
            loader: "ts",
            target: "node18",
          },
        },
      ],
    },
  })
}

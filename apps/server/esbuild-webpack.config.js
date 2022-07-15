const { merge } = require("webpack-merge")

module.exports = (config, context) => {
  return merge(config, {
    module: {
      rules: [
        {
          test: /\.ts$/i,
          loader: "esbuild-loader",
          options: {
            loader: "ts",
            target: "es2015",
          },
        },
      ],
    },
  })
}

import { defineConfig } from "vite"
import preact from "@preact/preset-vite"
import tsconfigPaths from "vite-tsconfig-paths"
import magicalSvg from "vite-plugin-magical-svg"

// https://vitejs.dev/config/
export default defineConfig({
  esbuild: {
    jsxFactory: "h",
    jsxFragment: "Fragment",
    define: {
      this: "window",
    },
  },
  plugins: [
    preact(),
    tsconfigPaths(),
    magicalSvg({
      // By default, the output will be a dom element (the <svg> you can use inside the webpage).
      // You can also change the output to react (or preact) to get a component you can use.
      target: "preact",
      // By default, the svgs are optimized with svgo. You can disable this by setting this to false.
      svgo: false,
    }),
  ],
})

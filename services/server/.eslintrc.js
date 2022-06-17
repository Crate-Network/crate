module.exports = {
  env: {
    es2021: true,
    node: true,
  },
  extends: ["airbnb-base"],
  parser: "@typescript-eslint/parser",
  parserOptions: {
    ecmaVersion: "latest",
    sourceType: "module",
  },
  ignore: ["./src/types/*.d.ts"],
  plugins: ["@typescript-eslint"],
  rules: {
    "import/no-unresolved": [
      "error",
      {
        ignore: ["^firebase-admin/.+"],
      },
    ],
  },
};
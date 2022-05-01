module.exports = {
  env: {
    es2021: true,
    node: true,
  },
  extends: ["airbnb-base", "prettier"],
  parser: "@typescript-eslint/parser",
  parserOptions: {
    ecmaVersion: "latest",
    sourceType: "module",
  },
  ignore: ["./src/types/*.d.ts"],
  plugins: ["prettier", "@typescript-eslint"],
  rules: {
    "prettier/prettier": ["error"],
    "import/no-unresolved": [
      "error",
      {
        ignore: ["^firebase-admin/.+"],
      },
    ],
  },
};

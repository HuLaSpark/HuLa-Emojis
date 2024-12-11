import globals from "globals";
import pluginJs from "@eslint/js";
import tseslint from "typescript-eslint";

/** @type {import("eslint").Linter.Config[]} */
export default [
  { files: ["**/*.{mts,mjs}"] },
  { languageOptions: { globals: globals.node, HulaEmojis: true } },
  pluginJs.configs.recommended,
  ...tseslint.configs.recommended,
];

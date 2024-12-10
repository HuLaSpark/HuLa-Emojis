/**
 * @file build/rollup.config.ts
 * @description Rollup 配置文件
 * @since 1.0.0
 */

import pkgJson from "../package.json" with { type: "json" };
import { rollup, RollupOptions } from "rollup";
import terser from "@rollup/plugin-terser";
import nodeResolve from "@rollup/plugin-node-resolve";
import ora from "ora";

const extensions: Array<string> = [".ts"];
const banner: Readonly<string> = `/*!
* Hula Emojis v${pkgJson.version}
* (c) 2024 HulaSpark
* @license MIT
*/\n`;

const rollupConfig: RollupOptions = {
  input: "src/entry-bundler.ts",
  output: [
    {
      file: "dist/hula-emojis.esm.js",
      format: "es",
      sourcemap: true,
      banner,
    },
    {
      file: "dist/hula-emojis.js",
      name: "HulaEmojis",
      format: "umd",
      sourcemap: true,
      banner,
    },
    {
      file: "dist/hula-emjois.min.js",
      name: "HulaEmojis",
      format: "umd",
      globals: { vue: "Vue" },
      plugins: [terser({ format: { comments: /^!/, ecma: 2015, semicolons: false } })],
      sourcemap: true,
      banner,
    },
  ],
  external: ["vue"],
  plugins: [nodeResolve({ extensions })],
};

async function build(): Promise<void> {
  const bundle = await rollup(rollupConfig);
  if (rollupConfig.output === undefined) throw new Error("Output is undefined");
  if (Array.isArray(rollupConfig.output)) throw new Error("Output is an array");
  await bundle.write(rollupConfig.output);
}

const spinner = ora("Building...").start();
spinner.start();
build()
  .then(() => spinner.succeed("Build complete!"))
  .catch((err) => spinner.fail(err.message));
spinner.stop();

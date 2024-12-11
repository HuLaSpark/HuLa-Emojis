/**
 * @file scripts/build.ts
 * @description 构建脚本
 * @since 1.0.0
 */

import fs from "fs-extra";
import { getRelativePath } from "../utils/getRelativePath.mjs";
import type { HulaEmojiData, HulaEmojiType } from "../hula-emojis.d.ts";
import ora from "ora";

const spinner = ora("正在构建数据...").start();
const start = Date.now();
const dataDir = getRelativePath("data");
const files = fs.readdirSync(dataDir);
let res: Record<HulaEmojiType, HulaEmojiData> | undefined = undefined;
for (const file of files) {
  spinner.start(`正在处理文件: ${file}`);
  const rawData = await fs.readJson(getRelativePath("data", file));
  if (rawData satisfies HulaEmojiData) {
    const data = rawData as HulaEmojiData;
    if (res === undefined) res = { [data.identifier]: data };
    else res[data.identifier] = data;
  }
}
spinner.succeed("数据处理完成");
spinner.start("正在写入数据...");
const dataPath = getRelativePath("dist", "data.json");
await fs.writeJSON(dataPath, res, { spaces: 0 });
spinner.succeed(`数据写入完成: ${dataPath}`);
const cost = Date.now() - start;
spinner.info(`耗时: ${cost}ms`);
spinner.stop();

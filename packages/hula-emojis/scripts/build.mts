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
  const rawData: HulaEmojiData = await fs.readJson(getRelativePath("data", file));
  if (res === undefined)
    res = { [rawData.identifier]: rawData } as Record<HulaEmojiType, HulaEmojiData>;
  else res[rawData.identifier] = rawData;
}
spinner.succeed("数据处理完成");
spinner.start("正在写入数据...");
const dataPath = getRelativePath("dist", "data.json");
fs.createFileSync(dataPath);
await fs.writeJSON(dataPath, res, { spaces: 0 });
spinner.succeed(`数据写入完成: ${dataPath}`);
const cost = Date.now() - start;
spinner.info(`耗时: ${cost}ms`);
spinner.stop();

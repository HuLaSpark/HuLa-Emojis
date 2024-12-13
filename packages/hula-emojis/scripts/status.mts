/**
 * @file scripts/status.mts
 * @description 查看数据概况
 * @since 1.2.1
 */

import fs from "fs-extra";
import { getRelativePath } from "../utils/getRelativePath.mjs";
import type { HulaEmojiData } from "../hula-emojis.js";
import ora from "ora";

const spinner = ora("正在读取数据...").start();
const start = Date.now();
const dataDir = getRelativePath("data");
const files = fs.readdirSync(dataDir);
type EmojiStatData = {
  name: string;
  seriesCount: number;
  emojisCount: number;
  gifEmojisCount: number;
  textEmojisCount: number;
};
const res: EmojiStatData[] = [];
for (const file of files) {
  spinner.start(`正在处理文件: ${file}`);
  const rawData: HulaEmojiData = await fs.readJson(getRelativePath("data", file));
  const seriesCount = rawData.series.length;
  const emojiFlat = rawData.series.flatMap((item) => item.emojis);
  const emojisCount = emojiFlat.length;
  const gifEmojisCount = emojiFlat.filter((item) => item.url.endsWith(".gif")).length;
  const textEmojisCount = emojiFlat.filter((item) => !item.url.startsWith("http")).length;
  res.push({
    name: rawData.name,
    seriesCount,
    emojisCount,
    gifEmojisCount,
    textEmojisCount,
  });
}
spinner.succeed("数据处理完成");
spinner.start("正在输出数据...");
console.table(res, ["name", "seriesCount", "emojisCount", "gifEmojisCount", "textEmojisCount"]);
const cost = Date.now() - start;
const totalSeries = res.reduce((acc, cur) => acc + cur.seriesCount, 0);
const totalEmojis = res.reduce((acc, cur) => acc + cur.emojisCount, 0);
const totalGifEmojis = res.reduce((acc, cur) => acc + cur.gifEmojisCount, 0);
const totalTextEmojis = res.reduce((acc, cur) => acc + cur.textEmojisCount, 0);
spinner.info(`总系列数: ${totalSeries}`);
spinner.info(`总表情数: ${totalEmojis}`);
spinner.info(`总GIF表情数: ${totalGifEmojis}`);
spinner.info(`总文本表情数: ${totalTextEmojis}`);
spinner.info(`耗时: ${cost}ms`);
spinner.stop();

/**
 * @file scripts/status.mts
 * @description 查看数据概况
 * @since 1.2.6
 */

import fs from "fs-extra";
import { Align, getMarkdownTable } from "markdown-table-ts";
import { getRelativePath } from "../utils/getRelativePath.mjs";
import type { HulaEmojiData } from "../hula-emojis.js";
import ora from "ora";

// 数据处理
const spinnerData = ora("正在读取数据...").start();
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
  spinnerData.start(`正在处理文件: ${file}`);
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
spinnerData.succeed("数据处理完成");
// 更新README
const spinnerReadme = ora("正在更新README.md...").start();
const readmePath = getRelativePath("README.md");
const readme = fs.readFileSync(readmePath, "utf-8").split("\n");
const overViewIndex = readme.findIndex((item) => item.startsWith("## 数据概览"));
const useIndex = readme.findIndex((item) => item.startsWith("## 使用"));
const totalSeries = res.reduce((acc, cur) => acc + cur.seriesCount, 0);
const totalEmojis = res.reduce((acc, cur) => acc + cur.emojisCount, 0);
const totalGifEmojis = res.reduce((acc, cur) => acc + cur.gifEmojisCount, 0);
const totalTextEmojis = res.reduce((acc, cur) => acc + cur.textEmojisCount, 0);
const table = getMarkdownTable({
  table: {
    head: ["表情包", "系列数", "表情数", "GIF表情数", "文本表情数"],
    body: [
      [
        "总计",
        totalSeries.toString(),
        totalEmojis.toString(),
        totalGifEmojis.toString(),
        totalTextEmojis.toString(),
      ],
      ...res.map((item) => [
        item.name,
        item.seriesCount.toString(),
        item.emojisCount.toString(),
        item.gifEmojisCount.toString(),
        item.textEmojisCount.toString(),
      ]),
    ],
  },
  alignment: [Align.Left, Align.Right, Align.Right, Align.Right, Align.Right],
});
readme.splice(overViewIndex + 2, useIndex - overViewIndex - 3, ...table.split("\n"));
fs.writeFileSync(readmePath, readme.join("\n"));
console.table(res, ["name", "seriesCount", "emojisCount", "gifEmojisCount", "textEmojisCount"]);
const cost = Date.now() - start;
spinnerReadme.info(`耗时: ${cost}ms`);
spinnerReadme.stop();

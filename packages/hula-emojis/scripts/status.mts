/**
 * @file scripts/status.mts
 * @description 查看数据概况
 * @since 1.2.6
 */

import fs from "fs-extra";
import { Align, getMarkdownTable } from "markdown-table-ts";
import { getRelativePath, getRootPath } from "../utils/getRelativePath.mjs";
import type { HulaEmojiData } from "../hula-emojis.js";
import ora from "ora";

// 数据处理
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
// 获取table
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
}).split("\n");
// 更新README.md(package)
spinner.start("正在更新README.md(HulaEmojis)...");
const readmePkgPath = getRelativePath("README.md");
const readmePkg = fs.readFileSync(readmePkgPath, "utf-8").split("\n");
const ovpIndex = readmePkg.findIndex((item) => item.startsWith("## 数据概览"));
const upIdx = readmePkg.findIndex((item) => item.startsWith("## 使用"));
readmePkg.splice(ovpIndex + 2, upIdx - ovpIndex - 3, ...table);
fs.writeFileSync(readmePkgPath, readmePkg.join("\n"));
// 更新README.md(project)
spinner.start("正在更新README.md(项目)...");
const readmeProjPath = getRootPath("README.md");
const readmeProj = fs.readFileSync(readmeProjPath, "utf-8").split("\n");
const ovp2Index = readmeProj.findIndex((item) => item.startsWith("## 数据概览"));
const rpIdx = readmeProj.findIndex((item) => item.startsWith("## 参考"));
readmeProj.splice(ovp2Index + 2, rpIdx - ovp2Index - 3, ...table);
fs.writeFileSync(readmeProjPath, readmeProj.join("\n"));
// 打印数据
console.table(res, ["name", "seriesCount", "emojisCount", "gifEmojisCount", "textEmojisCount"]);
const cost = Date.now() - start;
spinner.info(`耗时: ${cost}ms`);
spinner.stop();

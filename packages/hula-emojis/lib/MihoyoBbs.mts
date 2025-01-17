/**
 * @file lib/MihoyoBbs.ts
 * @description 米游社表情包处理
 * @since 1.2.6
 */

import axios, { type AxiosResponse } from "axios";
import fs from "fs-extra";
import ora from "ora";
import type { HulaEmojiData, HulaEmojiSeries } from "../hula-emojis.d.ts";
import { getRelativePath } from "../utils/getRelativePath.mjs";
import { createHash } from "node:crypto";

const spinner = ora("正在获取米游社表情包...").start();
const start = Date.now();
const resp = await axios.get<never, AxiosResponse<MihoyoBbsEmojiResp>>(
  "https://bbs-api-static.miyoushe.com/misc/api/emoticon_set",
);
if (resp.data.retcode !== 0) {
  spinner.fail(`获取米游社表情包失败: ${resp.data.retcode} - ${resp.data.message}`);
  process.exit(1);
}
spinner.succeed("获取米游社表情包成功");
spinner.start("正在处理数据...");
const bbsEmojiData: HulaEmojiData = {
  name: "米游社表情包",
  version: "1.0.0",
  identifier: "MihoyoBbs",
  updateTime: Date.now(),
  series: [],
};
for (const seriesItem of resp.data.data.list) {
  if (!seriesItem.is_available || seriesItem.num === 0) continue;
  bbsEmojiData.series.push(transData(seriesItem));
}
bbsEmojiData.version = createHash("md5").update(JSON.stringify(bbsEmojiData.series)).digest("hex");
spinner.succeed("数据处理完成");
spinner.start("正在写入数据...");
bbsEmojiData.series.sort((a, b) => a.sortOrder! - b.sortOrder!);
const dataPath = getRelativePath("data", "mihoyo-bbs.json");
if (!fs.existsSync(getRelativePath("data"))) fs.mkdirSync(getRelativePath("data"));
if (!fs.existsSync(dataPath)) fs.createFileSync(dataPath);
await fs.writeJson(dataPath, bbsEmojiData, { spaces: 2 });
spinner.succeed(`数据写入完成: ${dataPath}`);
const end = Date.now();
spinner.info(`耗时: ${end - start}ms`);
spinner.stop();

/// 使用到的方法 ///
function transData(data: EmojiSeries): HulaEmojiSeries {
  const series: HulaEmojiSeries = {
    name: data.name,
    identifier: `mihoyo-bbs-${data.id}`,
    num: data.num,
    cover: data.icon,
    sortOrder: data.sort_order,
    id: data.id,
    emojis: [],
  };
  for (const emojiItem of data.list) {
    series.emojis.push({
      name: emojiItem.name,
      identifier: `mihoyo-bbs-${data.id}-${emojiItem.id}`,
      url: emojiItem.icon,
      staticUrl: emojiItem.static_icon,
      id: emojiItem.id,
      sortOrder: emojiItem.sort_order,
    });
  }
  return series;
}

/// 类型定义 ///
/**
 * @description 米游社表情包类型返回数据
 * @since 1.0.0
 * @api https://bbs-api-static.miyoushe.com/misc/api/emoticon_set
 * @type MihoyoBbsEmojiResp
 * @property {number} retcode 返回码
 * @property {string} message 返回信息
 * @property {EmojiResp} data 返回数据
 */
type MihoyoBbsEmojiResp = {
  retcode: number;
  message: string;
  data: EmojiResp;
};

/**
 * @description 表情包返回数据
 * @since 1.0.0
 * @api https://bbs-api-static.miyoushe.com/misc/api/emoticon_set
 * @type EmojiResp
 * @property {EmojiSeries[]} list 表情包列表
 * @property {unknown} recently_emoticon 最近使用表情包
 */
type EmojiResp = {
  list: EmojiSeries[];
  recently_emoticon: unknown;
};

/**
 * @description 表情包系列状态
 * @since 1.0.0
 * @type EmojiStatus
 *
 */

/* eslint-disable */
enum EmojiStatus {
  draft,
  published,
}

/* eslint-enable */

/**
 * @description 表情包系列数据
 * @since 1.0.0
 * @type EmojiSeries
 * @property {number} id 表情包系列 ID
 * @property {string} name 表情包系列名称
 * @property {string} icon 表情包系列图标
 * @property {number} sort_order 排序
 * @property {number} num 表情包数量
 * @property {keyof typeof EmojiStatus} status 表情包状态
 * @property {Emoji[]} list 表情包列表
 * @property {number} updated_at 更新时间(秒级时间戳)
 * @property {boolean} is_available 是否可用
 */
type EmojiSeries = {
  id: number;
  name: string;
  icon: string;
  sort_order: number;
  num: number;
  status: keyof typeof EmojiStatus;
  list: Emoji[];
  updated_at: number;
  is_available: boolean;
};

/**
 * @description 表情包数据
 * @since 1.0.0
 * @type Emoji
 * @property {number} id 表情包 ID
 * @property {string} name 表情包名称
 * @property {string} icon 表情包图标
 * @property {number} sort_order 排序
 * @property {string} static_icon 静态表情包图标(GIF)
 * @property {string} updated_at 更新时间(秒级时间戳)
 * @property {boolean} is_available 是否可用
 * @property {keyof typeof EmojiStatus} status 表情包状态
 * @property {unknown[]} keywords 表情包关键词
 */
type Emoji = {
  id: number;
  name: string;
  icon: string;
  sort_order: number;
  static_icon: string;
  updated_at: string;
  is_available: boolean;
  status: keyof typeof EmojiStatus;
  keywords: unknown[];
};

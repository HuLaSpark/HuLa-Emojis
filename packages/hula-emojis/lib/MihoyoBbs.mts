/**
 * 米游社表情包处理
 * @since 1.2.6
 */

import fs from "fs-extra";
import ora from "ora";
import type { HulaEmojiData, HulaEmojiSeries } from "../hula-emojis.d.ts";
import { getRelativePath } from "../utils/getRelativePath.mjs";
import { createHash } from "node:crypto";

const MysEmojiApi: Readonly<string> = "https://bbs-api-static.miyoushe.com/misc/api/emoticon_set";

const spinner = ora("正在获取米游社表情包...").start();
const start = Date.now();
const resp = await fetch(MysEmojiApi);
const respJson = (await resp.json()) as MysEmojiResp;
if (respJson.retcode !== 0) {
  spinner.fail(`获取米游社表情包失败: ${respJson.retcode} - ${respJson.message}`);
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
for (const seriesItem of respJson.data.list) {
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
function transData(data: MysEmojiSeries): HulaEmojiSeries {
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
 * 米游社表情包类型返回响应
 * @since 1.3.0
 * @remarks 接口 https://bbs-api-static.miyoushe.com/misc/api/emoticon_set
 */
type MysEmojiResp = {
  /** 返回码 */
  retcode: number;
  /** 返回信息 */
  message: string;
  /** 返回数据 */
  data: MysEmojiRes;
};

/**
 * 表情包返回数据
 * @since 1.3.0
 * @api https://bbs-api-static.miyoushe.com/misc/api/emoticon_set
 */
type MysEmojiRes = {
  /** 表情包列表 */
  list: Array<MysEmojiSeries>;
  /** 最近使用表情包 */
  recently_emoticon: unknown;
};

/**
 * 表情包系列状态
 * @since 1.3.0
 * @type MysEmojiStatus
 */
// eslint-disable-next-line @typescript-eslint/no-unused-vars
enum MysEmojiStatus {
  /** 草稿 */
  draft,
  /** 已发布 */
  published,
}

/**
 * 表情包系列状态枚举
 * @since 1.3.0
 */
type MysEmojiStatusEnum = keyof typeof MysEmojiStatus;

/**
 * 表情包系列数据
 * @since 1.3.0
 */
type MysEmojiSeries = {
  /** 表情包系列 ID */
  id: number;
  /** 表情包系列名称 */
  name: string;
  /** 表情包系列图标 */
  icon: string;
  /** 排序 */
  sort_order: number;
  /** 表情包数量 */
  num: number;
  /** 表情包状态 */
  status: MysEmojiStatusEnum;
  /** 表情包列表 */
  list: MysEmoji[];
  /**
   * 更新时间
   * @remarks 秒级时间戳
   */
  updated_at: number;
  /** 是否可用 */
  is_available: boolean;
};

/**
 * 表情包数据
 * @since 1.3.0
 */
type MysEmoji = {
  /** 表情包 ID */
  id: number;
  /** 表情包名称 */
  name: string;
  /** 表情包图标 */
  icon: string;
  /** 排序 */
  sort_order: number;
  /**
   * 静态表情包图标
   * @remarks GIF类型
   */
  static_icon: string;
  /**
   * 更新时间
   * @remarks 秒级时间戳
   */
  updated_at: string;
  /** 是否可用 */
  is_available: boolean;
  /** 表情包状态 */
  status: MysEmojiStatusEnum;
  /** 表情包关键词 */
  keywords: Array<unknown>;
};

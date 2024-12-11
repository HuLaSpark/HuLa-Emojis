/**
 * @file lib/Bilibili.ts
 * @description Bilibili表情包处理
 * @since 1.1.0
 */

import axios, { type AxiosResponse } from "axios";
import fs from "fs-extra";
import ora from "ora";
import type { HulaEmojiData, HulaEmojiSeries } from "../hula-emojis";
import { getRelativePath } from "../utils/getRelativePath.mjs";
import { createHash } from "node:crypto";

const spinner = ora("正在获取Bilibili表情包...").start();
const start = Date.now();
const api = "https://api.bilibili.com/x/emote/user/panel/web";
const params = ["dynamic", "reply"];
const rawData: BilibiliEmojiPackage[] = [];
for (const param of params) {
  const resp = await axios.get<never, AxiosResponse<BilibiliEmojiResp>>(`${api}?business=${param}`);
  if (resp.data.code !== 0) {
    spinner.fail(`获取Bilibili表情包失败: ${resp.data.code} - ${resp.data.message}`);
    process.exit(1);
  }
  spinner.succeed(`获取Bilibili${param === "dynamic" ? "动态" : "回复"}表情包成功`);
  const packages = resp.data.data.packages;
  for (const pkg of packages) {
    const check = rawData.find((item) => item.id === pkg.id);
    if (check) continue;
    rawData.push(pkg);
  }
}
spinner.start("正在处理数据...");
const biliEmojiData: HulaEmojiData = {
  name: "Bilibili表情包",
  version: "1.0.0",
  identifier: "Bilibili",
  updateTime: Date.now(),
  series: [],
};
for (const seriesItem of rawData) {
  if (seriesItem.emote.length === 0) continue;
  biliEmojiData.series.push(transData(seriesItem));
}
biliEmojiData.version = createHash("md5")
  .update(JSON.stringify(biliEmojiData.series))
  .digest("hex");
spinner.succeed("数据处理完成");
spinner.start("正在写入数据...");
const dataPath = getRelativePath("data", "bilibili.json");
biliEmojiData.series.sort((a, b) => a.id! - b.id!);
await fs.writeJson(dataPath, biliEmojiData, { spaces: 2 });
spinner.succeed(`数据写入完成: ${dataPath}`);
const end = Date.now();
spinner.info(`耗时: ${end - start}ms`);
spinner.stop();

/// 使用到的方法 ///
/**
 * @description 转换数据
 * @since 1.1.0
 * @param {BilibiliEmojiPackage} data 数据
 * @returns {HulaEmojiSeries} 转换后数据
 */
function transData(data: BilibiliEmojiPackage): HulaEmojiSeries {
  const series: HulaEmojiSeries = {
    name: data.text,
    identifier: `bilibili-${data.id}`,
    num: 0,
    cover: data.url,
    id: data.id,
    emojis: [],
  };
  for (const emojiItem of data.emote) {
    if (emojiItem.flags.unlocked) continue;
    series.emojis.push({
      name: emojiItem.meta.alias !== "" ? emojiItem.meta.alias : emojiItem.text,
      identifier: `bilibili-${data.id}-${emojiItem.id}`,
      url: emojiItem.url,
    });
  }
  series.num = series.emojis.length;
  return series;
}

/// 类型定义 ///
/**
 * @description Bilibili表情包返回数据
 * @since 1.1.0
 * @api https://api.bilibili.com/x/emote/user/panel/web?business=${param}
 * @param "dynamic" 动态表情包
 * @param "reply" 评论表情包
 * @type BilibiliEmojiResp
 * @property {number} code 状态码
 * @property {string} message 状态信息
 * @property {number} ttl 有效期
 * @property {BilibiliEmojiData} data 数据
 */
declare type BilibiliEmojiResp = {
  code: number;
  message: string;
  ttl: number;
  data: BilibiliEmojiData;
};

/**
 * @description Bilibili表情包数据
 * @since 1.1.0
 * @type BilibiliEmojiData
 * @property {BilibiliEmojiSetting} setting 设置
 * @property {BilibiliEmojiPackage[]} packages 包列表
 */
declare type BilibiliEmojiData = {
  setting: BilibiliEmojiSetting;
  packages: BilibiliEmojiPackage[];
};

/**
 * @description Bilibili表情包数据设置
 * @since 1.1.0
 * @type BilibiliEmojiSetting
 * @property {number} recent_limit 最近使用限制
 * @property {number} attr 未知属性
 * @property {number} focus_pkg_id 关注包ID
 * @property {string} schema SCHEMA地址
 */
declare type BilibiliEmojiSetting = {
  recent_limit: number;
  attr: number;
  focus_pkg_id: number;
  schema: string;
};

/**
 * @description Bilibili表情包包
 * @since 1.1.0
 * @type BilibiliEmojiPackage
 * @property {number} id 包ID
 * @property {string} text 包名称
 * @property {string} url 包封面地址
 * @property {number} mtime 修改时间
 * @property {number} type 包类型
 * @property {number} attr 未知属性
 * @property {number} meta.size 包大小
 * @property {number} meta.item_id 包ID
 * @property {BilibiliEmojiItem[]} emote 包表情列表
 * @property {boolean} flags.added 是否已添加
 * @property {boolean} flags.preview 是否预览
 * @property {unknown} label 标签
 * @property {string} package_sub_title 包副标题
 * @property {number} ref_mid 引用ID
 * @property {number} resource_type 资源类型
 */
declare type BilibiliEmojiPackage = {
  id: number;
  text: string;
  url: string;
  mtime: number;
  type: number;
  attr: number;
  meta: {
    size: number;
    item_id: number;
  };
  emote: BilibiliEmojiItem[];
  flags: {
    added: boolean;
    preview: boolean;
  };
  label: unknown;
  package_sub_title: string;
  ref_mid: number;
  resource_type: number;
};

/**
 * @description Bilibili表情包表情
 * @since 1.1.0
 * @type BilibiliEmojiItem
 * @property {number} id 表情ID
 * @property {number} package_id 包ID
 * @property {string} text 表情名称
 * @property {string} url 表情地址
 * @property {number} mtime 修改时间
 * @property {number} type 表情类型
 * @property {number} attr 未知属性
 * @property {number} meta.size 表情大小
 * @property {string[]} meta.suggest 关键词
 * @property {string} meta.alias 别名
 * @property {boolean} flags.unlocked 是否解锁
 * @property {unknown} activity 活动
 */
declare type BilibiliEmojiItem = {
  id: number;
  package_id: number;
  text: string;
  url: string;
  mtime: number;
  type: number;
  attr: number;
  meta: {
    size: number;
    suggest: string[];
    alias: string;
  };
  flags: {
    unlocked: boolean;
  };
  activity: unknown;
};

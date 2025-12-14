/**
 * Bilibili表情包处理
 * @since 1.2.6
 */

import axios, { type AxiosResponse } from "axios";
import fs from "fs-extra";
import ora from "ora";
import type { HulaEmojiData, HulaEmojiSeries } from "../hula-emojis.js";
import { getRelativePath } from "../utils/getRelativePath.mjs";
import { createHash } from "node:crypto";

const spinner = ora("正在获取Bilibili表情包...").start();
const start = Date.now();
const api = "https://api.bilibili.com/x/emote/user/panel/web";
const params = ["dynamic", "reply"];
const rawData: Array<BilibiliEmojiPackage> = [];
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
if (!fs.existsSync(getRelativePath("data"))) fs.mkdirSync(getRelativePath("data"));
if (!fs.existsSync(dataPath)) fs.createFileSync(dataPath);
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
 * Bilibili表情包返回数据
 * @since 1.1.0
 * @remarks
 * 接口 https://api.bilibili.com/x/emote/user/panel/web?business=${param}
 * 参数：
 * - "dynamic" 动态表情包
 * - "reply" 评论表情包
 */
declare type BilibiliEmojiResp = {
  /** 状态码 */
  code: number;
  /** 状态信息 */
  message: string;
  /** 有效期 */
  ttl: number;
  /** 数据 */
  data: BilibiliEmojiData;
};

/**
 * Bilibili表情包数据
 * @since 1.1.0
 */
declare type BilibiliEmojiData = {
  /** 设置 */
  setting: BilibiliEmojiSetting;
  /** 包列表 */
  packages: Array<BilibiliEmojiPackage>;
};

/**
 * Bilibili表情包数据设置
 * @since 1.1.0
 */
declare type BilibiliEmojiSetting = {
  /** 最近使用限制 */
  recent_limit: number;
  /** 未知属性 */
  attr: number;
  /** 关注包ID */
  focus_pkg_id: number;
  /** SCHEMA 地址 */
  schema: string;
};

/**
 * Bilibili表情包
 * @since 1.1.0
 */
declare type BilibiliEmojiPackage = {
  /** 包ID */
  id: number;
  /** 包名称 */
  text: string;
  /** 包封面地址 */
  url: string;
  /** 修改时间 */
  mtime: number;
  /** 包类型 */
  type: number;
  /** 未知属性 */
  attr: number;
  /** 包元数据 */
  meta: {
    /** 包大小 */
    size: number;
    /** 包ID */
    item_id: number;
  };
  /** 包表情列表 */
  emote: Array<BilibiliEmojiItem>;
  /** 包判断符 */
  flags: {
    /** 是否已添加 */
    added: boolean;
    /** 是否预览 */
    preview: boolean;
  };
  /** 标签 */
  label: unknown;
  /** 包副标题 */
  package_sub_title: string;
  /** 引用ID */
  ref_mid: number;
  /** 资源类型 */
  resource_type: number;
};

/**
 * Bilibili表情包表情
 * @since 1.1.0
 */
declare type BilibiliEmojiItem = {
  /** 表情ID */
  id: number;
  /** 包ID */
  package_id: number;
  /** 表情名称 */
  text: string;
  /** 表情地址 */
  url: string;
  /** 修改时间 */
  mtime: number;
  /** 表情类型 */
  type: number;
  /** 未知属性 */
  attr: number;
  /** 表情元数据 */
  meta: {
    /** 表情大小 */
    size: number;
    /** 关键词 */
    suggest: Array<string>;
    /** 别名 */
    alias: string;
  };
  /** 表情判断符 */
  flags: {
    /** 是否解锁 */
    unlocked: boolean;
  };
  /** 活动 */
  activity: unknown;
};

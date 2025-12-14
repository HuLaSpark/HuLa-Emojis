/**
 * 小黑盒表情包处理
 * @since 1.3.0
 */
import type { HulaEmojiData, HulaEmojiSeries } from "../hula-emojis.js";
import ora from "ora";
import { getRelativePath } from "../utils/getRelativePath.mjs";
import fs from "fs-extra";

const HeyboxEmojiApi: Readonly<string> = "https://api.xiaoheihe.cn/bbs/app/api/emojis/list";
const HeyboxVersion: Readonly<string> = "2.5";

const spinner = ora("正在获取小黑盒表情包数据...").start();
const start = Date.now();
const timeTs = Math.floor(start / 1000);
const resp = await fetch(
  `${HeyboxEmojiApi}?web_version=${HeyboxVersion}&x_app=heybox_website&_time=${timeTs}`,
);
const respJson = (await resp.json()) as HeyboxEmojiResp;
spinner.succeed("获取小黑盒表情包成功");
const heyboxEmojiData: HulaEmojiData = {
  name: "小黑盒表情包",
  version: respJson.result.emoji_version,
  identifier: "HeyBox",
  updateTime: Date.now(),
  series: [],
};
for (const group of respJson.result.emoji_groups) {
  if (group.emojis.length === 0) continue;
  heyboxEmojiData.series.push(transData(group));
}
spinner.succeed("数据处理完成");
spinner.start("正在写入数据...");
const dataPath = getRelativePath("data", "heybox.json");
heyboxEmojiData.series.sort((a, b) => a.id! - b.id!);
if (!fs.existsSync(getRelativePath("data"))) fs.mkdirSync(getRelativePath("data"));
if (!fs.existsSync(dataPath)) fs.createFileSync(dataPath);
await fs.writeJson(dataPath, heyboxEmojiData, { spaces: 2 });
spinner.succeed(`数据写入完成: ${dataPath}`);
const end = Date.now();
spinner.info(`耗时: ${end - start}ms`);

/// 使用到的方法 ///
/**
 * 转换数据
 * @since 1.1.0
 * @param {BilibiliEmojiPackage} data 数据
 * @returns {HulaEmojiSeries} 转换后数据
 */
function transData(data: HeyboxEmojiGroup): HulaEmojiSeries {
  let name = data.expression_pack_name;
  if (name === "") name = data.group_name;
  const series: HulaEmojiSeries = {
    name: name,
    identifier: `heybox-${data.group_code}`,
    num: 0,
    cover: data.group_img,
    id: data.type,
    emojis: [],
  };
  for (const emojiItem of data.emojis) {
    series.emojis.push({
      name: emojiItem.code,
      identifier: `heybox-${data.group_code}-${emojiItem.code}`,
      url: emojiItem.img,
    });
  }
  series.num = series.emojis.length;
  return series;
}

/// 用到的类型 ///
/**
 * 小黑盒表情包返回响应
 * @since 1.3.0
 * @remarks
 * 接口：https://api.xiaoheihe.cn/bbs/app/api/emojis/list
 * 参数：
 * - web_version
 * - x_app: heybox_website
 * - _time: 秒级时间戳
 */
declare type HeyboxEmojiResp = {
  /** 状态 */
  status: string;
  /** 信息 */
  msg: string;
  /** 版本 */
  version: string;
  /** 结果 */
  result: HeyboxEmojiRes;
};

/**
 * 小黑盒表情包返回数据
 * @since 1.3.0
 */
declare type HeyboxEmojiRes = {
  /** 表情包版本 */
  emoji_version: string;
  /** 表情包分组 */
  emoji_groups: Array<HeyboxEmojiGroup>;
};

/**
 * 小黑盒表情包分组数据
 * @since 1.3.0
 */
declare type HeyboxEmojiGroup = {
  /** 分组封面 */
  group_img: string;
  /** 分组标识符 */
  group_code: string;
  /**
   * 描述文本
   * @remarks 可能为空
   */
  expression_pack_name: string;
  /**
   * 资源来源
   * @remarks ZIP 压缩包
   */
  source_url: string;
  /** 分组名称 */
  group_name: string;
  /** 表情包列表 */
  emojis: Array<HeyboxEmoji>;
  /**
   * 分组类型
   * @remarks 未知
   * - 1:
   * - 2:
   * - 3:
   */
  type: number;
};

/**
 * 小黑盒表情包
 * @since 1.3.0
 */
declare type HeyboxEmoji = {
  /** 编码 */
  code: string;
  /** 类型 */
  type: number;
  /**
   * 名称
   * @remarks 可能为空
   */
  name: string;
  /** 图片 */
  img: string;
};

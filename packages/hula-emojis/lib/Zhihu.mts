/**
 * 知乎表情包处理
 * @since 1.2.6
 */
import type { HulaEmojiData, HulaEmojiSeries } from "../hula-emojis.js";
import ora from "ora";
import axios, { type AxiosResponse } from "axios";
import { createHash } from "node:crypto";
import { getRelativePath } from "../utils/getRelativePath.mjs";
import fs from "fs-extra";

const groupApi: Readonly<string> = "https://www.zhihu.com/api/v4/me/sticker-groups";
const stickerApi: string = "https://www.zhihu.com/api/v4/sticker-groups/{id}";

const spinner = ora("正在获取知乎表情包数据...").start();
const start = Date.now();
const groupSet = new Set<string>();
const groupResp = await axios.get<never, AxiosResponse<ZhihuGroupResp>>(groupApi);
if (groupResp.data.data.length === 0) {
  spinner.fail("获取知乎表情包Group失败");
  process.exit(1);
}
groupResp.data.data.map((item) => groupSet.add(item.id));
spinner.succeed("获取知乎表情包Group成功");
const res: HulaEmojiData = {
  name: "知乎表情包",
  version: "1.0.0",
  identifier: "Zhihu",
  updateTime: Date.now(),
  series: [],
};
for (const groupId of groupSet) {
  spinner.start(`正在获取Group ${groupId} 数据...`);
  const resp = await axios.get<never, AxiosResponse<ZhihuStickerResp>>(
    stickerApi.replace("{id}", groupId),
  );
  if (resp.data.data.stickers.length === 0) continue;
  spinner.succeed(`获取Group ${groupId} 数据成功`);
  spinner.start(`正在处理Group ${groupId} 数据...`);
  res.series.push(transData(resp.data.data));
  spinner.succeed(`处理Group ${groupId} 数据完成`);
}
res.version = createHash("md5").update(JSON.stringify(res.series)).digest("hex");
spinner.start("正在写入数据...");
const dataPath = getRelativePath("data", "zhihu.json");
res.series.sort((a, b) => a.id! - b.id!);
if (!fs.existsSync(getRelativePath("data"))) fs.mkdirSync(getRelativePath("data"));
if (!fs.existsSync(dataPath)) fs.createFileSync(dataPath);
await fs.writeJson(dataPath, res, { spaces: 2 });
spinner.succeed(`数据写入完成: ${dataPath}`);
const end = Date.now();
spinner.info(`耗时: ${end - start}ms`);

/// 用到的函数 ///
function transData(data: ZhihuSticker): HulaEmojiSeries {
  const series: HulaEmojiSeries = {
    name: data.title,
    identifier: `zhihu-${data.id}`,
    num: data.stickers.length,
    cover: data.icon_url,
    id: Number(data.id),
    emojis: [],
  };
  for (const emojiItem of data.stickers) {
    series.emojis.push({
      name: emojiItem.title,
      identifier: `zhihu-${data.id}-${emojiItem.id}`,
      url: emojiItem.dynamic_image_url ?? emojiItem.static_image_url,
      staticUrl: emojiItem.dynamic_image_url ? emojiItem.static_image_url : undefined,
      id: Number(emojiItem.id),
    });
  }
  return series;
}

/// 类型定义 ///
/**
 * 知乎表情包Group返回数据
 * @since 1.2.0
 * @remarks 接口 https://www.zhihu.com/api/v4/me/sticker-groups
 */
declare type ZhihuGroupResp = {
  /** 数据 */
  data: Array<ZhihuGroup>;
};

/**
 * 知乎表情包Group数据
 * @since 1.2.0
 */
declare type ZhihuGroup = {
  /** Group ID */
  id: string;
  /**
   * Group 标题
   * @remarks 需要转义，如："\u9ed8\u8ba4"=>"默认"
   */
  title: string;
  /** Group 图标地址 */
  icon_url: string;
  /** Group 表情包数量 */
  sticker_count: number;
  /** Group 版本 */
  version: number;
  /** Group 选中图标地址 */
  selected_icon_url: string | null;
  /**
   * Group 类型
   * @remarks vip|official|emoji
   */
  type: string;
};

/**
 * 知乎表情包返回数据
 * @since 1.2.0
 * @remarks 接口 https://www.zhihu.com/api/v4/sticker-groups/{id}
 */
declare type ZhihuStickerResp = {
  /** 数据 */
  data: ZhihuSticker;
};

/**
 * 知乎表情包数据
 * @since 1.2.0
 */
declare type ZhihuSticker = {
  /** 表情包ID */
  id: string;
  /**
   * 表情包标题
   * @remarks 需要转义
   */
  title: string;
  /** 表情包图标地址 */
  icon_url: string;
  /** 表情包版本 */
  version: number;
  /** 表情包类型 */
  type: string;
  /** stickers */
  stickers: Array<ZhihuStickerItem>;
  /** 表情包选中图标地址 */
  selected_icon_url: string;
};

/**
 * @description 知乎表情包Item
 * @since 1.2.0
 * @type ZhihuStickerItem
 * @property {string} id 表情包ID
 * @property {string} title 表情包标题，需要转义
 * @property {string|null} dynamic_image_url 表情包动态图地址
 * @property {string} static_image_url 表情包静态图地址
 * @property {string} group_id 表情包Group ID
 */
declare type ZhihuStickerItem = {
  /** 表情包ID */
  id: string;
  /**
   * 表情包标题
   * @remarks 需要转义
   */
  title: string;
  /** 表情包动态图地址 */
  dynamic_image_url: string | null;
  /** 表情包静态图地址 */
  static_image_url: string;
  /** 表情包Group ID */
  group_id: string;
};

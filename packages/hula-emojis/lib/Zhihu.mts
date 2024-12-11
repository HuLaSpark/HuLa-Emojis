/**
 * @file lib/Zhihu.ts
 * @description 知乎表情包处理
 * @since 1.2.0
 */
import { HulaEmojiData, HulaEmojiSeries } from "../hula-emojis.js";
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
 * @description 知乎表情包Group返回数据
 * @since 1.2.0
 * @api https://www.zhihu.com/api/v4/me/sticker-groups
 * @type ZhihuGroupResp
 * @property {ZhihuGroup[]} data 数据
 */
declare type ZhihuGroupResp = {
  data: ZhihuGroup[];
};

/**
 * @description 知乎表情包Group数据
 * @since 1.2.0
 * @type ZhihuGroup
 * @property {string} id Group ID
 * @property {string} title Group 标题，需要转义，如："\u9ed8\u8ba4"=>"默认"
 * @property {string} icon_url Group 图标地址
 * @property {number} sticker_count Group 表情包数量
 * @property {number} version Group 版本
 * @property {string|null} selected_icon_url Group 选中图标地址
 * @property {string} type Group 类型 vip|official|emoji
 */
declare type ZhihuGroup = {
  id: string;
  title: string;
  icon_url: string;
  sticker_count: number;
  version: number;
  selected_icon_url: string | null;
  type: string;
};

/**
 * @description 知乎表情包返回数据
 * @since 1.2.0
 * @api https://www.zhihu.com/api/v4/sticker-groups/{id}
 * @type ZhihuStickerResp
 * @property {ZhihuSticker} data 数据
 */
declare type ZhihuStickerResp = {
  data: ZhihuSticker;
};

/**
 * @description 知乎表情包数据
 * @since 1.2.0
 * @type ZhihuSticker
 * @property {string} id 表情包ID
 * @property {string} title 表情包标题，需要转义
 * @property {string} icon_url 表情包图标地址
 * @property {number} version 表情包版本
 * @property {string} type 表情包类型
 * @property {ZhihuStickerItem[]} stickers 表情包列表
 * @property {string} selected_icon_url 表情包选中图标地址
 */
declare type ZhihuSticker = {
  id: string;
  title: string;
  icon_url: string;
  version: number;
  type: string;
  stickers: ZhihuStickerItem[];
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
  id: string;
  title: string;
  dynamic_image_url: string | null;
  static_image_url: string;
  group_id: string;
};

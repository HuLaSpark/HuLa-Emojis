/**
 * @file hu-emojis.d.ts
 * @description 表情包类型定义
 * @since 1.2.0
 */

/**
 * @description 单个表情包类型
 * @since 1.0.0
 * @type HulaEmojiItem
 * @property {string} name 表情包名称
 * @property {string} identifier 表情包标识符
 * @property {string} url 表情包地址
 * @property [string] staticUrl 静态表情包地址
 * @property [number] id 表情包ID
 * @property [number] sortOrder 排序序号
 */
declare type HulaEmojiItem = {
  name: string;
  identifier: string;
  url: string;
  staticUrl?: string;
  id?: number;
  sortOrder?: number;
};

/**
 * @description 表情包系列类型
 * @since 1.0.0
 * @type HulaEmojiSeries
 * @property {string} name 表情包系列名称
 * @property {string} identifier 表情包系列标识符
 * @property {number} num 表情包数量
 * @property {string} cover 表情包封面
 * @property [number] sortOrder 排序序号
 * @property [number] id 系列ID
 * @property {HulaEmojiItem[]} emojis 表情包列表
 */
export declare type HulaEmojiSeries = {
  name: string;
  identifier: string;
  num: number;
  cover: string;
  sortOrder?: number;
  id?: number;
  emojis: HulaEmojiItem[];
};

/**
 * @description 表情包类型
 * @since 1.2.0
 * @type HulaEmojiTypeEnum
 * @property {MihoyoBbs} MihoyoBbs 米游社表情包
 * @property {Bilibili} Bilibili Bilibili表情包
 * @property {Zhihu} Zhihu 知乎表情包
 */
declare enum HulaEmojiTypeEnum {
  MihoyoBbs,
  Bilibili,
  Zhihu,
}

/**
 * @description 表情包类型
 * @since 1.0.0
 * @type HulaEmojiType
 */
export declare type HulaEmojiType = keyof typeof HulaEmojiTypeEnum;

/**
 * @description 表情包元数据类型
 * @since 1.0.0
 */
export declare type HulaEmojiData = {
  name: string;
  version: string;
  identifier: HulaEmojiType;
  updateTime: number;
  series: HulaEmojiSeries[];
};
export const HulaEmojis: Record<HulaEmojiType, HulaEmojiData>;
export default HulaEmojis;

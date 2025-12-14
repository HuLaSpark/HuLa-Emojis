/**
 * 表情包类型定义
 * @since 1.2.0
 */

/**
 * 单个表情包类型
 * @since 1.0.0
 */
declare type HulaEmojiItem = {
  /** 表情包名称 */
  name: string;
  /** 表情包标识符 */
  identifier: string;
  /** 表情包地址 */
  url: string;
  /** 静态表情包地址 */
  staticUrl?: string;
  /** 表情包 ID */
  id?: number;
  /** 排序序号 */
  sortOrder?: number;
};

/**
 * 表情包系列类型
 * @since 1.0.0
 */
export declare type HulaEmojiSeries = {
  /** 表情包系列名称 */
  name: string;
  /** 表情包系列标识符 */
  identifier: string;
  /** 表情包数量 */
  num: number;
  /** 表情包封面 */
  cover: string;
  /** 排序序号 */
  sortOrder?: number;
  /** 系列ID */
  id?: number;
  /** 表情包列表 */
  emojis: Array<HulaEmojiItem>;
};

/**
 * 表情包类型
 * @since 1.2.0
 */
// eslint-disable-next-line @typescript-eslint/no-unused-vars
declare enum HulaEmojiTypeEnum {
  /** 米游社 */
  MihoyoBbs,
  /** 哔哩哔哩 */
  Bilibili,
  /** 知乎 */
  Zhihu,
  /** 小黑盒 */
  HeyBox,
}

/**
 * @description 表情包类型
 * @since 1.0.0
 * @type HulaEmojiType
 */
export declare type HulaEmojiType = keyof typeof HulaEmojiTypeEnum;

/**
 * 表情包元数据类型
 * @since 1.0.0
 */
export declare type HulaEmojiData = {
  /** 平台名称 */
  name: string;
  /** 版本号 */
  version: string;
  /** 平台标识符 */
  identifier: HulaEmojiType;
  /** 更新时间 */
  updateTime: number;
  /** 表情包系列列表 */
  series: Array<HulaEmojiSeries>;
};
export const HulaEmojis: Record<HulaEmojiType, HulaEmojiData>;
export default HulaEmojis;

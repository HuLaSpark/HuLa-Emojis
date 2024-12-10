/**
 * @file types/Plugins.d.ts
 * @description 插件类型定义
 * @since 1.0.0
 */

declare namespace HulaEmojis.Plugins {
  /**
   * @description 插件配置项
   * @since 1.0.0
   * @type InitOptions
   * @property {string} name 插件名称
   * @property {string} version 插件版本
   * @property {string} identifier 插件标识符
   */
  type InitOptions = {
    name: string;
    version: string;
    identifier: string;
  };

  /**
   * @description 插件元数据内容
   * @since 1.0.0
   * @type MetaContent
   * @property {string} name 插件名称
   * @property {string} version 插件版本
   * @property {string} identifier 插件标识符
   * @property {number} updateTime 更新时间(秒级时间戳)
   * @property {SeriesMeta[]} series 系列元数据
   */
  type MetaContent = {
    name: string;
    version: string;
    identifier: string;
    updateTime: number;
    series: SeriesMeta[];
  };

  /**
   * @description 系列元数据
   * @since 1.0.0
   * @type SeriesMeta
   * @property {string} name 系列名称
   * @property {string} identifier 系列标识符，用于生成目录名
   * @property {number} num 表情包数量
   * @property [number] sortOrder 排序序号
   * @property [number] id 系列ID
   * @property {EmojiMeta[]} emojis 表情元数据
   */
  type SeriesMeta = {
    name: string;
    identifier: string;
    num: number;
    sortOrder?: number;
    id?: number;
    emojis: EmojiMeta[];
  };

  /**
   * @description 表情元数据
   * @since 1.0.0
   * @type EmojiMeta
   * @property {string} name 表情名称
   * @property {string} identifier 表情标识符，用于生成文件名
   * @property {string} url 表情链接
   * @property [string] staticUrl 静态表情链接
   * @property [number] id 表情ID
   * @property [number] sortOrder 排序序号
   */
  type EmojiMeta = {
    name: string;
    identifier: string;
    url: string;
    staticUrl?: string;
    id?: number;
    sortOrder?: number;
  };
}

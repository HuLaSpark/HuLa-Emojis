/**
 * @file types/App.d.ts
 * @description 应用类型定义
 * @since 1.0.0
 */

declare namespace HulaEmojis.App {
  /**
   * @description 应用插件配置
   * @since 1.0.0
   * @type PluginOptions
   * @property {string} name 应用名称
   * @property {string} version 应用版本
   * @property {string} identifier 应用标识符
   * @property {boolean} isLoaded 是否已加载
   */
  type PluginOptions = {
    name: string;
    version: string;
    identifier: string;
    isLoaded: boolean;
  };
}

/**
 * @file core/HulaEmojis.ts
 * @description 表情包核心功能
 * @since 1.0.0
 */

import MihoyoBbsPlugin from "@/plugins/MihoyoBbs.ts";
import { HulaEmojisPluginInstance } from "@/template/Plugins.ts";

const pluginBbs = MihoyoBbsPlugin.getInstance();

class HulaEmojis {
  public plugins: HulaEmojis.App.PluginOptions[] = [];

  constructor() {
    this.loadPlugin(pluginBbs);
  }

  /**
   * @description 加载插件
   */
  async init(): Promise<void> {
    for (const plugin of this.plugins) {
      const instance = this.getPlugin(plugin);
      if (instance === undefined) {
        plugin.isLoaded = false;
        continue;
      }
      await instance.init();
      plugin.isLoaded = true;
    }
  }

  private getPlugin(plugin: HulaEmojis.App.PluginOptions): HulaEmojisPluginInstance | undefined {
    if (plugin.identifier === pluginBbs.identifier) {
      return pluginBbs;
    }
    return undefined;
  }

  /**
   * @description 加载插件
   * @param {HulaEmojisPlugin} plugin 插件实例
   */
  private loadPlugin(plugin: HulaEmojisPluginInstance): void {
    this.plugins.push({
      name: plugin.name!,
      version: plugin.version!,
      identifier: plugin.identifier!,
      isLoaded: false,
    });
  }
}

export default HulaEmojis;

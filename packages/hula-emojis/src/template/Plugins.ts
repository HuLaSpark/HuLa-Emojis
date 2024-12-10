/**
 * @file template/Plugins.ts
 * @description 插件配置模板
 * @since 1.0.0
 */

abstract class HulaEmojisPlugin {
  name: string | undefined;
  version: string | undefined;
  identifier: string | undefined;
  iconDir: string | undefined;
  metaFile: string | undefined;

  abstract init(): Promise<void>;

  abstract update(): Promise<void>;

  abstract needUpdate(): Promise<boolean>;

  abstract updateMeta(): Promise<void>;
}

export type HulaEmojisPluginInstance = InstanceType<typeof HulaEmojisPlugin>;
export default HulaEmojisPlugin;

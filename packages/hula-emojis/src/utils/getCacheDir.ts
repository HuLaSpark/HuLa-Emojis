/**
 * @file utils/getCacheDir.ts
 * @description 获取缓存目录
 * @since 1.0.0
 */
import os from "node:os";
import path from "node:path";
import { HulaEmojisPluginInstance } from "@/template/Plugins.ts";

export function getCacheDir(plugin: HulaEmojisPluginInstance): string {
  const docDir = path.join(os.homedir(), "Documents", "HulaEmojis");
  return path.join(docDir, typeof plugin.identifier === "string" ? plugin.identifier : "cache");
}

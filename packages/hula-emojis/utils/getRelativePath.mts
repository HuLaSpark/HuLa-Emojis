/**
 * @file utils/getRelativePath.ts
 * @description 获取相对路径
 * @since 1.0.0
 */

import appRootPath from "app-root-path";
import { platform } from "node:os";

export function getRelativePath(...paths: string[]): string {
  const sep = platform() === "win32" ? "\\" : "/";
  const relativePathArr = ["packages", "hula-emojis", ...paths];
  return appRootPath.resolve(relativePathArr.join(sep));
}

/**
 * @file utils/getRelativePath.ts
 * @description 获取相对路径
 * @since 1.2.6
 */

import appRootPath from "app-root-path";
import { platform } from "node:os";

export function getRelativePath(...paths: string[]): string {
  const sep = platform() === "win32" ? "\\" : "/";
  const relativePathArr = ["packages", "hula-emojis", ...paths];
  return appRootPath.resolve(relativePathArr.join(sep));
}

export function getRootPath(...paths: string[]): string {
  const sep = platform() === "win32" ? "\\" : "/";
  const relativePathArr = [...paths];
  return appRootPath.resolve(relativePathArr.join(sep));
}

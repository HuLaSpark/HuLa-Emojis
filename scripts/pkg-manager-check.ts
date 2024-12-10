/**
 * @file scripts/pkg-manager-check.ts
 * @description 包管理检测
 * @since 2024-12-10
 */

import { existsSync } from "fs-extra";
import ora from "ora";

const spinner = ora("检测包管理工具中...").start();
const yarnCheck: boolean = existsSync("yarn.lock");
const npmCheck: boolean = existsSync("package-lock.json");
const pnpmCheck: boolean = existsSync("pnpm-lock.yaml");
if (yarnCheck || npmCheck) {
  const lockType: string[] = [];
  if (yarnCheck) lockType.push("Yarn");
  if (npmCheck) lockType.push("NPM");
  spinner.warn(`检测到项目中存在${lockType.join("和")}的 .lock 文件`);
  spinner.warn(`本项目采用 Pnpm 作为包管理工具，使用${lockType.join("或")}可能会导致依赖不一致`);
  spinner.warn("请移除项目中的 .lock 文件并使用 Pnpm 重新安装依赖");
  spinner.warn("详见：https://pnpm.io/");
  process.exit(1);
}
if (!pnpmCheck) {
  spinner.warn("未检测到项目中存在 Pnpm 的 lock 文件");
  spinner.warn("请使用 Pnpm 安装依赖");
  spinner.warn("详见：https://pnpm.io/");
  process.exit(1);
}
spinner.succeed("包管理检测通过");
spinner.stop();

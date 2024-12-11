/**
 * @file scripts/update.ts
 * @description 更新脚本
 * @since 1.0.0
 */
import fs from "fs-extra";
import { spawnSync } from "node:child_process";
import { getRelativePath } from "../utils/getRelativePath.mjs";

const libDir = getRelativePath("lib");
const files = fs.readdirSync(libDir);
for (const file of files) {
  spawnSync("tsx", [getRelativePath("lib", file)], { shell: true, stdio: "inherit" });
}

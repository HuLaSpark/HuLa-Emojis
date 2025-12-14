/**
 * 自动更新版本号
 * @since 2025-12-14
 */

import ora from "ora";
import { writeFileSync, readFileSync } from "fs";
import { resolve } from "path";

const hulaEmojisDir = resolve(__dirname, "../packages/hula-emojis");
const versionSp = ora("检测版本号中...").start();
const pkgPath = resolve(hulaEmojisDir, "package.json");
const pkg = JSON.parse(readFileSync(pkgPath, "utf-8"));
// const version = pkg.version.split(".");
// const patch = parseInt(version[2]) + 1;
// const newVersion = `${version[0]}.${version[1]}.${patch}`;
const newVersion = "1.3.0";
pkg.version = newVersion;
writeFileSync(pkgPath, JSON.stringify(pkg, null, 2));
versionSp.succeed(`版本号更新为：${newVersion}`);
const changeSp = ora("生成变更日志中...").start();
const changelogPath = resolve(hulaEmojisDir, "CHANGELOG.md");
const changelog = readFileSync(changelogPath, "utf-8").split("\n");
changelog.splice(0, 2);
const date = new Date().toISOString().split("T")[0];
const newLines = ["# 更新日志", "", `## ${newVersion} (${date})`, "", "- 🍱 添加小黑盒表情包", ""];
changelog.unshift(...newLines);
writeFileSync(changelogPath, changelog.join("\n"));
changeSp.succeed("变更日志生成成功");

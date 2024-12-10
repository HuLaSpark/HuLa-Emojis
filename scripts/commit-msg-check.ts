/**
 * @file scripts/commit-msg-check.ts
 * @description Commit message 检测
 * @since 2024-12-10
 */

import ora from "ora";
import { readFileSync } from "fs";
import commitMsgTypes from "../config/commit-msg";

const spinner = ora("检测 Commit Message 中...").start();
const msgFile = process.argv[2];
if (!msgFile) {
  spinner.fail("未检测到 Commit Message");
  spinner.stop();
  process.exit(1);
}
const commitMsg = readFileSync(msgFile, "utf-8").replace(/\n$/, "");
const commitMsgType = commitMsgTypes.find((type) => commitMsg.startsWith(type.value));
if (!commitMsgType) {
  spinner.fail("Commit Message 格式错误");
  spinner.fail("请使用规范的 Commit Message");
  spinner.fail("详见：https://www.conventionalcommits.org/zh-hans/");
  spinner.stop();
  process.exit(1);
}
spinner.succeed("Commit Message 格式正确");
spinner.stop();

# 贡献指南

## 方式

我们欢迎任何形式的贡献，包括但不限于以下几种：

- 提交 Issue，反馈问题或建议
- 参与 Issue 讨论
- 参与 Pull Request
- 完善文档

## Pull Request 要求

- 请先提交 Issue，并在 Issue 中讨论您要做的改动
- 请确保代码风格一致，该部分由 `lint-staged` 和 `husky` 自动检查构成：
  > 注意：该项目提交信息**不完全遵循** [Angular 规范](https://github.com/angular/angular/blob/22b96b9/CONTRIBUTING.md#-commit-message-guidelines)。
  > 项目提交信息大部分与 Angular 规范一致，但是 `header` 部分结合 [Gitmoji](https://gitmoji.dev/)，采用类似于 `🎉 项目初始化` 的格式。
  > 如果你使用的是 JetBrains 系列 IDE，可以使用 [GitmojiPlusCommitButton(https://plugins.jetbrains.com/plugin/12383-gitmoji-plus-commit-button) 插件来帮助你生成提交信息。

## 目录结构

项目 `packages` 目录下包括 `hula-emojis` 主项目与 `demo` 示例项目，后者用于演示 `hula-emojis` 的使用。

## 新增 Emoji

如果你想新增 Emoji，请按照以下步骤操作：（以新增米游社表情包为例）

1. 在 `packages/hula-emojis/lib/` 目录下新增 `MihoyoBbs.ts` 文件，文件名与来源的 `identifier` 保持一致
2. 在 `packages/hula-emojis/hula-emojis.d.ts` 的 `HulaEmojiTypeEnum` 枚举中新增 `MihoyoBbs` 类型
3. 在 `MihoyoBbs.ts` 文件中处理表情包元数据的下载转换，确保转换后的格式符合 `HulaEmojiData` 接口，并将数据导出到 `data/mihoyo-bbs.json` 文件
4. 运行 `pnpm update` 更新 `hula-emojis` 包，运行 `pnpm build` 构建项目
5. 提交 PR

# HuLa-Emojis

[![FOSSA Status](https://app.fossa.com/api/projects/git%2Bgithub.com%2FHuLaSpark%2FHuLa-Emojis.svg?type=shield)](https://app.fossa.com/projects/git%2Bgithub.com%2FHuLaSpark%2FHuLa-Emojis?ref=badge_shield)
[![NPM Version](https://img.shields.io/npm/v/hula-emojis?style=flat-square)](https://npmjs.org/package/hula-emojis)
![GitHub last commit](https://img.shields.io/github/last-commit/HuLaSpark/HuLa-Emojis?style=flat-square)

HuLa 表情包的 Monorepo 仓库，负责管理/打包/发布 HuLa 表情包。

## 数据概览

| 表情包         | 系列数 |  表情数 | GIF表情数 | 文本表情数 |
| :---------- | --: | ---: | -----: | ----: |
| 总计          |  27 | 3189 |    278 |   108 |
| Bilibili表情包 |   4 |  372 |      0 |    52 |
| 米游社表情包      |  14 | 2622 |    197 |     0 |
| 知乎表情包       |   9 |  195 |     81 |    56 |

## 参考

- [Vuetify](https://github.com/vuetifyjs/vuetify)：借鉴其Monorepo目录结构
- [Gitmoji](https://github.com/patou/gitmoji-intellij-plugin/)：提交信息类型
- [bangumi-data](https://github.com/bangumi-data/bangumi-data)：打包发布流程

## 使用

```shell
pnpm i hula-emojis
```

```typescript
import HulaEmojis from "hula-emojis";

const emojisBbs = HulaEmojis.MihoyoBbs;
```

## License

项目遵循 [MIT License](./LICENSE.md) 开源协议。


[![FOSSA Status](https://app.fossa.com/api/projects/git%2Bgithub.com%2FHuLaSpark%2FHuLa-Emojis.svg?type=large)](https://app.fossa.com/projects/git%2Bgithub.com%2FHuLaSpark%2FHuLa-Emojis?ref=badge_large)

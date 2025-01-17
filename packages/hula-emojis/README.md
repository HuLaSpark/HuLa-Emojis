# HuLa-Emojis

[![NPM Version](https://img.shields.io/npm/v/hula-emojis?style=flat-square)](https://npmjs.org/package/hula-emojis)
![NPM Last Update](https://img.shields.io/npm/last-update/hula-emojis)
![npm bundle size](https://img.shields.io/bundlephobia/min/hula-emojis?style=flat-square)
![npm bundle size](https://img.shields.io/bundlephobia/minzip/hula-emojis?style=flat-square)

HuLa 表情包数据。

## 数据概览

| 表情包         | 系列数 |  表情数 | GIF表情数 | 文本表情数 |
| :---------- | --: | ---: | -----: | ----: |
| 总计          |  27 | 2991 |    278 |   108 |
| Bilibili表情包 |   4 |  363 |      0 |    52 |
| 米游社表情包      |  14 | 2433 |    197 |     0 |
| 知乎表情包       |   9 |  195 |     81 |    56 |

## 使用

```shell
pnpm i hula-emojis
```

```typescript
import HulaEmojis from "hula-emojis";

const emojisBbs = HulaEmojis.MihoyoBbs;
```

## 类型声明

详见 [hula-emojis.d.ts](./hula-emojis.d.ts)。

单个表情包的数据结构如下：

```typescript
/**
 * @description 单个表情包类型
 * @since 1.0.0
 * @type HulaEmojiItem
 * @property {string} name 表情包名称
 * @property {string} identifier 表情包标识符
 * @property {string} url 表情包地址
 * @property [string] staticUrl 静态表情包地址
 * @property [number] id 表情包ID
 * @property [number] sortOrder 排序序号
 */
type HulaEmojiItem = {
  name: string;
  identifier: string;
  url: string;
  staticUrl?: string;
  id?: number;
  sortOrder?: number;
};
```

表情包系列的数据结构如下：

```typescript
/**
 * @description 表情包系列类型
 * @since 1.0.0
 * @type HulaEmojiSeries
 * @property {string} name 表情包系列名称
 * @property {string} identifier 表情包系列标识符
 * @property {number} num 表情包数量
 * @property {string} cover 表情包封面
 * @property [number] sortOrder 排序序号
 * @property [number] id 系列ID
 * @property {HulaEmojiItem[]} emojis 表情包列表
 */
type HulaEmojiSeries = {
  name: string;
  identifier: string;
  num: number;
  cover: string;
  sortOrder?: number;
  id?: number;
  emojis: HulaEmojiItem[];
};
```

按平台分类的表情包数据结构如下：

```typescript
/**
 * @description 表情包元数据类型
 * @since 1.0.0
 * @type HulaEmojiData
 * @property {string} name 平台名称
 * @property {string} version 版本号
 * @property {HulaEmojiType} identifier 平台标识符
 * @property {number} updateTime 更新时间
 * @property {HulaEmojiSeries[]} series 表情包系列列表
 * @return HulaEmojiData
 */
type HulaEmojiData = {
  name: string;
  version: string;
  identifier: HulaEmojiType;
  updateTime: number;
  series: HulaEmojiSeries[];
};
```

目前来源平台有：

- [米游社](https://bbs.mihoyo.com/ys/)
- [Bilibili](https://www.bilibili.com/)
- [知乎](https://www.zhihu.com/)

## LICENSE

项目遵循 [MIT License](./LICENSE.md) 开源协议。

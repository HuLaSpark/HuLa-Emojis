/**
 * @file plugins/MihoyoBbs.ts
 * @description 米游社表情包插件
 * @since 1.0.0
 */
import HulaEmojisPlugin from "@/template/Plugins.ts";
import { getCacheDir } from "@/utils/getCacheDir.ts";
import { mkdir, mkdirSync, createFile, createFileSync, writeJSON, readJSON } from "fs-extra";
import axios from "axios";
import { existsSync } from "node:fs";
import { createHash } from "node:crypto";
import sharp from "sharp";

class MihoyoBbsPlugin implements HulaEmojisPlugin {
  name: string;
  version: string;
  identifier: string;
  iconDir: string | undefined;
  metaFile: string | undefined;
  private static instance: MihoyoBbsPlugin;

  constructor() {
    this.name = "米游社表情包";
    this.version = "1.0.0";
    this.identifier = "mihoyo-bbs";
    const cacheDir = getCacheDir(this);
    this.iconDir = `${cacheDir}/icons`;
    this.metaFile = `${cacheDir}/meta.json`;
    mkdirSync(cacheDir, { recursive: true });
    mkdirSync(this.iconDir, { recursive: true });
    createFileSync(this.metaFile);
  }

  public static getInstance(): MihoyoBbsPlugin {
    if (MihoyoBbsPlugin.instance === undefined) {
      MihoyoBbsPlugin.instance = new MihoyoBbsPlugin();
    }
    return MihoyoBbsPlugin.instance;
  }

  public async init(): Promise<void> {
    const cacheDir = getCacheDir(this);
    if (this.iconDir === undefined || this.metaFile === undefined) {
      this.iconDir = `${cacheDir}/icons`;
      this.metaFile = `${cacheDir}/meta.json`;
      await mkdir(cacheDir, { recursive: true });
      await mkdir(this.iconDir, { recursive: true });
      await createFile(this.metaFile);
    }
    await this.updateMeta();
  }

  public async update(): Promise<void> {
    const needUpdate = await this.needUpdate();
    if (!needUpdate) return;
    await this.updateMeta();
  }

  public async needUpdate(): Promise<boolean> {
    if (this.metaFile === undefined) return true;
    if (this.iconDir === undefined) return true;
    const dirCheck = existsSync(this.iconDir);
    if (!dirCheck) await mkdir(this.iconDir, { recursive: true });
    const metaCheck = existsSync(this.metaFile);
    if (!metaCheck) await createFile(this.metaFile);
    if (!metaCheck || !dirCheck) return true;
    const metaContent: HulaEmojis.Plugins.MetaContent = await readJSON(this.metaFile);
    if (metaContent.updateTime === undefined) return true;
    return Math.floor(Date.now() / 1000) - metaContent.updateTime > 86400;
  }

  public async updateMeta(): Promise<void> {
    if (this.metaFile === undefined) {
      await this.init();
      return;
    }
    const resp = await axios.get<never, HulaEmojis.MihoyoBbs.EmojiResponse>(
      "https://bbs-api-static.miyoushe.com/misc/api/emoticon_set",
    );
    if (resp.retcode !== 0) return;
    const data = resp.data.list;
    const meta = this.transBbsMeta(data);
    await writeJSON(this.metaFile, meta, { spaces: 2 });
    for (const series of meta.series) {
      if (!existsSync(`${this.iconDir}/${series.identifier}`))
        await mkdir(`${this.iconDir}/${series.identifier}`);
      for (const emoji of series.emojis) {
        if (emoji.url.endsWith(".gif") && emoji.staticUrl !== undefined) {
          const staticIconHash = createHash("md5").update(emoji.staticUrl).digest("hex");
          const format = emoji.staticUrl.split(".").pop() ?? "webp";
          const staticIconPath = `${this.iconDir}/${series.identifier}/${staticIconHash}.${format}`;
          if (!existsSync(staticIconPath)) {
            const buffer = await axios.get<never, { data: Buffer }>(emoji.staticUrl, {
              responseType: "arraybuffer",
            });
            await sharp(buffer.data).toFile(staticIconPath);
          }
        }
        const iconHash = createHash("md5").update(emoji.url).digest("hex");
        const format = emoji.url.split(".").pop() ?? "webp";
        const iconPath = `${this.iconDir}/${series.identifier}/${iconHash}.${format}`;
        if (!existsSync(iconPath)) {
          const buffer = await axios.get<never, { data: Buffer }>(emoji.url, {
            responseType: "arraybuffer",
          });
          await sharp(buffer.data).toFile(iconPath);
        }
      }
    }
  }

  private transBbsMeta(data: HulaEmojis.MihoyoBbs.EmojiSeries[]): HulaEmojis.Plugins.MetaContent {
    const res: HulaEmojis.Plugins.MetaContent = {
      name: this.name,
      version: this.version,
      identifier: this.identifier,
      updateTime: Math.floor(Date.now() / 1000),
      series: [],
    };
    const series: HulaEmojis.Plugins.SeriesMeta[] = [];
    for (const seriesRaw of data) {
      if (seriesRaw.status === "draft") continue;
      const seriesItem: HulaEmojis.Plugins.SeriesMeta = {
        name: seriesRaw.name,
        identifier: seriesRaw.id.toString(),
        num: seriesRaw.num,
        emojis: [],
        sortOrder: seriesRaw.sort_order,
        id: seriesRaw.id,
      };
      for (const emojiRaw of seriesRaw.list) {
        if (emojiRaw.status === "draft") continue;
        const emojiItem: HulaEmojis.Plugins.EmojiMeta = {
          name: emojiRaw.name,
          identifier: emojiRaw.id.toString(),
          url: emojiRaw.icon,
          staticUrl: emojiRaw.static_icon === "" ? undefined : emojiRaw.static_icon,
          id: emojiRaw.id,
          sortOrder: emojiRaw.sort_order,
        };
        seriesItem.emojis.push(emojiItem);
      }
      series.push(seriesItem);
    }
    res.series = series;
    return res;
  }
}

export default MihoyoBbsPlugin;

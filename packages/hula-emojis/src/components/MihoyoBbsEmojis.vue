<template>
  <div class="mihoyo-bbs-emojis-view">
    <div v-if="currentSeries === undefined || currentSeries.num === 0" class="emojis-empty">
      暂无数据
    </div>
    <div class="emojis-content" v-else>
      <div v-for="emoji in currentSeries.list" :key="emoji.sort_order" class="emoji-item">
        <img :src="emoji.icon" :alt="emoji.name" class="icon" />
        <span class="name">{{ emoji.name }}</span>
      </div>
    </div>
    <div class="emojis-series">
      <div
        v-for="series in emojisData"
        :key="series.sort_order"
        class="series-item"
        @click="selectSeries(series)"
      >
        <img :src="series.icon" :alt="series.name" class="icon" />
        <span class="name">{{ series.name }}</span>
        <span class="num">{{ series.num }}</span>
      </div>
    </div>
  </div>
</template>
<script lang="ts" setup>
import { onMounted, shallowRef } from "vue";
import axios from "axios";
import MihoyoBbs = HulaEmojis.MihoyoBbs;

const emojisData = shallowRef<MihoyoBbs.EmojiSeries[]>([]);
const currentSeries = shallowRef<MihoyoBbs.EmojiSeries>();

onMounted(async () => await getEmojisData());

async function getEmojisData(): Promise<void> {
  const resp = await axios.get<MihoyoBbs.EmojiResponse>(
    "https://bbs-api-static.miyoushe.com/misc/api/emoticon_set",
  );
  if (resp.data.retcode !== 0) {
    alert(`[${resp.data.retcode}] ${resp.data.message}`);
    return;
  }
  emojisData.value = resp.data.data.list.filter((i) => i.status === "published");
  currentSeries.value = emojisData.value[0];
}

function selectSeries(series: MihoyoBbs.EmojiSeries): void {
  currentSeries.value = series;
}
</script>
<style lang="scss" scoped>
.mihoyo-bbs-emojis-view {
  position: relative;
  display: flex;
  flex-direction: column;
  width: 100%;
  height: 100%;
  padding: 100px;
  box-sizing: border-box;
  overflow: hidden;
  align-items: center;
  justify-content: space-between;
  row-gap: 12px;
}

.emojis-empty {
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
  width: 100%;
  height: 100%;
  font-size: 16px;
  color: #666;
  background: #eeeeee;
  border-radius: 12px;
}

.emojis-content {
  position: relative;
  display: flex;
  flex-wrap: wrap;
  width: 100%;
  height: auto;
  align-items: center;
  justify-content: flex-start;
  max-height: 400px;
  overflow-y: auto;

  .emoji-item {
    position: relative;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    cursor: pointer;
    row-gap: 4px;
    padding: 12px;

    .icon {
      position: relative;
      width: 64px;
      height: 64px;
      border-radius: 8px;
      border: 1px solid rgba(0, 0, 0, 0.2);
    }

    .name {
      position: relative;
      font-size: 12px;
      color: #333;
      margin-top: 4px;
    }
  }
}

.emojis-series {
  position: relative;
  display: flex;
  overflow-x: auto;
  flex-wrap: nowrap;
  column-gap: 8px;
  padding: 8px 0;
  box-sizing: border-box;
  width: 100%;
  height: auto;
  align-items: center;
  justify-content: flex-start;
  overflow-y: hidden;
}

.series-item {
  position: relative;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  row-gap: 4px;
  padding: 12px;

  .icon {
    position: relative;
    width: 64px;
    height: 64px;
    border-radius: 8px;
    border: 1px solid rgba(0, 0, 0, 0.2);
  }

  .name {
    position: relative;
    font-size: 12px;
    color: #333;
    margin-top: 4px;
  }

  .num {
    position: absolute;
    top: 4px;
    right: 4px;
    font-size: 12px;
    color: #666;
  }
}
</style>

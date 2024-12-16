<template>
  <div class="demo">
    <div class="container" v-if="currentSeries !== null">
      <div class="emoji-item" v-for="item in currentSeries.emojis" :key="item.identifier">
        <img
          :src="item.url"
          :alt="item.name"
          class="logo"
          crossorigin="anonymous"
          referrerpolicy="no-referrer"
          v-if="item.url.startsWith('http')"
        />
        <div v-else class="text">{{ item.url }}</div>
        <div>{{ item.name ?? item.url }}</div>
      </div>
    </div>
    <div v-else class="empty">没有选中的表情包系列</div>
    <div class="emoji-series" v-if="currentType !== null">
      <div
        v-for="series in HulaEmojis[currentType].series"
        :key="series.identifier"
        @click="currentSeries = series"
      >
        <img
          :src="series.cover"
          :alt="series.name"
          class="logo"
          crossorigin="anonymous"
          referrerpolicy="no-referrer"
        />
        <div>{{ series.name }}</div>
      </div>
    </div>
  </div>
</template>
<script setup lang="ts">
import { ref, onMounted } from "vue";
import HulaEmojis, { type HulaEmojiSeries, type HulaEmojiType } from "hula-emojis";

const currentSeries = ref<HulaEmojiSeries | null>(null);
const currentType = ref<HulaEmojiType>("MihoyoBbs");
const types = Object.keys(HulaEmojis) as HulaEmojiType[];

onMounted(() => {
  currentType.value = types[0];
  currentSeries.value = HulaEmojis[currentType.value].series[0];
});
</script>

<style lang="scss" scoped>
.demo {
  display: flex;
  flex-wrap: wrap;
  gap: 1rem;
  padding: 1rem;

  .container {
    display: flex;
    flex-wrap: wrap;
    gap: 1rem;
  }

  .emoji-item {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 0.5rem;

    .logo {
      width: 3rem;
      height: 3rem;
      border-radius: 50%;
    }

    .text {
      white-space: nowrap;
      font-weight: bold;
    }
  }

  .empty {
    display: flex;
    justify-content: center;
    align-items: center;
    height: 100px;
    font-size: 1.5rem;
    color: #999;
  }

  .emoji-series {
    display: flex;
    gap: 1rem;

    img {
      width: 5rem;
      height: 5rem;
      border-radius: 50%;
    }
  }
}
</style>

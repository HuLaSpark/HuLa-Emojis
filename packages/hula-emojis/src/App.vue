<template>
  <div class="hula-emojis-app">
    <MihoyoBbsEmojis />
  </div>
</template>
<script lang="ts" setup>
import MihoyoBbsEmojis from "@/components/MihoyoBbsEmojis.vue";
</script>
<style lang="scss" src="@/common.scss" scoped>
.hula-emojis-app {
  position: relative;
  width: 100vw;
  height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  box-sizing: border-box;
  padding: 12px;
  overflow: hidden;
}
</style>

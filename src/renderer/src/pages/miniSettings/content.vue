<script lang="ts" setup>
import banner from '../../assets/image/banner.webp'

// 浏览器触发超链接
const linkClick = () => {
  window.message.openUrl('https://github.com/RinLit-233-shiroko/Class-Widgets')
}
</script>

<template>
  <div class="outContainer">
    <div class="banner-image">
      <a-image
        :src="banner"
        :style="{ 'border-radius': '10px', border: '1px solid transparent' }"
      />
    </div>
    <a-typography>
      <a-typography-paragraph>
        <a-typography-title :level="2">关于</a-typography-title>
        <span>这只是我拿来倒计时的小工具罢了</span><br />
        <span>灵感来源于 </span
        ><a-typography-link @click="linkClick">Class Widget，</a-typography-link>
        <span>把前三个功能单独提了出来</span><br />
        <span>虽然是 Electron，但是能用就行😡</span><br />
      </a-typography-paragraph>
      <a-typography-paragraph>
        <a-typography-title :level="3">技术栈</a-typography-title>
        <span>Electron + Vue3 + Vite</span>
      </a-typography-paragraph>
    </a-typography>
  </div>
</template>

<style scoped>
.outContainer {
  width: 100%;
  height: fit-content;
}

.banner-image :deep(.ant-image-mask-info) {
  visibility: hidden;
  font-size: 0;
  opacity: 0;
}
.banner-image:deep(:where(.css-dev-only-do-not-override-1t40dvj).ant-image .ant-image-mask:hover) {
  visibility: hidden;
  font-size: 0;
  opacity: 0;
}
.banner-image:deep(:where(.css-dev-only-do-not-override-1t40dvj).ant-image .ant-image-mask) {
  pointer-events: none;
}
.banner-image:deep(.ant-image-mask-info span) {
  visibility: hidden;
  opacity: 0;
}
.banner-image {
  pointer-events: none;
}
</style>

<script lang="ts" setup>
import banner from '../../assets/image/banner.jpeg'
import { theWindow } from '../countDown.vue'

// 浏览器触发超链接
const linkClick = () => {
  ;(window as unknown as theWindow).message.openUrl(
    'https://github.com/RinLit-233-shiroko/Class-Widgets'
  )
}
</script>

<template>
  <div class="banner-image">
    <a-image :src="banner" :style="{ 'border-radius': '10px', border: '1px solid transparent' }" />
  </div>
  <a-typography>
    <a-typography-paragraph>
      <a-typography-title :level="2">关于</a-typography-title>
      <span>这只是我拿来倒计时的小工具罢了</span><br />
      <span>灵感来源于 </span
      ><a-typography-link @click="linkClick">Class Widget，</a-typography-link>
      <span>把前三个功能单独提了出来</span><br />
      <span>虽然是 Electron，但是能用就行😡</span><br />
      <a-typography-text type="warning"
        >动画根据 60Hz 刷新率适配，非 60Hz 刷新率请自行修改<a-typography-text code
          >main</a-typography-text
        >进程后重编译</a-typography-text
      >
      <a-typography-title :level="3">技术栈</a-typography-title>
      <span>Electron + Vue3 + Vite</span>
      <a-typography-title :level="2">注意</a-typography-title>
      <span
        >由于程序倒计时原理是<a-typography-text code>时间戳</a-typography-text
        >，所以隔天后使用需要先点击<a-typography-text code>Now</a-typography-text
        >按钮重置时间戳</span
      >
    </a-typography-paragraph>
  </a-typography>
</template>

<style scoped>
.banner-image ::v-deep .ant-image-mask-info {
  visibility: hidden;
  font-size: 0;
  opacity: 0;
}
.banner-image
  ::v-deep
  :where(.css-dev-only-do-not-override-1t40dvj).ant-image
  .ant-image-mask:hover {
  visibility: hidden;
  font-size: 0;
  opacity: 0;
}
.banner-image ::v-deep :where(.css-dev-only-do-not-override-1t40dvj).ant-image .ant-image-mask {
  pointer-events: none;
}
.banner-image ::v-deep .ant-image-mask-info span {
  visibility: hidden;
  opacity: 0;
}
.banner-image {
  pointer-events: none;
}
</style>

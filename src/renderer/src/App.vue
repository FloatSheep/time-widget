<script setup>
import { theme } from 'ant-design-vue'
import { ref, onMounted, onUnmounted } from 'vue'

// 初始化
const isLightMode = ref(true)

// 更新主题状态
const updateTheme = () => {
  isLightMode.value = window.matchMedia('(prefers-color-scheme: light)').matches
}

onMounted(() => {
  const mediaQuery = window.matchMedia('(prefers-color-scheme: light)') // 媒体查询
  updateTheme() // 更新主题
  mediaQuery.addEventListener('change', updateTheme) // 添加监听器
  onUnmounted(() => {
    mediaQuery.removeEventListener('change', updateTheme) // 销毁监听器
  })
})
</script>

<template>
  <div>
    <a-config-provider
      v-if="isLightMode"
      :theme="{
        algorithm: theme.defaultAlgorithm,
        token: {
          colorPrimary: '#0F6CBD',
          fontFamily: `LXGW WenKai Screen, sans-serif`,
          fontSize: 16,
          colorBgContainer: 'transparent',
          lineWidth: 0,
          fontWeightStrong: 900
        }
      }"
    >
      <router-view></router-view>
    </a-config-provider>
    <a-config-provider
      v-else
      :theme="{
        algorithm: theme.darkAlgorithm,
        token: {
          colorPrimary: '#0F6CBD',
          fontFamily: `LXGW WenKai Screen, sans-serif`,
          fontSize: 16,
          colorBgContainer: 'transparent',
          lineWidth: 0,
          fontWeightStrong: 900
        }
      }"
    >
      <router-view></router-view>
    </a-config-provider>
  </div>
</template>

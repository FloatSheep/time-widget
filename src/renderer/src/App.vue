<script setup>
import { theme } from 'ant-design-vue'
import { ref, onMounted, onUnmounted, watchEffect } from 'vue'

// 状态管理
const isLightMode = ref(true)
const themeConfig = ref({
  algorithm: theme.defaultAlgorithm,
  token: {
    colorPrimary: '#0F6CBD',
    fontFamily: `LXGW WenKai Screen, sans-serif`,
    fontSize: 16,
    colorBgContainer: 'transparent',
    lineWidth: 0,
    fontWeightStrong: 900
  }
})

// 动态更新主题配置
watchEffect(() => {
  if (isLightMode.value) {
    themeConfig.value = {
      algorithm: theme.defaultAlgorithm,
      token: {
        colorPrimary: '#0F6CBD',
        fontFamily: `LXGW WenKai Screen, sans-serif`,
        fontSize: 16,
        colorBgContainer: 'transparent',
        lineWidth: 0,
        fontWeightStrong: 900
      }
    }
  } else {
    themeConfig.value = {
      algorithm: theme.darkAlgorithm,
      token: {
        colorPrimary: '#0F6CBD',
        fontFamily: `LXGW WenKai Screen, sans-serif`,
        fontSize: 16,
        colorBgContainer: 'transparent',
        lineWidth: 0,
        fontWeightStrong: 900
      }
    }
  }
})

// 媒体查询监听
onMounted(() => {
  const mediaQuery = window.matchMedia('(prefers-color-scheme: light)')
  const handleChange = () => {
    isLightMode.value = mediaQuery.matches
  }

  // 初始设置
  isLightMode.value = mediaQuery.matches
  mediaQuery.addEventListener('change', handleChange)

  onUnmounted(() => {
    mediaQuery.removeEventListener('change', handleChange)
  })
})
</script>

<template>
  <div>
    <a-config-provider :theme="themeConfig">
      <router-view></router-view>
    </a-config-provider>
  </div>
</template>

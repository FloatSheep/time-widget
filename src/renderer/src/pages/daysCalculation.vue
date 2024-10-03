<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue'
import { theWindow } from './countDown.vue'

// 定义状态
const dayShowElement = ref<HTMLElement | null>(null)
const dayNameSetting = ref<string>('自定义')
const dayCalcSetting = ref<string>('未设置')

// 更新设置
const updateSettingsFromLocalStorage = () => {
  const localDayNameSetting = localStorage.getItem('dayNameSetting')
  const localDayCalcSetting = localStorage.getItem('dayCalcSetting')

  let hasChanged = false

  if (localDayNameSetting !== null && localDayNameSetting !== dayNameSetting.value) {
    dayNameSetting.value = localDayNameSetting
    hasChanged = true
  }

  if (localDayCalcSetting !== null) {
    const targetDate = new Date(localDayCalcSetting)
    const today = new Date()
    const timeDiff = targetDate.getTime() - today.getTime()

    let newDayCalcSetting = '0 年 0 月 0 天'
    if (timeDiff > 0) {
      const days = Math.ceil(timeDiff / (1000 * 60 * 60 * 24)) // 使用 Math.ceil 进行向上取整
      const years = Math.floor(days / 365)
      const months = Math.floor((days % 365) / 30)
      const remainingDays = days % 30
      newDayCalcSetting = `${years} 年 ${months} 月 ${remainingDays} 天`
    }

    if (newDayCalcSetting !== dayCalcSetting.value) {
      dayCalcSetting.value = newDayCalcSetting
      hasChanged = true
    }
  }

  if (hasChanged) {
    ;(window as unknown as theWindow).message.sendMouseMove()
  }
}

// 页面加载时更新设置
onMounted(() => {
  updateSettingsFromLocalStorage()

  // 使用 setInterval 定期检查 localStorage 变化
  const intervalId = setInterval(() => {
    updateSettingsFromLocalStorage()
  }, 1000) // 每秒检查一次

  // 页面卸载时清除定时器
  onUnmounted(() => {
    clearInterval(intervalId)
  })
})
</script>

<template>
  <div>
    <center>
      <div class="subText">距离 {{ dayNameSetting }} 还有</div>
      <div class="mainText">
        <span ref="dayShowElement" class="countInput">{{ dayCalcSetting }}</span>
      </div>
    </center>
  </div>
</template>

<style scoped>
.subText {
  color: #949494e0;
  font-weight: bold;
  font-size: 26px;
}
</style>

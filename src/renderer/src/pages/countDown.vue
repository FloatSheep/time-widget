<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue'
import dayjs from 'dayjs'

// 动态时间戳
const DynamicTimestamp = ref<number>(0)

// 倒计时
const countDown = ref<string>('00:00')
const totalSeconds = ref<number>(0)
const countDownElement = ref<HTMLElement | null>(null)

// 动态时间戳更新
let animationFrameId: number
let lastTime: number = performance.now()

// 格式化时间
const formatTime = (seconds: number): string => {
  const hours = Math.floor(seconds / 3600)
  const minutes = Math.floor((seconds % 3600) / 60)
  const secs = seconds % 60
  return `${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}:${String(secs).padStart(2, '0')}`
}

// 更新倒计时
const updateCountDown = (currentTime: number) => {
  if (currentTime - lastTime >= 1000) {
    if (totalSeconds.value > 0) {
      totalSeconds.value -= 1
      countDown.value = formatTime(totalSeconds.value)
      lastTime = currentTime
    } else {
      // 倒计时结束
      countDown.value = '00:00:00'
      if (countDownElement.value !== null) {
        // 颜色变换
        countDownElement.value.style.color = '#CB5364'
        countDownElement.value.style.borderBottomColor = '#A23238'

        // 2秒后恢复
        const timeout = setTimeout(() => {
          countDownElement.value!.style.color = '#000000be'
          countDownElement.value!.style.borderBottomColor = '#7e7d7de0'
          clearTimeout(timeout)
        }, 2000)
      }
      // 下移窗口（这里偷懒直接用鼠标移动事件了）
      ;(window as unknown as theWindow).message.sendMouseMove()
      cancelAnimationFrame(animationFrameId)
      return
    }
  }
  animationFrameId = requestAnimationFrame(updateCountDown)
}

// 扩展 Window 类型
interface theWindow extends Window {
  message: {
    sendMouseMove: () => void
    openUrl: (url: string) => void
  }
}

// 开始倒计时
const startCountDown = () => {
  const now = dayjs().toDate().getTime()
  const initialTimestamp = DynamicTimestamp.value - now
  totalSeconds.value = Math.floor(initialTimestamp / 1000)
  if (totalSeconds.value < 0) {
    totalSeconds.value = 0
  }
  countDown.value = formatTime(totalSeconds.value)
  animationFrameId = requestAnimationFrame(updateCountDown)
}

// 页面加载时开始倒计时
onMounted(() => {
  const countdownTime = Number(localStorage.getItem('countDownTime'))
  if (!isNaN(countdownTime)) {
    DynamicTimestamp.value = countdownTime
  } else {
    DynamicTimestamp.value = 0
  }
  startCountDown()

  // 监听动态时间戳的变化
  setInterval(() => {
    const newCountdownTime = Number(localStorage.getItem('countDownTime'))
    if (!isNaN(newCountdownTime) && newCountdownTime !== DynamicTimestamp.value) {
      DynamicTimestamp.value = newCountdownTime
      cancelAnimationFrame(animationFrameId)
      startCountDown()
      ;(window as unknown as theWindow).message.sendMouseMove()
    }
  }, 1000) // 每秒检查一次
})

// 页面卸载时取消动画帧
onUnmounted(() => {
  cancelAnimationFrame(animationFrameId)
})

// 导出类型方便复用
export type { theWindow }
</script>

<template>
  <div id="parent">
    <div id="child">
      <div class="subText">倒计时</div>
      <div class="mainText">
        <span ref="countDownElement" class="countInput">{{ countDown }}</span>
      </div>
    </div>
  </div>
</template>

<style scoped>
.countInput {
  border: none;
  border-bottom: 2px solid #7e7d7de0;
  outline: none;
  font-size: 22.5px;
  background-color: transparent;
  transition: all 0.3s;
  text-align: center;
  height: 40px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-family: 'LXGW WenKai Screen', sans-serif;
  color: #000000be;
}

.countInput:focus {
  border-bottom: 2px solid #000000be;
}
</style>

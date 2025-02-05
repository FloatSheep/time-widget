<script setup lang="ts">
import { ref, onMounted, onUnmounted, watch } from 'vue'
import dayjs from 'dayjs'
import countDownAudio from '../assets/audio/countDown.wav'

// 动态时间戳
const DynamicTimestamp = ref<number>(0)

// 倒计时
const countDown = ref<string>('00:00')
const totalSeconds = ref<number>(0)
const countDownElement = ref<HTMLElement | null>(null)
const progressWidth = ref(100)

// 音频
const audioRef = ref<HTMLAudioElement | null>(null)

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

// 初始化总秒数
const initialTotalSeconds = ref(0)

// 倒计时播放 / 窗口下滑
watch(
  () => progressWidth.value,
  (value) => {
    if (value === 0) {
      try {
        audioRef.value!.load()
        audioRef.value!.play()
        // 直接调用 sendMouseMove
        ;(window as unknown as theWindow).message.sendMouseMove()
      } catch (err) {
        console.error('Audio Error: ', err)
      }
    }
  }
)

// 更新倒计时和进度条
const updateCountDown = (currentTime: number) => {
  if (currentTime - lastTime >= 1000) {
    if (totalSeconds.value > 0) {
      totalSeconds.value -= 1
      countDown.value = formatTime(totalSeconds.value)
      // 更新进度条宽度
      progressWidth.value = Number(
        ((totalSeconds.value / initialTotalSeconds.value) * 100).toFixed(2)
      )
      lastTime = currentTime
    } else {
      // 倒计时结束
      countDown.value = '00:00:00'
      progressWidth.value = 0 // 进度条归零

      // 颜色变换
      if (countDownElement.value !== null) {
        countDownElement.value.style.color = '#CB5364'
        countDownElement.value.style.borderBottomColor = '#A23238'

        // 2秒后恢复
        const timeout = setTimeout(() => {
          if (countDownElement.value !== null) {
            countDownElement.value.style.color = '#000000be'
            countDownElement.value.style.borderBottomColor = '#7e7d7de0'
          }
          clearTimeout(timeout)
        }, 2000)
      }

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

const startCountDown = () => {
  const now = dayjs().toDate().getTime()
  const initialTimestamp = DynamicTimestamp.value

  if (initialTimestamp <= now) {
    DynamicTimestamp.value = now
    totalSeconds.value = 0
  } else {
    totalSeconds.value = Math.floor((initialTimestamp - now) / 1000)
  }

  initialTotalSeconds.value = totalSeconds.value > 0 ? totalSeconds.value : 0
  countDown.value = formatTime(totalSeconds.value)
  animationFrameId = requestAnimationFrame(updateCountDown)
}

onMounted(() => {
  const countdownTime = Number(localStorage.getItem('countDownTime'))
  if (!isNaN(countdownTime)) {
    DynamicTimestamp.value = countdownTime
  } else {
    DynamicTimestamp.value = 0
  }
  startCountDown()

  // 更换音频
  if (localStorage.getItem('customCountDownAudio') === 'true' && audioRef.value !== null) {
    audioRef.value.src = 'macaron://api/countdownAudio'
  }

  // 监听 localStorage 变化
  window.addEventListener('storage', (event) => {
    if (event.key === 'countDownTime') {
      const newCountdownTime = Number(event.newValue)
      if (!isNaN(newCountdownTime) && newCountdownTime !== DynamicTimestamp.value) {
        DynamicTimestamp.value = newCountdownTime
        cancelAnimationFrame(animationFrameId)
        startCountDown()
      }
    }
    if (event.key === 'customCountDownAudio') {
      if (event.newValue === 'true' && audioRef.value !== null) {
        audioRef.value.src = 'macaron://api/countdownAudio'
      }
    }
  })
})

onUnmounted(() => {
  cancelAnimationFrame(animationFrameId)
  window.removeEventListener('storage', () => {})
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
        <div class="countDownProgressBar">
          <div class="countDownProgressBarInstance" :style="{ width: progressWidth + '%' }"></div>
        </div>
      </div>
      <audio ref="audioRef" :src="countDownAudio" preload="auto" style="display: none"></audio>
    </div>
  </div>
</template>

<style scoped>
.countDownProgressBar {
  height: 4px;
  background-color: #e6e6e6;
  width: 100%;
  display: block;
  border-radius: 4px;
  overflow: hidden;
}

.countDownProgressBarInstance {
  background-color: #0f6cbd;
  transition-timing-function: ease;
  transition-duration: 0.3s;
  transition-property: width;
  height: 100%;
  border-radius: inherit;
}

.countInput {
  transition: color 0.1s ease;
}
</style>

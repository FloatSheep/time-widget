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
watch(progressWidth, (value) => {
  if (value === 0 && localStorage.getItem('silentMode') !== 'true') {
    if (localStorage.getItem('systemNotification') === 'true') {
      const NOTIFICATION_TITLE = '时间到'
      const NOTIFICATION_BODY = '啊咧咧，倒计时已经结束了！'
      new Notification(NOTIFICATION_TITLE, { body: NOTIFICATION_BODY })
    }
    try {
      audioRef.value!.load()
      audioRef.value!.play()
      // 直接调用 sendMouseMove
      window.message.sendMouseMove()
    } catch (err) {
      console.error('Audio Error: ', err)
    }
  }
})

function getCssVariable(element: HTMLElement, variableName: string): string {
  return getComputedStyle(element).getPropertyValue(variableName).trim()
}

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
        countDownElement.value.style.color = getCssVariable(
          countDownElement.value,
          '--countdown-end-color'
        )
        countDownElement.value.style.borderBottomColor = getCssVariable(
          countDownElement.value,
          '--countdown-end-border-color'
        )

        // 2秒后恢复
        const timeout = setTimeout(() => {
          if (countDownElement.value !== null) {
            countDownElement.value.style.color = getCssVariable(
              countDownElement.value,
              '--countdown-normal-color'
            )
            countDownElement.value.style.borderBottomColor = getCssVariable(
              countDownElement.value,
              '--countdown-normal-border-color'
            )
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

// 处理主题颜色变化
const handleThemeChange = () => {
  countDownElement.value!.style.color = getCssVariable(
    countDownElement.value!,
    '--countdown-normal-color'
  )
  countDownElement.value!.style.borderBottomColor = getCssVariable(
    countDownElement.value!,
    '--countdown-normal-border-color'
  )
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

  const mediaQueryList = window.matchMedia('(prefers-color-scheme: dark)')
  handleThemeChange() // 立即执行
  mediaQueryList.addEventListener('change', handleThemeChange)
})

onUnmounted(() => {
  cancelAnimationFrame(animationFrameId)
  window.removeEventListener('storage', () => {})
})
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
  background-color: var(--countdown-progress-bg);
  width: 100%;
  display: block;
  border-radius: 4px;
  overflow: hidden;
}

.countDownProgressBarInstance {
  background-color: var(--countdown-progress-fill);
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

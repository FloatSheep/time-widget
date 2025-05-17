<script setup lang="ts">
import { onMounted, ref, onUnmounted } from 'vue'
import { appConfig } from '@renderer/main'

const versions = ref({
  chromium: '',
  node: '',
  electron: ''
})

const audioStatus = ref<HTMLElement | null>(null)
const UITemplateStatus = ref<HTMLElement | null>(null)
const isOutputed = ref<boolean>(false)

// 用于记录按键序列
const keySequence = ref<string[]>([])

// 需要匹配的按键序列
const targetSequence = ['C', 'C', 'D', 'D', 'C']

let handleKeyDown

onMounted(async () => {
  const data = await fetch('macaron://versions')

  if (data.ok) {
    const json = await data.json()
    versions.value = json
  }

  const customCountDownAudio = localStorage.getItem('customCountDownAudio')
  if (customCountDownAudio === 'true') {
    audioStatus.value!.innerText = '已开启'
  }

  if (UITemplateStatus.value) {
    UITemplateStatus.value!.innerText = appConfig.UITemplate
  }
  handleKeyDown = (event: KeyboardEvent) => {
    // 将按键加入队列
    keySequence.value.push(event.key.toUpperCase())

    // 只保留最近的5个按键
    if (keySequence.value.length > targetSequence.length) {
      keySequence.value.shift()
    }

    // 检查是否匹配目标序列
    if (keySequence.value.join('') === targetSequence.join('')) {
      window.message.send('advanced-tools')
    }
  }

  // 添加键盘监听
  window.addEventListener('keydown', handleKeyDown)

  if (isOutputed.value) {
    console.log(
      '%c Tips %c 华生，你发现了盲点！\n 现在，你可以在这里完成修改背景材料等操作 \n 下面的提示会是你的好帮手 \n <material_name> 可以试试别的方式（GayHub）获得哦！',
      'background:#0F6CBD;color:white;padding:2px 4px;border-radius:2px 0 0 2px;',
      'background:white;color:#0F6CBD;padding:2px 4px;border-radius:0 2px 2px 0;'
    )

    console.log(
      '%c Function %c window.message.invoke("change-material", <material_name>)',
      'background:#0F6CBD;color:white;padding:2px 4px;border-radius:2px 0 0 2px;',
      'background:white;color:#0F6CBD;padding:2px 4px;border-radius:0 2px 2px 0;'
    )

    console.log(
      '%c Function %c localStorage.setItem("material", <material_name>)',
      'background:#0F6CBD;color:white;padding:2px 4px;border-radius:2px 0 0 2px;',
      'background:white;color:#0F6CBD;padding:2px 4px;border-radius:0 2px 2px 0;'
    )

    isOutputed.value = true
  }
})

// 清理副作用
onUnmounted(() => {
  window.removeEventListener('keydown', handleKeyDown)
})
</script>

<template>
  <div class="outContainer">
    <h2 class="mainText">版本信息</h2>
    <div class="configItem">
      <span class="configLeft">Chromium 版本</span>
      <span>{{ versions.chromium }}</span>
    </div>
    <div class="configItem">
      <span class="configLeft">Node.js 版本</span>
      <span>{{ versions.node }}</span>
    </div>
    <div class="configItem">
      <span class="configLeft">Electron 版本</span>
      <span>{{ versions.electron }}</span>
    </div>
    <div class="amylase-divide" style="margin: 20px 0 0 0"></div>
    <h2 class="mainText">特别功能</h2>
    <div class="configItem">
      <span class="configLeft">自定义提示音</span>
      <span ref="audioStatus">未开启</span>
    </div>
    <div class="amylase-divide" style="margin: 20px 0 0 0"></div>
    <h2 class="mainText">特殊信息</h2>
    <div class="configItem">
      <span class="configLeft">UI Template</span>
      <span ref="UITemplateStatus"></span>
    </div>
  </div>
</template>

<style scoped>
.configItem {
  display: flex;
  flex-flow: row nowrap;
  justify-content: space-between;
  flex-direction: row;
  flex-wrap: nowrap;
  align-items: center;
  padding: 10px 0 10px 0;
}

.outContainer {
  width: 100%;
  height: fit-content;
}

.amylase-mica {
  background: #f7f9fcdb;
  backdrop-filter: blur(40px);
  background-blend-mode: overlay;
}

.amylase-card {
  height: fit-content;
  box-shadow:
    0 0 2px rgba(0, 0, 0, 0.12),
    0 2px 4px rgba(0, 0, 0, 0.14);
  flex-direction: column;
  display: flex;
  position: relative;
  box-sizing: border-box;
  overflow: hidden;
  border-radius: 11px;
  border: 2px solid #d1d1d1;
  padding: 18px;
  transition: all 100ms cubic-bezier(0.33, 0, 0.67, 1);
  border-width: thin;
  cursor: default;
  line-height: 1.5rem;
  margin: 24px 0 24px 0;
}

.amylase-card:hover {
  background-color: #fff;
  box-shadow: 0 8px 16px rgb(0 0 0 / 14%);
}

.amylase-divide {
  contain: content;
  display: flex;
  color: #616161;
}

.amylase-divide::after {
  align-self: center;
  background: color-mix(in srgb, #e0e0e0 50%, gray 50%);
  box-sizing: border-box;
  content: '';
  display: flex;
  flex-grow: 1;
  height: 1px;
  opacity: 0.8;
}

.amylase-divide::before {
  align-self: center;
  background: color-mix(in srgb, #e0e0e0 50%, gray 50%);
  box-sizing: border-box;
  content: '';
  display: flex;
  flex-grow: 1;
  height: 1px;
  opacity: 0.8;
}
</style>

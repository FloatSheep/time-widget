<script setup lang="ts">
import { onMounted, ref, onUnmounted } from 'vue'
import { appConfig } from '@renderer/main'
import { selfConsole } from '@renderer/utils/console'

const versions = ref({
  chromium: '',
  node: '',
  electron: ''
})

const audioStatus = ref<HTMLElement | null>(null)
const UITemplateStatus = ref<HTMLElement | null>(null)

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

  // 函数定义
  window.changeMaterial = async (material: string) => {
    if (!material) {
      throw new Error('请提供材料')
    }
    switch (material) {
      case 'acrylic-7':
        selfConsole.log('Tips', 'Acrylic(Win7+) 没有暗色与浅色切换适配')
        break
      case 'blur':
        selfConsole.log('Tips', 'Blur(Win7+) 于高版本 Windows 会出现黑背景的问题')
        break
    }
    await window.message.invoke('change-material', material)
    localStorage.setItem('material', material)
    return true
  }

  // 键盘监听
  handleKeyDown = (event: KeyboardEvent) => {
    // 将按键加入队列
    keySequence.value.push(event.key.toUpperCase())

    // 只保留最近的5个按键
    if (keySequence.value.length > targetSequence.length) {
      keySequence.value.shift()
    }

    // 检查是否匹配目标序列
    if (keySequence.value.join('') === targetSequence.join('')) {
      window.message.invoke('advanced-tools').then((e) => {
        if (e) {
          selfConsole.log(
            'Tips',
            '华生，你发现了盲点！\n 现在，你可以在这里完成修改背景材料等操作 \n 下面的提示会是你的好帮手哦！'
          )
          selfConsole.log(
            'Parameters',
            '<material_name> 接受字符串: mica / mica-tabbed / acrylic-11 / acrylic-7 / blur / none'
          )
          selfConsole.log('Function', 'await changeMaterial(<material_name>)')
          selfConsole.warn('Warning', '当你切换页面后，该函数将被销毁')
        }
      })
    }
  }

  // 添加键盘监听
  window.addEventListener('keydown', handleKeyDown)
})

// 清理副作用
onUnmounted(() => {
  window.removeEventListener('keydown', handleKeyDown)
  window.changeMaterial = null
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

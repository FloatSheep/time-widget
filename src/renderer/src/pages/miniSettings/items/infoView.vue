<script setup lang="ts">
import { onMounted, ref } from 'vue'
import { appConfig } from '@renderer/main'

const versions = ref({
  chromium: '',
  node: '',
  electron: ''
})

const audioStatus = ref<HTMLElement | null>(null)
const UITemplateStatus = ref<HTMLElement | null>(null)

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

  UITemplateStatus.value!.innerText = appConfig.UITemplate
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

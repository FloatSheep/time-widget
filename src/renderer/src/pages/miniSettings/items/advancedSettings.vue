<script setup lang="ts">
import { ref, watch } from 'vue'
import { useStorage } from '@renderer/utils/useLocalStorage'
import { $localStorage } from '@renderer/utils/localStorage'
import { QuestionCircleOutlined } from '@ant-design/icons-vue'

const stateControl = {
  appearance: ref<'light' | 'dark' | 'system'>('system'),
  material: ref<'mica' | 'mica-tabbed' | 'acrylic-7' | 'acrylic-11' | 'blur' | 'none'>('mica'),
  silentMode: ref<boolean>(false),
  systemNotification: {
    enabled: ref<boolean>(true),
    disabled: ref<boolean>(false)
  }
}

const changeHandler = {
  appearance: (value: string) => {
    switch (value) {
      case 'light':
        $localStorage.setItem('appearance', 'light')
        break
      case 'dark':
        $localStorage.setItem('appearance', 'dark')
        break
      case 'system':
        $localStorage.setItem('appearance', 'system')
        break
    }
  },
  material: (value: string) => {
    switch (value) {
      case 'mica':
        $localStorage.setItem('material', 'mica')
        break
      case 'mica-tabbed':
        $localStorage.setItem('material', 'mica-tabbed')
        break
      case 'acrylic-7':
        $localStorage.setItem('material', 'acrylic-7')
        break
      case 'acrylic-11':
        $localStorage.setItem('material', 'acrylic-11')
        break
      case 'blur':
        $localStorage.setItem('material', 'blur')
        break
      case 'none':
        $localStorage.setItem('material', 'none')
        break
    }
  }
}

if (localStorage.getItem('appearance')) {
  stateControl.appearance.value = localStorage.getItem('appearance') as 'light' | 'dark' | 'system'
}
if (localStorage.getItem('material')) {
  stateControl.material.value = localStorage.getItem('material') as
    | 'mica'
    | 'mica-tabbed'
    | 'acrylic-7'
    | 'acrylic-11'
    | 'blur'
    | 'none'
}
if (localStorage.getItem('silentMode')) {
  if (localStorage.getItem('silentMode') === 'true') {
    stateControl.silentMode.value = true
  } else {
    stateControl.silentMode.value = false
  }
}
if (localStorage.getItem('systemNotification')) {
  if (localStorage.getItem('systemNotification') === 'true') {
    stateControl.systemNotification.enabled.value = true
  } else {
    stateControl.systemNotification.enabled.value = false
  }
}

const storageControl = {
  appearance: useStorage('appearance'),
  material: useStorage('material')
}
watch([storageControl.appearance], async (newValue) => {
  stateControl.appearance.value = newValue as unknown as 'light' | 'dark' | 'system'
  await window.message.invoke('change-appearance', newValue[0] as unknown as string)
})
watch([storageControl.material], async (newValue) => {
  stateControl.material.value = newValue as unknown as
    | 'mica'
    | 'mica-tabbed'
    | 'acrylic-7'
    | 'acrylic-11'
    | 'blur'
    | 'none'
  await window.message.invoke('change-material', newValue[0] as unknown as string)
})
watch(stateControl.silentMode, () => {
  $localStorage.setItem('silentMode', stateControl.silentMode.value)
  if (stateControl.silentMode.value) {
    stateControl.systemNotification.disabled.value = true
    stateControl.systemNotification.enabled.value = false
  } else {
    stateControl.systemNotification.disabled.value = false
  }
})
watch(stateControl.systemNotification.enabled, () => {
  $localStorage.setItem('systemNotification', stateControl.systemNotification.enabled.value)
})
</script>

<template>
  <div class="outContainer">
    <h2 class="mainText">外观</h2>
    <div class="configItem">
      <div class="configTipIcon">
        主题偏好
        <a-tooltip placement="topLeft">
          <template #title> 调整为你喜欢的颜色主题 </template>
          <QuestionCircleOutlined class="configIcon" />
        </a-tooltip>
      </div>
      <a-space>
        <a-select
          ref="select"
          :value="stateControl.appearance"
          class="configSection"
          :style="{ border: '1px solid #616161c4' }"
          @change="changeHandler.appearance"
        >
          <a-select-option value="light">亮色</a-select-option>
          <a-select-option value="dark">暗色</a-select-option>
          <a-select-option value="system">跟随系统</a-select-option>
        </a-select>
      </a-space>
    </div>
    <div class="configItem">
      <div class="configTipIcon">
        背景材料
        <a-tooltip placement="topLeft">
          <template #title>
            Blur(Win7+)、Acrylic(Win7+) 等背景材料因过老未加入列表，或许
            <strong style="color: var(--countdown-end-color)">CCDDC</strong> 是神奇字符哦
          </template>
          <QuestionCircleOutlined class="configIcon" />
        </a-tooltip>
      </div>

      <a-space>
        <a-select
          ref="select"
          :value="stateControl.material"
          :size="'middle'"
          class="configSection"
          :style="{ border: '1px solid #616161c4' }"
          @change="changeHandler.material"
        >
          <a-select-option value="mica">Mica</a-select-option>
          <a-select-option value="mica-tabbed">Mica 变体</a-select-option>
          <a-select-option value="acrylic-11">亚克力(Win11+)</a-select-option>
          <a-select-option value="acrylic-7" style="display: none">亚克力(Win7+)</a-select-option>
          <a-select-option value="blur" style="display: none">Blur</a-select-option>
          <a-select-option value="none">透明</a-select-option>
        </a-select>
      </a-space>
    </div>

    <h2 class="mainText">行为</h2>
    <div class="configItem">
      <div class="configTipIcon">
        静默模式
        <a-tooltip placement="topLeft">
          <template #title> 倒计时结束后无任何操作 </template>
          <QuestionCircleOutlined class="configIcon" />
        </a-tooltip>
      </div>
      <a-switch v-model:checked="stateControl.silentMode.value" />
    </div>
    <div class="configItem">
      <div class="configTipIcon">
        系统通知
        <a-tooltip placement="topLeft">
          <template #title> 倒计时结束后显示系统通知 </template>
          <QuestionCircleOutlined class="configIcon" />
        </a-tooltip>
      </div>
      <a-switch
        v-model:checked="stateControl.systemNotification.enabled.value"
        :disabled="stateControl.systemNotification.disabled.value"
      />
    </div>
  </div>
</template>

<style scoped>
.configItem {
  display: flex;
  flex-flow: row nowrap;
  flex-direction: row;
  flex-wrap: nowrap;
  align-items: center;
  padding: 10px 0 10px 0;
  justify-content: space-between;
}

.configIcon {
  flex: 1;
  margin-left: 0.3rem;
}

.outContainer {
  width: 100%;
}

.configTipIcon {
  display: inline-flex;
}

.configSection {
  width: 160px;
  border-radius: 6px;
}
</style>

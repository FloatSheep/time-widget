<script setup lang="ts">
import { onMounted, ref } from 'vue'
import dayjs, { Dayjs } from 'dayjs'
import type { UploadProps, UploadChangeParam } from 'ant-design-vue'
import { FileSearchOutlined } from '@ant-design/icons-vue'
import { usePopup } from '@renderer/utils/popMessage'

// 倒计时时间
// https://www.antdv.com/components/time-picker-cn
const value = ref<Dayjs>(dayjs(new Date()))

const popup = usePopup()

// 倒计时音频上传
const fileList = ref<UploadProps['fileList']>([])
const handleChange = (info: UploadChangeParam) => {
  if (info.file.status === 'done') {
    localStorage.setItem('customCountDownAudio', 'true')
    popup({
      type: 'success',
      title: '成功',
      content: '设置音频完成'
    })

    return
  }
  if (info.file.status === 'error') {
    popup({
      type: 'error',
      title: '错误',
      content: '设置音频失败'
    })

    return
  }
}

// 获取配置
const getConfig = (): string | null => {
  const time = localStorage.getItem('countDownTime')

  if (time !== undefined && time !== null && time !== '') {
    return time
  }
  return null
}

// 保存配置
const configSave = () => {
  const normalDate = value.value.toDate()
  localStorage.setItem('countDownTime', normalDate.getTime().toString())
  window.message.sendMouseMove()
}

// 挂载后加载配置
onMounted(async () => {
  const config = getConfig()
  if (config !== null) {
    const now = dayjs() // 当前时间
    const targetTime = dayjs(Number(config)) // 时间戳对应的时间

    // 判断时间戳是否已过期
    if (targetTime.isAfter(now)) {
      value.value = targetTime
    } else {
      // 如果时间已过期，更新为当前时间
      value.value = now
      localStorage.setItem('countDownTime', now.toDate().getTime().toString())
    }
  }
})
</script>

<template>
  <div class="outContainer">
    <h2 class="mainText">倒计时配置</h2>
    <div class="configItem">
      <span class="configLeft">结束时间</span>
      <a-time-picker v-model:value="value" :style="{ border: '1px solid #616161c4' }" />
    </div>
    <div class="configItem">
      <span class="configLeft">倒计时结束提示音</span>
      <a-upload
        v-model:file-list="fileList"
        list-type="text"
        :max-count="1"
        action="macaron://api/upload"
        class="uploadCustom"
        @change="handleChange"
      >
        <a-button>
          <FileSearchOutlined />
          选择音频
        </a-button>
      </a-upload>
    </div>
    <a-button type="primary" :class="'fixedButton'" @click="configSave">保存配置</a-button>
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

.uploadCustom > *:not(:first-child) {
  display: none;
}
</style>

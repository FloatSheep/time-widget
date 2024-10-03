<script setup lang="ts">
import { onMounted, ref } from 'vue'
import dayjs, { Dayjs } from 'dayjs'

// 倒计时时间
// https://www.antdv.com/components/time-picker-cn
const value = ref<Dayjs>(dayjs(new Date()))

// 获取配置
const getConfig = async () => {
  const time = await localStorage.getItem('countDownTime')
  if (time !== undefined || time !== null || !time) {
    return time
  }
  return null
}

// 保存配置
const configSave = async () => {
  const normalDate = value.value.toDate()
  await localStorage.setItem('countDownTime', normalDate.getTime().toString())
}

// 挂载后加载配置
onMounted(async () => {
  const config = await getConfig()
  if (config !== null) {
    value.value = dayjs(Number(config))
  }
})
</script>

<template>
  <div>
    <h2 class="mainText">倒计时配置</h2>
    <div class="configItem">
      <span class="configLeft">结束时间</span>
      <a-time-picker v-model:value="value" :style="{ border: '1px solid #616161c4' }" />
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
}
.configLeft {
  margin-right: calc(800px - 520px);
}
</style>

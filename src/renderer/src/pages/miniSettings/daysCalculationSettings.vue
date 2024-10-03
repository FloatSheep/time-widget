<script setup lang="ts">
import { onMounted, ref } from 'vue'
import dayjs, { Dayjs } from 'dayjs'

// 日期
// https://www.antdv.com/components/time-picker-cn
const endDay = ref<Dayjs>(dayjs(new Date().toISOString()))
const dayNameValue = ref<string>('自定义')

// 获取配置
const getConfig = () => {
  const dayNameSetting = localStorage.getItem('dayNameSetting')
  const endDay = localStorage.getItem('dayCalcSetting')
  if (dayNameSetting !== null && endDay !== null) {
    return { dayNameSetting, endDay }
  }
  return null
}

// 保存配置
const configSave = () => {
  localStorage.setItem('dayNameSetting', dayNameValue.value)
  localStorage.setItem('dayCalcSetting', dayjs(endDay.value).toISOString())
}

// 挂载后加载配置
onMounted(async () => {
  const config = getConfig()
  if (config !== null) {
    dayNameValue.value = config.dayNameSetting
    endDay.value = dayjs(config.endDay)
  }
})
</script>

<template>
  <div>
    <h2 class="mainText">日期计算配置</h2>
    <div class="configItem">
      <div class="configLeft">
        <span style="width: 64px; display: block">日期名称</span>
      </div>
      <a-input
        v-model:value="dayNameValue"
        placeholder="自定义"
        :style="{ border: '1px solid #616161c4' }"
      />
    </div>
    <div class="configItem">
      <span class="configLeft">结束时间</span>
      <a-date-picker
        v-model:value="endDay"
        :style="{ border: '1px solid #616161c4' }"
        placement="bottomLeft"
      />
    </div>
    <a-button type="primary" :class="'fixedButton'" @click="configSave">保存配置</a-button>
  </div>
</template>

<style scoped>
.configItem {
  display: flex;
  flex-flow: row nowrap;
  justify-content: flex-start;
  flex-direction: row;
  flex-wrap: nowrap;
  align-items: center;
  padding: 10px 0 10px 0;
}
.configLeft {
  margin-right: calc(800px - 540px);
}
</style>

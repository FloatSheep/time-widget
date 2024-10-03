<script setup lang="ts">
import { ref } from 'vue'

const yearToMonth = ref<string>('')
const dayToWeek = ref<string>('')

setInterval(() => {
  const nowYear = new Date().getFullYear()
  const nowMonth = new Date().getMonth() + 1
  const nowDay = new Date().getDate()
  const nowWeekday = new Date().getDay()
  const days = ['周日', '周一', '周二', '周三', '周四', '周五', '周六'] // 数字转汉字
  yearToMonth.value = `${nowYear} 年 ${nowMonth} 月`
  dayToWeek.value = `${nowDay} 日 ${days[nowWeekday]}`
}, 100)
</script>

<template>
  <div id="parent">
    <div id="child">
      <div class="subText">{{ yearToMonth }}</div>
      <div class="mainText">{{ dayToWeek }}</div>
    </div>
  </div>
</template>

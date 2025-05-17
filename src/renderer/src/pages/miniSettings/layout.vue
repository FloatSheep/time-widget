<template>
  <Header />
  <a-flex justify="flex-start">
    <a-menu
      v-model:open-keys="openKeys"
      v-model:selected-keys="selectedKeys"
      :style="{
        overflow: 'auto',
        height: '100vh',
        position: 'fixed',
        left: 0,
        top: 0,
        bottom: 0,
        'min-height': '256px',
        'max-width': '256px',
        'padding-top': '80px'
      }"
      mode="inline"
      :items="items"
      @click="handleClick"
    ></a-menu>
    <a-flex
      vertical
      align="flex-end"
      :style="{
        'padding-left': '256px',
        'padding-top': '1.2rem',
        'padding-right': '18px',
        width: '100%'
      }"
    >
      <router-view></router-view>
    </a-flex>
  </a-flex>
</template>
<script lang="ts" setup>
import Header from './particle/header.vue'

import { reactive, ref, VueElement, h, onMounted } from 'vue'
import type { MenuProps, ItemType } from 'ant-design-vue'
import {
  HomeOutlined,
  FieldTimeOutlined,
  CalendarOutlined,
  InfoCircleOutlined,
  SettingOutlined
} from '@ant-design/icons-vue'
import { useRouter } from 'vue-router'

// 获取路由
const route = useRouter()

const selectedKeys = ref<string[]>(['1'])
const openKeys = ref<string[]>(['sub1'])

// 导航栏
// https://www.antdv.com/components/menu-cn
function getItem(
  label: VueElement | string,
  key: string,
  icon?: unknown,
  children?: ItemType[],
  type?: 'group'
): ItemType {
  return {
    key,
    icon,
    children,
    label,
    type
  } as ItemType
}

const items: ItemType[] = reactive([
  getItem('', 'grp', null, [getItem('主页', '1', h(HomeOutlined))], 'group'),
  getItem(
    '功能',
    'grp',
    null,
    [getItem('倒计时', '2', h(FieldTimeOutlined)), getItem('日期计算', '3', h(CalendarOutlined))],
    'group'
  ),
  getItem(
    '其他',
    'grp',
    null,
    [getItem('高级设置', '4', h(SettingOutlined)), getItem('详细信息', '5', h(InfoCircleOutlined))],
    'group'
  )
])

// 页面导航
const handleClick: MenuProps['onClick'] = (e) => {
  if (e.key === '1') {
    route.push('/settings/main')
  } else if (e.key === '2') {
    route.push('/settings/countdown')
  } else if (e.key === '3') {
    route.push('/settings/days-calculation')
  } else if (e.key === '4') {
    route.push('/settings/advanced')
  } else if (e.key === '5') {
    route.push('/settings/info')
  }
}

// 挂载后，默认加载主页
onMounted(() => {
  route.push('/settings/main')
})
</script>

<style scoped>
.menu {
  background: paint(transparent-menu);
}
</style>

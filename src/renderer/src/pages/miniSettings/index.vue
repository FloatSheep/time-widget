<template>
  <a-page-header
    title="设置"
    sub-title="配置 Time Widget！"
    :style="{
      overflow: 'auto',
      width: '100%',
      height: '80px',
      position: 'fixed',
      left: 0,
      top: 0,
      bottom: 0,
      '-webkit-app-region': 'drag',
      'z-index': '9999'
    }"
  >
    <template #extra>
      <a-button key="1" style="-webkit-app-region: no-drag" @click="miniSizeClick"
        ><MinusOutlined
      /></a-button>
      <a-button key="2" style="-webkit-app-region: no-drag" @click="closeClick"
        ><CloseOutlined
      /></a-button>
    </template>
  </a-page-header>
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
      :style="{ 'padding-left': '256px', 'padding-top': '80px', 'padding-right': '18px' }"
    >
      <router-view></router-view>
    </a-flex>
  </a-flex>
</template>
<script lang="ts" setup>
import { reactive, ref, VueElement, h, onMounted } from 'vue'
import type { MenuProps, ItemType } from 'ant-design-vue'
import { HomeOutlined, CloseOutlined, MinusOutlined } from '@ant-design/icons-vue'
import { useRouter } from 'vue-router'

// 获取路由
const route = useRouter()

const selectedKeys = ref<string[]>(['1'])
const openKeys = ref<string[]>(['sub1'])

// 扩展 Window 类型
interface theWindow extends Window {
  message: {
    closeButton: () => void
    miniSizeButton: () => void
  }
}

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
  getItem('功能', 'grp', null, [getItem('倒计时', '2'), getItem('日期计算', '3')], 'group')
])

// 页面导航
const handleClick: MenuProps['onClick'] = (e) => {
  if (e.key === '1') {
    route.push('/settings/main')
  } else if (e.key === '2') {
    route.push('/settings/countdown')
  } else if (e.key === '3') {
    route.push('/settings/days-calculation')
  }
}

// 挂载后，默认加载主页
onMounted(() => {
  route.push('/settings/main')
})

// 关闭程序
const closeClick = () => {
  ;(window as unknown as theWindow).message.closeButton()
}

// 最小化程序
const miniSizeClick = () => {
  ;(window as unknown as theWindow).message.miniSizeButton()
}
</script>

<style scoped>
.menu {
  background: paint(transparent-menu);
}
</style>

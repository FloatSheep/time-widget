<script setup>
import { CloseOutlined, MinusOutlined } from '@ant-design/icons-vue'

const process = {
  miniSize: () => {
    window.message.miniSizeButton()
  },
  close: () => {
    window.message.closeButton()
  }
}
</script>

<template>
  <div id="header">
    <div id="title">
      设置
      <span>配置 Time Widget!</span>
    </div>
    <div id="functions">
      <button @click="process.miniSize()"><MinusOutlined /></button>
      <button @click="process.close()"><CloseOutlined /></button>
    </div>
  </div>
</template>

<style scoped>
#header {
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  padding: 0.9rem;
  font-size: larger;
  position: sticky;
  z-index: 1000;
  top: 7.516px;
  -webkit-app-region: drag;
}
#title {
  display: flex;
  flex-direction: column;
  -webkit-app-region: no-drag;
  span {
    color: var(--subtext-color);
    font-size: 70%;
  }
}
#functions {
  -webkit-app-region: no-drag;
  button {
    background: none;
    border: none;
    color: var(--subtext-color);
    margin: 0.4rem;
    padding: 0.3rem;
    font-size: large;
    transition: all 0.3s ease;
  }

  button:hover {
    background-color: var(--button-bg-color);
  }

  button:active {
    background-color: var(--background-color);
  }

  :nth-child(2):hover {
    background-color: var(--countdown-end-color);
  }

  :nth-child(2):active {
    background-color: var(--countdown-end-border-color);
  }
}
</style>

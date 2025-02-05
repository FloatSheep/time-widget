import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import './assets/main.css'
import { popupPlugin } from './utils/popMessage'

createApp(App).use(router).use(popupPlugin).mount('#app')

export const appConfig = {
  UITemplate: 'Ant Design Vue + Amylase UI（部分）'
}

import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import './assets/main.css'

createApp(App).use(router).mount('#app')

export const appConfig = {
  UITemplate: 'Ant Design Vue + Amylase UI（部分）'
}

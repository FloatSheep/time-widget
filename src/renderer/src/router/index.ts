import { createRouter, createWebHashHistory } from 'vue-router'
import index from '../pages/index.vue'
import countDown from '../pages/countDown.vue'
import daysCalculation from '@renderer/pages/daysCalculation.vue'
import countDownSettings from '@renderer/pages/miniSettings/countDownSettings.vue'
import daysCalculationSettings from '@renderer/pages/miniSettings/daysCalculationSettings.vue'
import miniSettingsIndex from '@renderer/pages/miniSettings/index.vue'
import mainSettings from '@renderer/pages/miniSettings/main.vue'

const routes = [
  { path: '/', component: index },
  { path: '/countdown', component: countDown },
  { path: '/days-calculation', component: daysCalculation },
  {
    path: '/settings',
    component: miniSettingsIndex,
    children: [
      {
        path: 'countdown',
        component: countDownSettings
      },
      {
        path: 'days-calculation',
        component: daysCalculationSettings
      },
      {
        path: 'main',
        component: mainSettings
      }
    ]
  },
  { path: '/:pathMatch(.*)*', name: 'NotFound', component: () => import('../pages/NotFound.vue') }
]

const router = createRouter({
  history: createWebHashHistory(),
  routes
})

export default router

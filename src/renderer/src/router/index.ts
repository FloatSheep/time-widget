import { createRouter, createWebHashHistory } from 'vue-router'

const routes = [
  { path: '/', component: () => import('@renderer/pages/index.vue') },
  { path: '/countdown', component: () => import('@renderer/pages/countDown.vue') },
  { path: '/days-calculation', component: () => import('@renderer/pages/daysCalculation.vue') },
  {
    path: '/settings',
    component: () => import('@renderer/pages/miniSettings/layout.vue'),
    children: [
      {
        path: 'countdown',
        component: () => import('@renderer/pages/miniSettings/items/countDownSettings.vue')
      },
      {
        path: 'days-calculation',
        component: () => import('@renderer/pages/miniSettings/items/daysCalculationSettings.vue')
      },
      {
        path: 'main',
        component: () => import('@renderer/pages/miniSettings/main.vue')
      },
      {
        path: 'info',
        component: () => import('@renderer/pages/miniSettings/items/infoView.vue')
      },
      {
        path: 'advanced',
        component: () => import('@renderer/pages/miniSettings/items/advancedSettings.vue')
      }
    ]
  }
]

const router = createRouter({
  history: createWebHashHistory(),
  routes
})

export default router

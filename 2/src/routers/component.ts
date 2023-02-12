import { RouteRecordRaw } from "vue-router";
import { homeRouter } from '@/routers/home'
import { dealRouter } from '@/routers/deal'
import { showRouter } from '@/routers/show'
import { settingRouter } from '@/routers/setting'
export const componentRouter: Array<RouteRecordRaw> = [
  {
    path: '/component/',
    name: 'component',
    component: () => import('@/views/component/component.vue'),
    children: [
      ...homeRouter, ...dealRouter, ...showRouter, ...settingRouter,
    ]
  }
]

export default componentRouter
import { RouteRecordRaw } from "vue-router";

export const homeRouter: Array<RouteRecordRaw> = [
  {
    path: '/',
    name: 'home',
    component: () => import('@/views/home/home.vue'),
    meta: {
      title: "components.home"
    }
  }
]

export default homeRouter
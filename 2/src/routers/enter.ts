import { RouteRecordRaw } from "vue-router";

export const enterRouter: Array<RouteRecordRaw> = [
  {
    path: '/login',
    name: 'login',
    component: () => import('@/views/enter/login.vue'),
    meta: {
      title: 'enter.login'
    }
  },
  {
    path: '/register',
    name: 'register',
    component: () => import('@/views/enter/register.vue'),
    meta: {
      title: 'enter.register'
    }
  }
]

export default enterRouter
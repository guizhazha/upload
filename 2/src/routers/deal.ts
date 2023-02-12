import { RouteRecordRaw } from "vue-router";

export const dealRouter: Array<RouteRecordRaw> = [
  {
    path: '/deal/JV',
    name: 'dealJV',
    component: () => import('@/views/deal/JV.vue'),
    meta: {
      title: 'components.uploadJV'
    }
  },
  {
    path: '/deal/XRD',
    name: 'dealXRD',
    component: () => import('@/views/deal/XRD.vue'),
    meta: {
      title: 'components.uploadXRD'
    }
  },
  {
    path: '/deal/IPCE',
    name: 'dealIPCE',
    component: () => import('@/views/deal/IPCE.vue'),
    meta: {
      title: 'components.uploadIPCE'
    }
  },
  {
    path: '/deal/PL',
    name: 'dealPL',
    component: () => import('@/views/deal/PL.vue'),
    meta: {
      title: 'components.uploadPL'
    }
  },
  {
    path: '/deal/ABS',
    name: 'dealABS',
    component: () => import('@/views/deal/ABS.vue'),
    meta: {
      title: 'components.uploadABS'
    }
  }
]

export default dealRouter
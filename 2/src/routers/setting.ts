import { RouteRecordRaw } from "vue-router";

export const settingRouter: Array<RouteRecordRaw> = [
    {
        path: '/staff/',
        name: 'staff',
        component: () => import('@/views/setting/staff.vue'),
        meta: {
          title: 'components.staff'
        }
    },
    {
        path: '/setting/',
        name: 'setting',
        component: () => import('@/views/setting/setting.vue'),
        meta: {
        title: 'components.setting'
        }
    }
]

export default settingRouter
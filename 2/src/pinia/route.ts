import { defineStore } from "pinia"

export interface routeState {
    curRoute: string;
    curName: string;
    dataType: string;
    num: number;
    id: string;
}  

export const changeRoute = defineStore({
    id: 'route', 
    state: ():routeState => ({
        curRoute: '/',
        curName: '系统首页',
        dataType: '',
        num: NaN,
        id: 'all',
    }),
    // 相当于 vue 中的 computed 计算属性
    getters: {
    },
    actions: {
        setRoute(route: string) {
            this.curRoute = route;
            this.dataType = this.curRoute.split('/').length >= 3 ? 
                            this.curRoute.split('/')[2] as string : 
                            ''
            if(this.dataType !== '') {
                if(this.dataType === 'JV') {
                    this.num = 0
                } else if(this.dataType === 'XRD') {
                    this.num = 1
                } else if (this.dataType === 'IPCE') {
                    this.num = 2
                } else if (this.dataType === 'PL') {
                    this.num = 3
                } else {// ABS
                    this.num = 4
                }

                if(this.curRoute.split('/')[1] == 'show'){
                    this.id = this.curRoute.split('/').pop() || 'all'
                }
            }
        },
        setRouteName(routeName: string) {
            this.curName = routeName;
        },

        initRoute(){
            this.curRoute = '/'
            this.curName = '系统首页'
            this.dataType = ''
            this.num = NaN
            this.id = 'all'
        }
    }
})

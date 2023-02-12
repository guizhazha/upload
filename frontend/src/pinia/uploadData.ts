import { defineStore } from "pinia"

export interface uploadDataState {
    oneUploadData: {[key: string]: boolean|string|number[]};
    oneRouteUploadData: {[key: string]: boolean|string|number[]}[]
    allRouteUploadData: {[curRoute:string]: []};
}  

export const addData = defineStore({
    id: 'uploadData', 
    state: ():uploadDataState => ({
        oneUploadData: {},
        oneRouteUploadData: [],
        allRouteUploadData: {},
    }),
    getters: {
    },
    actions: {
        initUpload(){
            this.oneUploadData = {}
            this.oneRouteUploadData = []
            this.allRouteUploadData = {}
        }
    }
})

// // echarts数据
// dataName: '',
// xAxisName: '',
// yAxisName: '',
// y2AxisName: '',
// xList: [],
// yList: [],
// y2List: [],

// // upload数据
// testTime: '',
// processId: '',
// sampleId: '',

// // 反馈信息
// isSuccess: false,
// message: '未知',
// rank: '',

// // check消息
// isCheck: false,
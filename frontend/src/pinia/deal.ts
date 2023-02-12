import { defineStore } from "pinia"

export interface Table {
    scan: string,
    Jsc: number,
    Voc: number,
    FF: number,
    Eff: number
}
export interface result {
    testTime?: string
    processId?: string
    sampleId?: string
    dataName: string
    isSuccess: boolean
    message: string

    xAxisName?: string,
    yAxisName?: string,
    y2AxisName?: string,
    scanCount?: number,
    xList?: number[],
    yList?: number[],
    y2List?: number[],
    xPosList?: number[],
    yPosList?: number[],
    xNegList?: number[],
    yNegList?: number[],
    table?: Table[],

    id?: number,
    email?: string,
    rank?: number,
    isPublic?: boolean,
    file?: boolean | string
}

export interface dealState {
    uploadData: result[][];
    checkData: number[][];
    isCheck: boolean[]
    isInde: boolean[]
}

export const changeDeal = defineStore({
    id: 'deal', 
    state: ():dealState => ({
        uploadData : [],
        checkData: [],
        isCheck: [false, false, false, false, false],
        isInde: [false, false, false, false, false]
    }),
    // 相当于 vue 中的 computed 计算属性
    getters: {
    },
    actions: {
        setUploadData(num: number, result: result) {
            if(this.uploadData[num] === undefined) {
                this.uploadData[num] = []
            }
            this.uploadData[num].push(result)
        },
        setCheckData(num: number, result: number[]) {
            this.checkData[num] = result
        },
        setCheck(num: number, isCheck: boolean) {
            this.isCheck[num] = isCheck
        },
        setInde(num: number, isInde: boolean) {
            this.isInde[num] = isInde
        },

        initDeal(){
            this.uploadData = []
            this.checkData = []
            this.isCheck = [false, false, false, false, false]
            this.isInde = [false, false, false, false, false]
        }
    }
})
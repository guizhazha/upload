import { defineStore } from "pinia"

export interface xrdState {
	x0: number,
	y0: number,
	x1: number,
	y1: number,
	number: number,
	yLists: [{
		y0: number,
		y1: number
	}] | [],
	xAxisName: string,
    yAxisName: string,
    xAxisBegin: number,
    xAxisEnd: number,
	bboxs:[
		{
			x0: number,
			y0: number,
			width: number,
			height: number,
		}
	] | [],
	subData: [
		{
			xList: number[],
			yList: number[]
		}
	] | []
}

export const changeXRD = defineStore({
    id: 'xrd', 
    state: ():xrdState => ({
        x0: 0,
        y0: 0,
        x1: 0,
        y1: 0,
        number: 0,
        yLists: [],
        xAxisName: '',
        yAxisName: '',
        xAxisBegin: 0,
        xAxisEnd: 0,
        bboxs:[],
        subData: []
    }),
    // 相当于 vue 中的 computed 计算属性
    getters: {
    },
    actions: {
        setPosition(x0: number, y0: number, x1: number, y1: number) {
            this.x0 = x0
            this.y0 = y0
            this.x1 = x1
            this.y1 = y1
        },
        setNumber(number: number) {
            this.number = number
        },
        setyList(index:number, yList: {y0: number,y1: number}) {
            this.yLists[index] = yList
        },
        setyListsy0(y0: number) {
            if(this.yLists.length !== 0) {
                this.yLists[0].y0 = y0
            }
        },
        setyListsy1(y1: number) {
            if(this.yLists.length !== 0) {
                this.yLists[this.yLists.length - 1].y1 = y1
            }
        },
        setxAxisName(xAxisName: string) {
            this.xAxisName = xAxisName
        },
        setyAxisName(yAxisName: string) {
            this.yAxisName = yAxisName
        },
        setxAxisBegin(xAxisBegin: number) {
            this.xAxisBegin = xAxisBegin
        },
        setxAxisEnd(xAxisEnd: number) {
            this.xAxisEnd = xAxisEnd
        },
        setBbox(index:number, bbox: {x0: number,y0: number,width: number,height: number}) {
            this.bboxs[index] = bbox
        },
        setSubData(index:number, sub: {xList: number[],yList: number[]}) {
            this.subData[index] = sub
        },
        init(){
            this.number = 0
            this.yLists = []
            this.xAxisBegin = 0
            this.xAxisEnd = 0
            this.bboxs = []
            this.subData = []
        }
    }
})
import { result } from "@/pinia/deal"

export function getTextStyle() {
    return {
        // 字体类型
        fontFamily: 'sans-serif',
        // 字宽
        fontWeight: 'normal',
        // 字体大小
        fontSize: 12,
        // 颜色
        color: 'black'
    }
}

export function getSeriesData (xList: number[], yList: number[]) {
    const seriesData = []
    for(let i=0; i<xList.length; i++) {
        seriesData.push([xList[i], yList[i]])
    }

    return seriesData
}

export function getAxis() {
    return {
        splitLine: { 
            // 网格线
            show: false
        },

        axisTick: {
            show: true,
            // y轴刻度向下延展
            length: 8,
            // 刻度方向朝内
            inside: true,
        },

        axisLabel: {
            show: true,
            rotate: 0,

            margin: 8,

            showMinLabel: true,
            showMaxLabel: true,
        },

        nameTextStyle: {
            ...getTextStyle()
        }
    }
} 

export function getXMin(echarts: result[]) {
    const min: number[] = []

    for(const echart of echarts) {
        const xList = echart.xList as number[]
        min.push(Math.min(...xList))
    }

    return Math.floor(Math.min(...min))
}

export function getXMax(echarts: result[]) {
    const max: number[] = []

    for(const echart of echarts) {
        const xList = echart.xList as number[]
        max.push(Math.max(...xList))
    }

    return Math.floor(Math.max(...max))
}

export function getUniYList(yList: number[]) {
    const uniYList = []

    const maxY = Math.max(...yList)
    for(const y of yList) {
        uniYList.push(y / maxY)
    }

    return uniYList
}

export function getxIndex(echarts: result[]) {
    const xIndex_yMax = []

    for(let i=0; i < echarts.length; i++) {
        const xList = echarts[i].xList as number[]
        const yList = echarts[i].yList as number[]

        let yMax = yList[0]
        let xIndex = 0
        for(const [i, y] of yList.entries()) {
            if(y > yMax) {
                yMax = y
                xIndex = i
            }
        }
        xIndex_yMax.push(xList[xIndex])
    }

    return xIndex_yMax
}




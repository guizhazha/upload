import {getSeriesData,getUniYList,getxIndex} from '@/utils/deal/optionAPI/common'
import { linerFitting } from '@/utils/deal/linerFitting'
import { result } from '@/pinia/deal'

export function getSeries(xList: number[], yList: number[]) {
    return {
        type: 'line',
        showSymbol: false,
        data: getSeriesData(xList, yList)
    }
}

export function getABSSeries(x2List: number[], yList: number[]) {
    // x2List递减
    const count = x2List.length
    const gap = (Math.max(...x2List) - Math.min(...x2List)) / x2List.length;
    // 二阶导
    const deriList = []

    for(let i=0; i<count-1; i++){
        const deri = (yList[i]-yList[i+1]) / gap
        deriList.push(deri)
    }
    
    let flag = false
    let start = false
    const derixList = []
    const deriyList = []
    for(let i=count-1; i>0; i--){
        if(!start && deriList[i]>0.2 && deriList[i]<1){
            start = true
        }
        if(start){
            if(!flag && deriList[i]>3){
                flag = true
            }
            if(flag){
                derixList.push(x2List[i])
                deriyList.push(yList[i])
                if(deriList[i]<3){
                    break
                }
            }
        }
    }

    let {Kreturn, Breturn} = linerFitting(derixList, deriyList)
    Kreturn = Number(Kreturn.toFixed(2))
    Breturn = Number(Breturn.toFixed(2))

    const xL: number[] = []
    const yL: number[] = []
    for(let i=0; i<Math.ceil(Math.max(...x2List)); i+=0.1) {
        xL.push(i)
        yL.push(Breturn + i * Kreturn)
    }

    return {
        type: 'line',
        name: '.',
        showSymbol: false,
        itemStyle:{
            normal:{
                lineStyle:{
                    width:2,
                    type:'dotted'  //'dotted'虚线 'solid'实线
                }
            }
        },
        data: getSeriesData(xL, yL),
        markPoint: {
            data: [{ value: (-Breturn / Kreturn).toFixed(2), xAxis: (-Breturn / Kreturn), yAxis: 0 }],
            symbol: "pin",
            symbolSize: 56,
            symbolRotate: 45,
            symbolOffset: [0, 0],
            label: {
                color: 'red',
                // backgroundColor: 'blue',
            },
            itemStyle:{
                color: '#fff',
                // backgroundColor: 'blue',
            }
        },

        xAxisIndex: 1,
        yAxisIndex: 1,
    }
}

export function getJVsSeries(echarts: result[]) {
    const series = []

    for(const echart of echarts) {
        const name = echart.dataName
        const xPosList = echart.xPosList as number[]
        const yPosList = echart.yPosList as number[]
        const xNegList = echart.xNegList as number[]
        const yNegList = echart.yNegList as number[]

        series.push(
            {
                type: 'line',
                name: name + '-' + '→',
                showSymbol: false,
                data: getSeriesData(xPosList, yPosList)
            },
            {
                type: 'line',
                name: name + '-' + '←',
                showSymbol: false,
                data: getSeriesData(xNegList, yNegList)
            }
        )
    }

    return series
}

export function getSSeries(echarts: result[]) {
    const series = []

    for(const echart of echarts) {
        const name = echart.dataName
        const xList = echart.xList as number[]
        const yList = echart.yList as number[]

        series.push(
            {
                type: 'line',
                name: name,
                showSymbol: false,
                data: getSeriesData(xList, yList)
            }
        )
    }

    return series
}

export function getXRDsSeries(echarts: result[]) {
    const series = []

    for(let i=0; i < echarts.length; i++) {
        
        const name = echarts[i].dataName
        const xList = echarts[i].xList as number[]
        const yList = echarts[i].yList as number[]

        series.push(
            {
                type: 'line',
                name: name,
                showSymbol: false,
                data: getSeriesData(xList, yList),

                xAxisIndex: i,
                yAxisIndex: i,
            }
        )
    }

    return series
}

export function getIPCEsSeries(echarts: result[]) {
    const series = []

    for(const echart of echarts) {
        const name = echart.dataName
        const yAxisName = echart.yAxisName as string
        const y2AxisName = echart.y2AxisName as string
        const xList = echart.xList as number[]
        const yList = echart.yList as number[]
        const y2List = echart.y2List as number[]

        series.push(
            {
                type: 'line',
                name: name + '-' + yAxisName,
                showSymbol: false,
                data: getSeriesData(xList, yList)
            },
            {
                type: 'line',
                name: name + '-' + y2AxisName,
                showSymbol: false,
                data: getSeriesData(xList, y2List),
                yAxisIndex: 1
            }
        )
    }

    return series
}


export function getPLsSeries(echarts: result[]) {
    const series = []

    for(const echart of echarts) {
        const name = echart.dataName
        const xList = echart.xList as number[]
        const yList = echart.yList as number[]

        series.push(
            {
                type: 'line',
                name: name,
                showSymbol: false,
                data: getSeriesData(xList, getUniYList(yList)),
            
                xAxisIndex: 0,
                yAxisIndex: 0,
            }
        )
    }

    series.push(
        {
            type: 'line',
            name: 'line',
            symbolSize: 18,
            smooth: true,
            colorBy: 'data',

            data: getxIndex(echarts),

            xAxisIndex: 1,
            yAxisIndex: 1,
        }
    )

    return series
}


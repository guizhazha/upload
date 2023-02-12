import {getAxis,getXMin} from '@/utils/deal/optionAPI/common'
import { result } from '@/pinia/deal'

export function getxAxis(xAxisName: string) {
    return {
        show: true,
        position: 'bottom',
        name: xAxisName,
        nameLocation: 'middle',
        ...getAxis(),
        min: 0,
        nameGap: 24
    }
}

export function getXRDsxAxis(echarts: result[]) {
    const xAxis = []

    let xAxisName = ''
    for(let i=0; i < echarts.length; i++) {
        xAxisName = echarts[i].xAxisName as string

        xAxis.push(
            {
                gridIndex: i,
                show: false,
                min: getXMin(echarts),
            },
        )
    }

    xAxis[xAxis.length - 1] = {
        ...xAxis[xAxis.length - 1],
        ...getxAxis(xAxisName),
        min: getXMin(echarts),
    }

    return xAxis
}

export function getX2List(echarts: result[]) {
    const x2List = []

    for(const echart of echarts) {
        const name = echart.dataName
        x2List.push(name)
    }

    return x2List
}


import {getAxis} from '@/utils/deal/optionAPI/common'
import { result } from '@/pinia/deal'

export function getyAxis(yAxisName: string) {
    return {
        show: true,
        name: yAxisName,
        nameLocation: 'middle',
        nameRotate: 90,
        ...getAxis(),
        nameGap: 12,
        min: 0,
    }
}

export function getXRDsyAxis(echarts: result[]) {
    const yAxis = []

    for(let i=0; i < echarts.length; i++) {
        
        yAxis.push(
            {
                gridIndex: i,
                show: false,
            },
        )
    }
    
    return yAxis
}
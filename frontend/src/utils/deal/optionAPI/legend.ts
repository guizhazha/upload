import {getTextStyle} from '@/utils/deal/optionAPI/common'
import { result } from '@/pinia/deal'

export function getJVLegend() {
    return {
        show: true,
        orient: 'horizontal',
        align: 'left',
        itemGap: 4,

        x:'center',
        y:'top',
        top: "-1%",

        textStyle: getTextStyle(),

        data: [
            {
                name: '→',
                icon: 'path:// M928 480v32H96v-32z',
            },
            {
                name: '←',
                icon: 'path:// M928 480v32H96v-32z',
            }
        ]
    }
}

export function getABSLegend() {
    return {
        show: true,
        orient: 'vertical',
        align: 'left',
        itemGap: 4,

        x:'center',
        y:'top',
        top: "60%",
        left: "18%",

        textStyle: getTextStyle(),

        data: [
            {
                name: '-',
                icon: 'path:// M928 480v32H96v-32z',
            },
            {
                name: '.',
                icon: 'path:// M112 476h160v72H112z m320 0h160v72H432z m320 0h160v72H752z',
            }
        ]
    }
}

export function getLegends() {
    return {
        show: true,
        // 可滚动
        type: 'scroll',

        orient: 'vertical',
        align: 'left',
        itemGap: 4,

        top: '12%',
        left: '50%',
        height: '80%',

        textStyle: getTextStyle(),
    }
}

export function getJVsLegendData(echarts: result[]) {
    const legendData = []

    for(const echart of echarts) {
        const name = echart.dataName
        legendData.push(
            {
                name: name + '-' + '→',
                icon: 'path:// M928 480v32H96v-32z',
            },
            {
                name: name + '-' + '←',
                icon: 'path:// M928 480v32H96v-32z',
            }
        )
    }
    
    return legendData
}

export function getLegendData(echarts: result[]) {
    const legendData = []

    for(const echart of echarts) {
        const name = echart.dataName
        legendData.push(
            {
                name: name,
                icon: 'path:// M928 480v32H96v-32z',
            }
        )
    }
    
    return legendData
}


export function getIPCEsLegendData(echarts: result[]) {
    const legendData = []

    for(const echart of echarts) {
        const name = echart.dataName
        const yAxisName = echart.yAxisName as string
        const y2AxisName = echart.y2AxisName as string

        legendData.push(
            {
                name: name + '-' + yAxisName,
                icon: 'path:// M928 480v32H96v-32z',
            },
            {
                name: name + '-' + y2AxisName,
                icon: 'path:// M928 480v32H96v-32z',
            }
        )
    }
    
    return legendData
}

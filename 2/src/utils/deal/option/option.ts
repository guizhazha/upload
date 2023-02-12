import {getTitle} from '@/utils/deal/optionAPI/title'
import {getJVLegend,getABSLegend,getLegends,getJVsLegendData,getLegendData,getIPCEsLegendData} from '@/utils/deal/optionAPI/legend'
import {getGrid,getABSGrid,getXRDGrid} from '@/utils/deal/optionAPI/grid'
import {getxAxis,getXRDsxAxis,getX2List} from '@/utils/deal/optionAPI/xAxis'
import {getyAxis,getXRDsyAxis} from '@/utils/deal/optionAPI/yAxis'
import {getTooltip} from '@/utils/deal/optionAPI/tooltip'
import {getToolbox} from '@/utils/deal/optionAPI/toolbox'
import {getSeries,getABSSeries,getJVsSeries,getSSeries,getXRDsSeries,getIPCEsSeries,getPLsSeries} from '@/utils/deal/optionAPI/series'
import {getXMin,getXMax,getxIndex} from '@/utils/deal/optionAPI/common'

import { storeToRefs } from 'pinia'
import { changeRoute } from '@/pinia/route'
import { result } from '@/pinia/deal'

export function getOption(echart: result) {
    const route = changeRoute()
    const { dataType } = storeToRefs(route)

    const dataName = echart.dataName
    const xAxisName = echart.xAxisName as string
    const yAxisName = echart.yAxisName as string
    const y2AxisName = echart.y2AxisName as string

    const xList = echart.xList as number[]
    const yList = echart.yList as number[]
    const y2List = echart.y2List as number[]

    const xPosList = echart.xPosList as number[]
    const yPosList = echart.yPosList as number[]
    const xNegList = echart.xNegList as number[]
    const yNegList = echart.yNegList as number[]

    if(dataType.value === 'JV') {
        if(echart.scanCount === 1) {// 单扫
            return {
                title: getTitle(dataName),
                grid: getGrid(),
                xAxis: getxAxis(xAxisName),
                yAxis: {
                    ...getyAxis(yAxisName),
                    nameGap: 24,
                },
                tooltip: getTooltip(),
                toolbox: getToolbox(),
                series: getSeries(xList, yList)
            }
        } else {
            return {
                legend: getJVLegend(),
                grid: getGrid(),
                xAxis: getxAxis(xAxisName),
                yAxis: {
                    ...getyAxis(yAxisName),
                    nameGap: 24,
                },
                tooltip: getTooltip(),
                toolbox: getToolbox(),
                series: [
                    {
                        ...getSeries(xPosList, yPosList),
                        name: '→',
                    },
                    {
                        ...getSeries(xNegList, yNegList),
                        name: '←',
                    }
                ]
            }
        }
    } else if(dataType.value === 'XRD') {
        return {
            title: getTitle(dataName),
            grid: getGrid(),
            xAxis: {
                ...getxAxis(xAxisName),
                min: Math.floor(Math.min(...xList)),
                max: Math.ceil(Math.max(...xList)),
            },
            yAxis: {
                ...getyAxis(yAxisName),
                axisLabel: {
                    show: false,
                },
                axisTick: {
                    show: false,
                },
            },
            tooltip: getTooltip(),
            toolbox: getToolbox(),
            series: getSeries(xList, yList),
        }
    } else if (dataType.value === 'IPCE') {
        return {
            title: getTitle(dataName),
            grid: {
                ...getGrid(),
                right: "12%",
            },
            xAxis: {
                ...getxAxis(xAxisName),
                min: Math.floor(Math.min(...xList)),
                max: Math.ceil(Math.max(...xList)),
            },
            yAxis: [
                {
                    ...getyAxis(yAxisName),
                    position: 'left',
                    nameGap: 40,
                },
                {
                    ...getyAxis(y2AxisName),
                    position: 'right',
                    nameGap: 56,
                },
            ],
            tooltip: getTooltip(),
            toolbox: getToolbox(),
            series: [
                {
                    ...getSeries(xList, yList),
                },
                {
                    ...getSeries(xList, y2List),
                    yAxisIndex: 1
                }
            ],
        }
    } else if (dataType.value === 'PL') {
        return {
            title: getTitle(dataName),
            grid: getGrid(),
            xAxis: {
                ...getxAxis(xAxisName),
                min: Math.floor(Math.min(...xList)),
                max: Math.ceil(Math.max(...xList)),
            },
            yAxis: {
                ...getyAxis(yAxisName),
                axisLabel: {
                    show: false,
                },
                axisTick: {
                    show: false,
                },
            },
            tooltip: getTooltip(),
            toolbox: getToolbox(),
            series: getSeries(xList, yList)
        }
    } else {// ABS
        const x2List: number[] = []
        xList.forEach((item: number)=>{
            x2List.push(1240 / item)
        })

        return {
            title: {
                ...getTitle(dataName),
                top: '-2%',
            },
            legend: getABSLegend(),
            grid: getABSGrid(),
            xAxis: [
                {
                    ...getxAxis(xAxisName),
                    min: Math.floor(Math.min(...xList)),
                    max: Math.ceil(Math.max(...xList)),
                },
                {
                    ...getxAxis(''),
                    min: Math.floor(Math.min(...x2List)),
                    max: Math.ceil(Math.max(...x2List)),
                    gridIndex: 1,
                }
            ],
            yAxis: [
                {
                    ...getyAxis(yAxisName),
                    nameGap: 32,
                },
                {
                    ...getyAxis(yAxisName),
                    nameGap: 32,
                    max: Math.ceil(Math.max(...yList)),
                    gridIndex: 1,
                }
            ],
            tooltip: getTooltip(),
            toolbox: getToolbox(),
            series: [
                {
                    ...getSeries(xList, yList),
                    xAxisIndex: 0,
                    yAxisIndex: 0,
                },
                {
                    ...getSeries(x2List, yList),
                    name: '-',
                    xAxisIndex: 1,
                    yAxisIndex: 1,
                },
                {
                    ...getABSSeries(x2List, yList)
                }
            ]
        }
    }
    
}


export function getOptions(echarts: result[]) {
    const route = changeRoute()
    const { dataType } = storeToRefs(route)
    const xAxisName = echarts[0].xAxisName as string
    const yAxisName = echarts[0].yAxisName as string
    const y2AxisName = echarts[0].y2AxisName as string

    if(dataType.value === 'JV') {
        return {
            legend: {
                ...getLegends(),
                data: getJVsLegendData(echarts)
            },
            grid: getGrid(),
            xAxis: getxAxis(xAxisName),
            yAxis: {
                ...getyAxis(yAxisName),
                nameGap: 24,
            },
            tooltip: getTooltip(),
            toolbox: getToolbox(),
            series: getJVsSeries(echarts)
        }
    } else if(dataType.value === 'XRD') {
        return {
            legend: {
                ...getLegends(),
                type: 'plain',
                itemGap: 200,

                data: getLegendData(echarts)
            },
            grid: getXRDGrid(echarts),
            xAxis: getXRDsxAxis(echarts),
            yAxis: getXRDsyAxis(echarts),
            tooltip: getTooltip(),
            toolbox: getToolbox(),
            series: getXRDsSeries(echarts)
        }
    } else if (dataType.value === 'IPCE') {
        const xMin = getXMin(echarts)

        return {
            legend: {
                ...getLegends(),
                left: '18%',
                data: getIPCEsLegendData(echarts)
            },
            grid: getGrid(),
            xAxis: {
                ...getxAxis(xAxisName),
                min: xMin
            },
            yAxis: [
                {
                    ...getyAxis(yAxisName),
                    position: 'left',
                    nameGap: 40,
                },
                {
                    ...getyAxis(y2AxisName),
                    position: 'right',
                    nameGap: 56,
                },
            ],
            tooltip: getTooltip(),
            toolbox: getToolbox(),
            series: getIPCEsSeries(echarts)
        }
    } else if (dataType.value === 'PL') {
        const xMin = getXMin(echarts)
        const xMax = getXMax(echarts)

        const x2List = getX2List(echarts)
        const y2List = getxIndex(echarts)

        return {
            legend: {
                ...getLegends(),
                left: '60%',
                data: [
                    ...getLegendData(echarts),
                    {
                        name: 'line',
                        // name: 'Peak value graph',
                        icon: 'path:// M928 96v832h-832v-832h832z m-89.6 89.6H185.6v652.8h652.8V185.6z m-151.424 157.696l69.76 56.064-172.8 212.8L457.344 506.24l-123.136 151.424-69.76-56.128 180.672-222.272 126.848 105.984 115.008-142.016z',
                    }
                ]
            },
            grid: [
                {
                    ...getGrid(),
                    bottom: '200px'
                },
                {
                    ...getGrid(),
                    show: false,
                    top: '460px',
                    bottom: '36px',
                }
            ],
            xAxis: [
                {
                    ...getxAxis(xAxisName),
                    min: xMin,
                    max: xMax
                },
                {
                    gridIndex: 1,
                    type: 'category',
                    boundaryGap: true,
                    data: x2List,
                    axisLabel: {
                        show: false,
                    },
                    axisTick: {
                        show: false,
                    },
                }
            ],
            yAxis: [
                {
                    ...getyAxis(yAxisName),
                    nameGap: 36,
                    min: 0,
                    max: 1,
                    // show: false
                },
                {
                    ...getyAxis(xAxisName),
                    gridIndex: 1,
                    min: Math.floor(Math.min(...y2List)),
                    max: Math.ceil(Math.max(...y2List)),
                    nameGap: 36,
                }
            ],
            tooltip: getTooltip(),
            toolbox: getToolbox(),
            series: getPLsSeries(echarts)
        }
    } else {// ABS
        const xMin = getXMin(echarts)
        const xMax = getXMax(echarts)

        return {
            legend: {
                ...getLegends(),
                ...getLegendData(echarts)
            },
            grid: getGrid(),
            xAxis: {
                ...getxAxis(xAxisName),
                min: xMin,
                max: xMax
            },
            yAxis: {
                ...getyAxis(yAxisName),
                nameGap: 24,
            },
            tooltip: getTooltip(),
            toolbox: getToolbox(),
            series: getSSeries(echarts)
        }
    }
}

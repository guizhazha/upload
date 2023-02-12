export function getOption(xAxisData:string[], seriesData:number[][]) {
    return {
        legend: {
            data: ['JV', 'XRD', 'IPCE', 'PL', 'ABS']
        },
        tooltip: {
            trigger: 'axis',
            axisPointer: {
                type: 'cross',
                label: {
                    backgroundColor: '#6a7985'
                }
            }
        },
        xAxis: [
            {
                type: 'category',
                data: xAxisData
            }
        ],
        yAxis: [
            {
                type: 'value'
            }
        ],
        series: [
            {
                name: 'JV',
                type: 'line',
                stack: 'Total',
                data: seriesData[0]
            },
            {
                name: 'XRD',
                type: 'line',
                stack: 'Total',
                data: seriesData[1]
            },
            {
                name: 'IPCE',
                type: 'line',
                stack: 'Total',
                data: seriesData[2]
            },
            {
                name: 'PL',
                type: 'line',
                stack: 'Total',
                data: seriesData[3]
            },
            {
                name: 'ABS',
                type: 'line',
                stack: 'Total',
                data: seriesData[4]
            }
        ]
        }

}
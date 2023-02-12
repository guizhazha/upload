export function getToolbox() {
    return {
        show: true,
        orient: 'vertical',

        itemSize: 16,
        itemGap: 4,

        showTitle: true,

        feature: {
            saveAsImage: {
            show: true,
            excludeComponents: ['toolbox'],
            pixelRatio: 15
            },
            // dataView: {
            //     show: true,
            //     readOnly: true,
            // },
            dataZoom: {
                show: true,
                yAxisIndex: "none"
            },
            // magicType: {
            //     show: true,
            //     type: ['line', 'bar']
            // },
            restore: {
                show: true,
            },
        }
    }
}
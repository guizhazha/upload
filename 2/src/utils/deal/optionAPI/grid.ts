import { result } from '@/pinia/deal'

export function getGrid() {
    return {
        show: true,
        left: "10%",
        right: "10%",
        top: "10%",
        bottom: "10%",

        containLabel: true,

        borderColor: 'black',
        borderWidth: 2,
    }
}

export function getABSGrid() {
    return [
        {
            show: true,
            top: '8%',
            right: '15%',
            left: '15%',
            height: '30%',
            borderColor: 'black',
            borderWidth: 1,
        },
        {
            show: true,
            top: '60%',
            right: '15%',
            left: '15%',
            height: '30%',
            borderColor: 'black',
            borderWidth: 1,
        }
    ]
}

export function getXRDGrid(echarts: result[]) {
    const grid = []

    for(let i=0; i < echarts.length; i++) {
        grid.push(
            {
                show: true,

                left: '10%', 
                right: '10%',
                top: `${i * 200 + 40}px`,
                height: '200px',

                borderColor: 'black',
                borderWidth: 1,
            }
        )
    }
    
    return grid
}
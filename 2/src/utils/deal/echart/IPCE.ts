import type { UploadFile } from 'element-plus'
import { getCommon,TypeValue,increaseXList } from '@/utils/deal/echart/common'

export function getIPCEtest (uploadData: UploadFile) {
    return new Promise(function(resolve: (value: TypeValue) => void, reject) {
        getCommon(uploadData)
        .then((value) => {
            const {separator,lineList,nameLine,contentLine} = value
            const result = getTest(separator,lineList,nameLine,contentLine)
            resolve(result)
        })
        .catch(() => {
            reject(false)
        })
    })
}

export function getTest(separator:string, lineList: string[], nameLine: number, contentLine: number) {
    const column = lineList[contentLine].split(separator).length

    let xAxisName = ''
    let yAxisName = ''
    let y2AxisName = 'current'
    const xList: number[] = []
    const yList: number[] = []
    let y2List: number[] = []

    if(column <= 6) {
        xAxisName = lineList[nameLine].split(separator)[0].trim();
        yAxisName = lineList[nameLine].split(separator)[1].trim();
        
        for (let i=contentLine; i<lineList.length; i++) {
            if (lineList[i].length !== 0) {
                xList.push(Number(lineList[i].split(separator)[0].trim()))
                yList.push(Number(lineList[i].split(separator)[1].trim()))
            }
        }
        y2List = gety2List(xList, yList)
    } else {
        xAxisName = lineList[nameLine].split(separator)[0].trim();
        yAxisName = lineList[nameLine].split(separator)[3].trim();
        y2AxisName = lineList[nameLine].split(separator)[2].trim();
        
        for (let i=contentLine; i<lineList.length; i++) {
            if (lineList[i].length !== 0) {
                xList.push(Number(lineList[i].split(separator)[0].trim()))
                yList.push(Number(lineList[i].split(separator)[1].trim()))
                y2List.push(Number(lineList[i].split(separator)[2].trim()))
            }
        }
    }
    
    const {xL, yL, y2L} = increaseXList(xList, yList, y2List)

    return {
        xAxisName,
        yAxisName,
        y2AxisName,
        xList: xL,
        yList: yL,
        y2List: y2L as number[]
    }
}

export function gety2List(xList: number[], yList: number[]) {
    const mulList = []
    const gap = (Math.max(...xList) - Math.min(...xList)) / xList.length;
    for(let i=0; i<xList.length; i++) {
        mulList.push(1.6 * xList[i] * yList[i] * gap)
    }

    const y2List = []
    let sum = 0
    for(let i=0; i<mulList.length; i++) {
        sum += mulList[i]
        y2List.push(sum)
    }

    return y2List
}
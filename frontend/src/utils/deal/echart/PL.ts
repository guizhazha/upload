import type { UploadFile } from 'element-plus'
import { getCommon, TypeValue, increaseXList } from '@/utils/deal/echart/common'

export function getPLtest (uploadData: UploadFile) {
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
    const xAxisName = lineList[nameLine].split(separator)[0].trim();
    const yAxisName = lineList[nameLine].split(separator)[1].trim();
    
    const xList:number[] = []
    const yList:number[] = []
    for (let i=contentLine; i<lineList.length; i++) {
        if (lineList[i].length !== 0) {
            xList.push(Number(lineList[i].split(separator)[0].trim()))
            yList.push(Number(lineList[i].split(separator)[1].trim()))
        }
    }

    const {xL, yL} = increaseXList(xList, yList)

    return {
        xAxisName,
        yAxisName,
        xList: xL,
        yList: yL
    }
}
import type { UploadFile } from 'element-plus'
import { getCommon, TypeValue,Table,increaseXList } from '@/utils/deal/echart/common'
import { linerFitting } from '@/utils/deal/linerFitting'

export function getJVtest (uploadData: UploadFile) {
    return new Promise(function(resolve: (value: TypeValue) => void, reject) {
        getCommon(uploadData)
        .then((value) => {
            const {separator,lineList,nameLine,contentLine} = value
            const {xAxisName,yAxisName,xList,yList} = getTest(separator,lineList,nameLine,contentLine)
            const back = getPosNeg (xList, yList)
            if (back == false) {
                // 单扫
                const result = {
                    scanCount: 1,
                    xAxisName,
                    yAxisName,
                    xList,
                    yList
                }
                resolve(result)
            } else {
                // 正反扫
                const {xPosList,yPosList,xNegList,yNegList} = back
                const table = getTable(xPosList,yPosList,xNegList,yNegList)
                
                const result = {
                    scanCount: 2,
                    table,
                    xAxisName,
                    yAxisName,
                    xPosList,
                    yPosList,
                    xNegList,
                    yNegList
                }
                resolve(result)
            }
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

export function getPosNeg (xList: number[], yList: number[]) {
    for (let i = 0; i < xList.length; i++) {
        if (xList[i + 1] < xList[i]) {
            const xPosList = xList.slice(0, i)
            const yPosList = yList.slice(0, i)
            const xNegList = xList.slice(i)
            const yNegList = yList.slice(i)

            return {
                xPosList,
                yPosList,
                xNegList,
                yNegList
            }
        }
    }

    return false
}

export function getTable(xPosList: number[], yPosList: number[],
    xNegList: number[], yNegList: number[]) {
    const posJsc = getJsc(xPosList, yPosList)
    const negJsc = getJsc(xNegList, yNegList)
    const posVoc = getVoc(xPosList, yPosList)
    const negVoc = getVoc(xNegList, yNegList)
    
    const posMax = getMax(xPosList, yPosList)
    const negMax = getMax(xNegList, yNegList)
    
    const posEff = Number((posMax * 0.01 * 0.001 * 100).toFixed(2))
    const negEff = Number((negMax * 0.01 * 0.001 * 100).toFixed(2))

    const table: Table[] = []
    if(posJsc !== false && posVoc !== false) {
        const posFF = Number((posMax / (posJsc * posVoc)).toFixed(2)) as number
        
        table.push({
            scan: 'echarts.posScan',
            Jsc: posJsc,
            Voc: posVoc,
            FF: posFF,
            Eff: posEff
        })
    }
    if(negJsc !== false && negVoc !== false) {
        const negFF = Number((negMax / (negJsc * negVoc)).toFixed(2))
        table.push({
            scan: 'echarts.negScan',
            Jsc: negJsc,
            Voc: negVoc,
            FF: negFF,
            Eff: negEff
        })
    }

    return table
}

export function getJsc (xList: number[], yList: number[]) {
    for (let i = 0; i < xList.length; i++) {
        if (xList[i] * xList[i + 1] < 0) {
            const edge = getEdge(xList, yList, i)
            if (edge == false) {
                return false
            } else {
                const xTinyList = getList(xList, i-edge, i+1+edge)
                const yTinyList = getList(yList, i-edge, i+1+edge)

                const {Kreturn, Breturn} = linerFitting(xTinyList, yTinyList)
                return Number(Breturn.toFixed(2))
            }
        }
    }
    return false
}

export function getVoc (xList: number[], yList: number[]) {
    for (let i = 0; i < yList.length; i++) {
        if ((yList[i] * yList[i + 1] < 0)) {
            const edge = getEdge(xList, yList, i)
            if (edge == false) {
                return false
            } else {
                const xTinyList = getList(xList, i-edge, i+1+edge)
                const yTinyList = getList(yList, i-edge, i+1+edge)

                const {Kreturn, Breturn} = linerFitting(xTinyList, yTinyList)
                return Number((-Breturn / Kreturn).toFixed(2))
            }
        }
    }
    return false
}

export function getEdge (xList: number[], yList: number[], leftIndex: number) {
    const edge = 5
    for(let i = edge; i >= 0; i--) {
        if(xList[leftIndex-i] !== undefined 
            && xList[leftIndex+1+i] !== undefined 
            && yList[leftIndex-i] !== undefined 
            && yList[leftIndex+1+i] !== undefined) {
                return i
            }
    }
    return false
}

export function getList (list: number[], start: number, end: number) {
    const tinyList = []
    for(let i = start; i < end; i++) {
        tinyList.push(list[i])
    }
    return tinyList
}

export function getMax (xList: number[], yList: number[]) {
    const list = []
    for (let i = 0; i < xList.length; i++) {
        list.push(xList[i]*yList[i])
    }
    return Math.max(...list)
}

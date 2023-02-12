import type { UploadFile } from 'element-plus'

// 接口
interface DetailValue {
    separator: string,
    lineList: string[],
    nameLine: number,
    contentLine: number
}

export interface Table {
    scan: string,
    Jsc: number,
    Voc: number,
    FF: number,
    Eff: number
}
export interface TypeValue {
    xAxisName: string,
    yAxisName: string,
    y2AxisName?: string,
    scanCount?: number,
    xList?: number[],
    yList?: number[],
    y2List?: number[],
    xPosList?: number[],
    yPosList?: number[],
    xNegList?: number[],
    yNegList?: number[],
    table?: Table[],

    id?: number,
    email?: string,
    dataName?: string,
    processId?: string,
    sampleId?: string,
    rank?: number,
    isPublic?: boolean,
    file?: boolean | string
}

export function getCommon(uploadData: UploadFile) {
    const type = uploadData.name.split('.').pop() as string
    const separator = setSeparator(type)
    
    return new Promise(function(resolve: (value: DetailValue) => void, reject) {
        const reader = new FileReader()
        reader.readAsText(uploadData.raw as Blob, 'GB2312')
        reader.onload = () => {
            const data = reader.result as string
            const lineList = data.split('\n')
    
            const back = getNameContentPosition(separator, lineList)
            let result

            if (back == false) {
                reject()
            } else {
                const {nameLine, contentLine} = back
                result = {
                    separator,
                    lineList,
                    nameLine,
                    contentLine
                }
                resolve(result)
            }
        }
    })
}

export function setSeparator (type: string) {
    let separator: string
    if (type.toLowerCase() == 'xls') {
        separator = '\t'
    } else if (type.toLowerCase() == 'csv') {
        separator = ','
    } else if (type.toLowerCase() == 'txt') {
        separator = '\t'
    } else {
        separator = '\t'
    }

    return separator
}

export function getNameContentPosition(separator: string, lineList: string[]) {
    for (let i=0; i<lineList.length; i++) {
        if(!isNaN(Number(lineList[i].split(separator)[0])) 
            && !isNaN(Number(lineList[i].split(separator)[1])) 
            && !isNaN(Number(lineList[i + 1].split(separator)[0]))
            && !isNaN(Number(lineList[i + 1].split(separator)[1]))
            && !isNaN(Number(lineList[i + 2].split(separator)[0]))
            && !isNaN(Number(lineList[i + 2].split(separator)[1]))
            && !isNaN(Number(lineList[i + 3].split(separator)[0]))
            && !isNaN(Number(lineList[i + 3].split(separator)[1]))
            ) {
            const line = i
            if(line === 0) {
                return {
                    nameLine: 0,
                    contentLine: 1
                }
            } else {
                for (let j = line - 1; j >= 0; j--) {
                    if (lineList[j].split(separator)[0].match(/^\s+$/)) {
                        continue
                    } else {
                        return {
                            nameLine: j,
                            contentLine: line
                        }
                    }
                }
            }
        }
    }

    return false
}

export function increaseXList(xList: number[], yList: number[], y2List?: number[]){
    if(y2List === undefined){
        if(xList[1] > xList[0]){
            // 正向
            return {
                xL: xList,
                yL: yList
            }
        }else{
            // 反向
            return {
                xL: xList.reverse(),
                yL: yList.reverse()
            }
        }
    }else{
        if(xList[1] > xList[0]){
            // 正向
            return {
                xL: xList,
                yL: yList,
                y2L: y2List
            }
        }else{
            // 反向
            return {
                xL: xList.reverse(),
                yL: yList.reverse(),
                y2L: y2List.reverse()
            }
        }
    } 
}

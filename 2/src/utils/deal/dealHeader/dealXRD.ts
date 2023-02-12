import { binaryImg } from '@/utils/deal/binaryImg'
import { createWorker, PSM, OEM } from 'tesseract.js'

export function getXY(ctxUnshow: CanvasRenderingContext2D){
    const binImage = binaryImg(ctxUnshow)
    
    const xy0 = getXY0(binImage)
    if(xy0 === false) {
        return false
    }else{
        let x1 = getX1(binImage, xy0.y0)
        if(x1 === false) {
            return false
        }else{
            let y1 = getY1(binImage, xy0.x0, xy0.y0)
            if(y1 === false){
                return false
            }else{
                const x0 = xy0.x0 + 2
                const y0 = xy0.y0 + 2
                x1 = x1 - 2
                y1 = y1 + 2

                return {
                    x0, y0, x1, y1
                }
            }
        }
    }
}

function getXY0(binImage: ImageData) {
    for (let i = 0; i < binImage.data.length; i += 4) {
        const R = binImage.data[i] // R(0-255)
        const G = binImage.data[i + 1] // G(0-255)
        const B = binImage.data[i + 2] // B(0-255)
    
        // 第一步：筛选
        if (R === 255 && G === 255 && B === 255) {
            continue
        } else {
            // 第二步：第一次获得黑点，该黑点为左上角的点
            const y0 = Math.floor(i / (4 * 647))
            const x0 = Math.floor((i - y0 * 4 * 647) / 4)
            return {
                x0, y0
            } 
        }
    }

    return false
}
function getX1(binImage: ImageData, y0: number) {
    for (let i = (y0 + 2) * 4 * 647; i > (y0 + 1) * 4 * 647; i -= 4) {
        const R = binImage.data[i] // R(0-255)
        const G = binImage.data[i + 1] // G(0-255)
        const B = binImage.data[i + 2] // B(0-255)
    
        // 第三步：从右侧取最右边的黑点
        if (R === 255 && G === 255 && B === 255) {
            continue
        } else {
            // 第四步：获得最右边的黑点的横坐标
            const x1 = Math.floor((i - (y0 + 1) * 4 * 647) / 4)
            return x1
        }
    }

    return false
}
function getY1(binImage: ImageData, x0: number, y0: number) {
    for (let i = y0 + 250; i < 400; i += 1) {
        const RSet = new Set()
        const GSet = new Set()
        const BSet = new Set()
    
        // 第五步：取最下面的黑点
        for (let j = i * 4 * 647 + (x0 + 5) * 4; j < i * 4 * 647 + (x0 + 400) * 4; j += 4) {
            RSet.add(binImage.data[j])
            GSet.add(binImage.data[j + 1])
            BSet.add(binImage.data[j + 2])
        }
        // 第六步：如果一整行都是同一颜色，通常为白色，则默认这是个底边
        if (RSet.size === 1 && GSet.size === 1 && BSet.size === 1) {
            const y1 = i
            return y1
        } else {
            continue
        }
    }
    return false
}

export function material(
    ctxUnshow: CanvasRenderingContext2D, 
    x0: number, 
    y0: number, 
    x1: number, 
    y1: number) {
    const black = getBlackRange(ctxUnshow, x0, y0, x1, y1)
    const {number,realYLists} = getRealyLists(black,y0,y1)

    const yLists = []
    for(let j = 0; j < realYLists.length / 2; j++) {
        yLists[j] = {
            y0: realYLists[j * 2],
            y1: realYLists[j * 2 + 1]
        }
    }

    return {
        number,
        yLists
    }
}
function getBlackRange(ctxUnshow: CanvasRenderingContext2D, x0: number, y0: number, x1: number, y1: number) {
    x0 = x0 + 5
    y0 = y0 + 5
    const width = x1 - x0 -10
    const height = y1 - y0 -5
    const center = binaryImg(ctxUnshow, x0, y0, width, height)

    const black: number[] = []
    for (let j = 0; j < height; j++) {
        const RSet = new Set()
        const GSet = new Set()
        const BSet = new Set()
        for (let i = j * 4 * width; i < (j + 1) * 4 * width; i += 4) {
            RSet.add(center.data[i])
            GSet.add(center.data[i + 1])
            BSet.add(center.data[i + 2])
        }
        if (RSet.size === 1 && GSet.size === 1 && BSet.size === 1) {
            continue
        } else {
            // 曲线实际位置
            black.push(j + y0)
        }
    }
    return black
}
function getRealyLists(black: number[],y0: number,y1: number) {
    y0 = y0 + 5
    const height = y1 - y0 -5
    const realYLists: number[] = []

    realYLists.push(y0)
    let number = 1
    for (let j = 0; j < black.length - 1; j++) {
        if (black[j + 1] - black[j] > 1) {
            // 最后一行黑色为材料的纵轴的底端
            // 而下一段黑色的开始为下一个材料的纵轴的首端
            number++
            realYLists.push(black[j])
            realYLists.push(black[j + 1])
        }
    }
    realYLists.push(height + y0)
    return {
        number,
        realYLists
    }
}

export interface axisInterface{
    xAxisName: string;
    yAxisName: string;
    xAxisBegin: number;
    xAxisEnd: number;
}
export async function recognize(canvasUnshow: HTMLCanvasElement) {
    const worker = createWorker()
    await worker.load()
    await worker.loadLanguage('eng')
    await worker.initialize('eng', OEM.LSTM_ONLY)
    await worker.setParameters({
        tessedit_pageseg_mode: PSM.AUTO
    })
    
    const results = await worker.recognize(canvasUnshow)
    const resultsSplit = results.data.text.split('\n')

    const resultsList = []
    for (let i = 0; i < resultsSplit.length; i++) {
        if (resultsSplit[i].match(/^\s+$/) || resultsSplit[i] === '') {
        // 去除空项或者空格
        } else {
        resultsList.push(resultsSplit[i])
        }
    }
    // 得到yAxisName数据
    const yAxisName = resultsList[0]
    // 得到xAxisName数据
    const xAxisName = resultsList[resultsList.length - 1]
    // 得到xAxis数据
    const xAxisList = resultsList[resultsList.length - 2].split(' ')
    const xAxisBegin = Number(xAxisList[0])
    const xAxisEnd = Number(xAxisList[xAxisList.length - 1])

    const result = {
        xAxisName,
        yAxisName,
        xAxisBegin,
        xAxisEnd
    }
    return result
}

export function getSubData (subCtx: CanvasRenderingContext2D, width: number, height: number) {
    const subImage = binaryImg(subCtx, 0, 0, width, height)
    const xList = []
    const yList = []
    for (let i = 0; i < width; i++) {
      for (let j = 0; j < height; j++) {
        const local = i * 4 + j * 4 * width
        const R = subImage.data[local] // R(0-255)
        const G = subImage.data[local + 1] // G(0-255)
        const B = subImage.data[local + 2] // B(0-255)
        if (R === 255 && G === 255 && B === 255) {
            continue
        } else {
            const x = i
            const y = height - j // 翻转
            xList.push(x)
            yList.push(y)
        }
      }
    }
    return {
      xList,
      yList
    }
}
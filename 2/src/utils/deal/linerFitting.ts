export function linerFitting (xList: number[], yList: number[]) {
    let xsum = 0
    let ysum = 0
    let xysum = 0
    let sqareXsum = 0

    for (let i = 0; i < xList.length; i++) {
        const x = Number(xList[i].toFixed(2))
        const y = Number(yList[i].toFixed(2))
        xsum += x
        ysum += y
        xysum += x * y
        sqareXsum += x * x
    }
    const xmean = xsum / xList.length
    const ymean = ysum / xList.length
    const Kreturn = (xList.length * xysum - xsum * ysum) / (xList.length * sqareXsum - xsum * xsum)
    const Breturn = ymean - xmean * Kreturn

    return {
        Kreturn,
        Breturn
    }
}
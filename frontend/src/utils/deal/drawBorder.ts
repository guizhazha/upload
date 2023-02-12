export function drawBorder (ctx: CanvasRenderingContext2D, x0: number, y0: number, width: number, height: number) {
    ctx.beginPath()
    // 空心矩阵
    ctx.rect(x0, y0, width, height)
    // 颜色
    ctx.strokeStyle = 'red'
    // 绘制
    ctx.stroke()
}
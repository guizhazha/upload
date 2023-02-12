export function binaryImg (
    ctx: CanvasRenderingContext2D, 
    x0 = 0,
    y0 = 0, 
    width = 647, 
    height = 400) {
    const image = ctx.getImageData(x0, y0, width, height)

    for (let i = 0; i < image.data.length; i += 4) {
        const R = image.data[i] // R(0-255)
        const G = image.data[i + 1] // G(0-255)
        const B = image.data[i + 2] // B(0-255)
        const Alpha = image.data[i + 3] // Alpha(0-255)
        const sum = (R + G + B) / 3
        if (sum > Number(200)) {
            image.data[i] = 255
            image.data[i + 1] = 255
            image.data[i + 2] = 255
            image.data[i + 3] = Alpha
        } else {
            image.data[i] = 0
            image.data[i + 1] = 0
            image.data[i + 2] = 0
            image.data[i + 3] = Alpha
        }
    }
    
    return image
}
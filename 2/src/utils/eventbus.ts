// 导入mitt包
import mitt from 'mitt'

// 创建eventBus的实例对象
const bus = mitt()
 
// 导出eventBus
export default bus

// bus.emit(dataType.value+'-'+'isCheck', isCheck)
// bus.on(dataType.value+'-'+'isCheck', value  => {
//     console.log('value', value)
// })

import * as echarts from 'echarts'
import { nextTick,inject } from 'vue'

import { storeToRefs } from 'pinia'
import { changeRoute } from '@/pinia/route'
import { changeDeal, result } from '@/pinia/deal'
import {getOptions} from '@/utils/deal/option/option'
import {getOptionsData} from '@/utils/deal/option/optionsData'

export function selectCheckPlot(isShow: boolean) {
    // dialogVisible.value = true
    let checkData_: result[]
    if(isShow){
        checkData_ = inject<result[]>("checkData_") as result[]
    }else{
        const route = changeRoute()
        const { dataType, num } = storeToRefs(route)
        const deal = changeDeal()
        const {checkData} = storeToRefs(deal)
        checkData_ = getOptionsData()
    }
    
    nextTick(() => {
        const myEchartsall = echarts.init(selectCheck.value, undefined, { renderer: 'svg' })
        myEchartsall.clear()

        if(dataType.value === 'XRD') {
            // 动态修改高度
            const checkNumber = checkData.value[num.value].length
            myEchartsall.getDom().style.height = checkNumber *200 + 160 + "px";
            myEchartsall.resize();
        } else {
            myEchartsall.getDom().style.height = 600 + "px";
            myEchartsall.resize();
        }
        
        const options = getOptions(optionsData)
		myEchartsall.setOption(options)
    })
    
}
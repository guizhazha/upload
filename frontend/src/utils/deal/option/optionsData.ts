import { storeToRefs } from 'pinia'
import { changeRoute } from '@/pinia/route'
import { changeDeal } from '@/pinia/deal'

export function getOptionsData () {
    const route = changeRoute()
    const { num } = storeToRefs(route)

    const deal = changeDeal()
    const {uploadData,checkData} = storeToRefs(deal)

    const curCheckData = checkData.value[num.value]
    const curUploadData = uploadData.value[num.value]

    const resultData = []
    for(const index of curCheckData){
        resultData.push(curUploadData[index])
    }
    return resultData
}
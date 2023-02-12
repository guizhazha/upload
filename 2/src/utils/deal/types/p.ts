import type { UploadFile } from 'element-plus'

import {getJVtest} from '@/utils/deal/echart/JV'
import {getXRDtest} from '@/utils/deal/echart/XRD'
import {getIPCEtest} from '@/utils/deal/echart/IPCE'
import {getPLtest} from '@/utils/deal/echart/PL'
import {getABStest} from '@/utils/deal/echart/ABS'
import {TypeValue} from '@/utils/deal/echart/common'

import { storeToRefs } from 'pinia'
import { changeRoute } from '@/pinia/route'

export function getP(uploadData: UploadFile) {
    const route = changeRoute()
    const { dataType } = storeToRefs(route)

    let p: Promise<TypeValue>
    if(dataType.value === 'JV') {
        p = getJVtest(uploadData)
    } else if(dataType.value === 'XRD') {
        p = getXRDtest(uploadData)
    } else if (dataType.value === 'IPCE') {
        p = getIPCEtest(uploadData)
    } else if (dataType.value === 'PL') {
        p = getPLtest(uploadData)
    } else {// ABS
        p = getABStest(uploadData)
    }

    return p
}
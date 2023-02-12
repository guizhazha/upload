import axios from '@/utils/axios/axios'
import type { AxiosResponse, AxiosError } from 'axios'

import { storeToRefs } from 'pinia'
import { changeRoute } from '@/pinia/route'
import type { UploadFile } from 'element-plus'

export interface UploadInterface {
    testTime: string
    processId: string
    sampleId: string
    dataName: string
    isSuccess: boolean
    message: string
}

export function checkName(uploadData: UploadFile){
    const name = uploadData.name
    const testTime = name.split('-')[0]
    const processId = name.split('-')[1]
    const sampleId = name.split('-')[2]
    const dataName = name

    let isSuccess = false
    let message = ''
    if (dataName.split('-').length <= 3) {
        message = "error.expriError1"
    } else if (testTime.length !== 6) {
        message = "error.expriError2"
    } else if (processId.length !== 3) {
        message = "error.expriError3"
    } else if (sampleId.length !== 3) {
        message = "error.expriError4"
    } else {
        isSuccess = true
    }

    return {
        testTime,
        processId,
        sampleId,
        dataName,
        isSuccess,
        message,
    }
}

export interface UploadAxiosInterface {
    isSuccess: boolean
    message: string
}
export function checkDupliName(dataName: string) {
    const route = changeRoute()
    const { dataType } = storeToRefs(route)

    return new Promise(function(resolve: (value: UploadAxiosInterface) => void, reject: (value: UploadAxiosInterface) => void) {
        axios.post(
            'data/checkExperiName/',
            {
                dataType: dataType.value,
                dataName: dataName,
            }
        ).then((response: AxiosResponse) => {
            const isExist = response.data.isExist
            if(isExist){
                // 表示有个重名的
                const isSuccess = false
                const message = "error.expriError5"

                const result = {
                    isSuccess,
                    message
                }
                reject(result)
            } else {
                const isSuccess = true
                const message = "error.success"

                const result = {
                    isSuccess,
                    message
                }
                resolve(result)
            }
        })
    })
    
}

export function uploadExData(uploadData: UploadFile, upload: UploadInterface, content: any) {
    const route = changeRoute()
    const { dataType } = storeToRefs(route)

    const formData: FormData = new FormData()
    formData.append('dataType', dataType.value)
    formData.append('testTime', upload.testTime)
    formData.append('processId', upload.processId)
    formData.append('sampleId', upload.sampleId)
    formData.append('dataName', upload.dataName)
    formData.append('content', JSON.stringify(content))
    formData.append('data', uploadData.raw as Blob)

    axios.post(
        'data/uploadExperi/',
        formData
    )
}

import { storeToRefs } from 'pinia'
import { changeRoute } from '@/pinia/route'
import { changeDeal } from '@/pinia/deal'
import {TypeValue} from '@/utils/deal/echart/common'

import { UploadInterface, UploadAxiosInterface, checkDupliName, uploadExData } from '@/utils/deal/dealHeader/upload'
import type { UploadFile } from 'element-plus'

export function getResult(upload: UploadInterface, uploadData: UploadFile,  p: Promise<TypeValue>) {
    const route = changeRoute()
    const { num } = storeToRefs(route)
    const deal = changeDeal()

    p
    .then((value) => {
        const content = value

        if(upload.isSuccess) {
            const checkP = checkDupliName(upload.dataName)
            checkP
            .then((value: UploadAxiosInterface) => {
                upload.isSuccess = value.isSuccess
                upload.message = value.message
                
                uploadExData(uploadData, upload, content)

                const result = {
                    ...upload,
                    ...content
                }
                deal.setUploadData(num.value, result)
            })
            .catch((value: UploadAxiosInterface)=>{
                upload.isSuccess = value.isSuccess
                upload.message = value.message

                const result = {
                    ...upload,
                    ...content
                }
                deal.setUploadData(num.value, result)
            })
        }else{
            const result = {
                ...upload,
                ...content
            }
            deal.setUploadData(num.value, result)
        }
    })
    .catch(()=>{
        upload.isSuccess = false
        upload.message = 'error.fileError'

        const result = {
            ...upload
        }
        deal.setUploadData(num.value, result)
    })
}

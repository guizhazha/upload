<template>
    <el-upload
        drag
        action="https://jsonplaceholder.typicode.com/posts/"
        multiple
        :show-file-list="false"
        :before-upload="beforeUpload"
        :on-Progress="onProgress"
        >
        <h3>{{t("deal.pro")}}</h3>
        <h5>{{t("deal.proRule1")}}</h5>
        <el-icon><UploadFilled /></el-icon>
        <h5>{{t("deal.proRule2")}}</h5>
        <h6>{{t("deal.rule")}}</h6>
        <h6>{{t("deal.proTip")}}</h6>
    </el-upload>
</template>

<script lang="ts" setup>
import { online } from '@/utils/axios/online'
import axios from '@/utils/axios/axios'
import { getEmail } from "@/utils/cookies/cookies";
import type { UploadRawFile, UploadFile, UploadFiles } from 'element-plus'

import { ElMessage } from 'element-plus'
import { useI18n } from 'vue-i18n'
const { t } = useI18n()

const beforeUpload = (rawFile: UploadRawFile) => {
    online(getEmail() + '正准备上传一份工艺文件')
    
    if (rawFile.name.split('.')[0].length !== 3) {
        ElMessage({
            message: t("error.processError"),
            type: 'error',
        })
        // console.error('工艺文件由3位数字组成,XXX(例:007)')
        return false
    }
}

const onProgress = (uploadFile: UploadFile, uploadFiles: UploadFiles) => {
    const reader = new FileReader()
    reader.readAsText(uploadFile.raw as Blob, 'GB2312')
    reader.onload = () => {
        const formData: FormData = new FormData()
        formData.append('processId', uploadFile.name.split('.')[0])
        formData.append('dataName', uploadFile.name)
        const data = reader.result as string
        formData.append('content', data)
        formData.append('data_path', uploadFile.raw as Blob)

        axios.post(
            'data/uploadProgress/',
            formData
        )
    }
    reader.onerror = () => {
        ElMessage({
            message: t("error.fileError"),
            type: 'error',
        })
        // console.error('文件无法解析')
        return false
    }
}
</script>

<style scoped lang="scss">
@import "@/assets/scss/upload.scss";
</style>
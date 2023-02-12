<template>
    <el-upload
        drag
        action="https://jsonplaceholder.typicode.com/posts/"
        :limit="1"
        :show-file-list="false"
        :on-change="onChangeImage"
        >
        <h2>{{t("deal.uploadPic")}}</h2>
        <el-icon><UploadFilled /></el-icon>
    </el-upload>
</template>

<script lang="ts" setup>
import { online } from '@/utils/axios/online'
import type { UploadFile, UploadFiles, UploadRawFile } from 'element-plus'
import bus from '@/utils/eventbus'
import { getEmail } from '@/utils/cookies/cookies';

import { useI18n } from 'vue-i18n'
const { t } = useI18n()

const onChangeImage = (uploadFile: UploadFile, uploadFiles: UploadFiles) => {
    if (uploadFile.status !== 'ready') return
    online(getEmail() + '一张XRD图片正在被处理')

    bus.emit('uploadImage', uploadFile)
}
</script>

<style scoped lang="scss">
@import "@/assets/scss/upload.scss";
</style>
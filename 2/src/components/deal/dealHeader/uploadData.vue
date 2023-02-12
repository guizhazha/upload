<template>
    <el-upload
        drag
        action="https://jsonplaceholder.typicode.com/posts/"
        multiple
        :show-file-list="false"
        :on-change="onChange"
        >
        <h3>{{ dataType }} {{t("deal.exp")}}</h3>
        <h5>{{t("deal.expRule1")}}</h5>
        <el-icon><UploadFilled /></el-icon>
        <h5>{{t("deal.expRule2")}}</h5>
        <h6>{{t("deal.rule")}}</h6>
        <h6>{{t("deal.expTip")}}</h6>
    </el-upload>
</template>

<script lang="ts" setup>
import { storeToRefs } from 'pinia'
import { changeRoute } from '@/pinia/route'

import type { UploadFile, UploadFiles } from 'element-plus'
import { online } from '@/utils/axios/online'
import { getEmail } from '@/utils/cookies/cookies'

import {checkName} from '@/utils/deal/dealHeader/upload'
import {getP} from '@/utils/deal/types/p'
import {getResult} from '@/utils/deal/types/result'

import { useI18n } from 'vue-i18n'
const { t } = useI18n()

const route = changeRoute()
const { dataType } = storeToRefs(route)
const onChange = (uploadData: UploadFile, uploadFiles: UploadFiles) => {
    if (uploadData.status !== 'ready') return
    online(getEmail() + '正在处理' + dataType.value + '数据')

    // 判断命名规则是否符合要求
    const upload = checkName(uploadData)
    // 获取不同类型的content
    const p = getP(uploadData)
    // 校验是否可以上传
    getResult(upload, uploadData, p)
}
</script>

<style scoped lang="scss">
@import "@/assets/scss/upload.scss";
</style>



<!-- function a(number){
    eval("a"+number+"()");
}
function a0(){
    alert("OK!");
}
a(0); -->
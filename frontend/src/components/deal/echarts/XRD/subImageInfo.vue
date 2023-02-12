<template>
    <div class="sub-image-info">
        <h3>
            {{t("deal.matName")}}
            <el-input 
                v-model="name"
                :placeholder="t('deal.matName')" 
                clearable 
                />
        </h3>
        <h3>
            {{t("deal.submit")}}
            <el-button 
                icon="Promotion"
                type="text"
                @click="uploadSubXRD" />
        </h3>
    </div>
</template>

<script lang="ts" setup>
import { defineProps } from 'vue'
import { ref } from 'vue'
import { ElMessage } from 'element-plus'
import { storeToRefs } from 'pinia'
import { changeXRD } from '@/pinia/xrd'
import { changeRoute } from '@/pinia/route'
import { changeDeal } from '@/pinia/deal'
import { useI18n } from 'vue-i18n'
const { t } = useI18n()

const name = ref('')
const props = defineProps({ 
    index: {
        type: Number,
        default: -1
    }
})

const xrd = changeXRD()
const {x0,x1,yAxisName,xAxisBegin,xAxisEnd,xAxisName,subData} = storeToRefs(xrd)
const deal = changeDeal()
const route = changeRoute()
const { num } = storeToRefs(route)
const uploadSubXRD = () => {
    if (xAxisBegin.value - xAxisEnd.value >= 0) {
        ElMessage({
            message: t("error.xAxisError"),
            type: 'error',
        })
        return
    }

    if (name.value === '') {
        ElMessage({
            message: t("error.nameError"),
            type: 'error',
        })
        return
    }
    
    const xList = []
    const a: number = xAxisBegin.value
    const k: number = (xAxisEnd.value - xAxisBegin.value) / (x1.value - x0.value)
    for(const x of subData.value[props.index].xList) {
        const x_ = x * k - (0-a)
        xList.push(x_)
    }
    const result = {
        dataName: name.value,
        isSuccess: false,
        message: "error.nameError",
        xAxisName: xAxisName.value,
        yAxisName: yAxisName.value,
        xList: xList,
        yList: subData.value[props.index].yList
    }
    deal.setUploadData(num.value, result)
}
</script>

<style scoped lang="scss">
</style>
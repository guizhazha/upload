<template>
    <el-tooltip
            effect="light"
            :content="t('deal.analyse')"
            placement="right"
            >
        <el-button @click="selectCheckPlot" circle>
            <el-icon><DataAnalysis /></el-icon>
        </el-button>
    </el-tooltip>

    <el-dialog 
        v-model="dialogVisible"
        width="700px"
        draggable
        modal="false"
        append-to-body
        >
        <!-- <template #header="{ close }">
            <el-button type="danger" @click="close">
            <el-icon class="el-icon--left"><CircleCloseFilled /></el-icon>
                Close
            </el-button>
            <input />
        </template> -->
        <div ref="selectCheck"/>
    </el-dialog>
</template>

<script lang="ts" setup>
import { defineProps,nextTick,ref } from 'vue'

import { storeToRefs } from 'pinia'
import { changeRoute } from '@/pinia/route'
import type {result} from '@/pinia/deal'

import * as echarts from 'echarts'
import {getOptions} from '@/utils/deal/option/option'
import {getOptionsData} from '@/utils/deal/option/optionsData'

import { useI18n } from 'vue-i18n'
const { t } = useI18n()

const props  = defineProps({ 
    isShow: {
        type: Boolean
    },
    checkDATA: {
        type: Array<result>,
        require: false
    }
})

const route = changeRoute()
const { dataType, num } = storeToRefs(route)

const dialogVisible = ref(false)
const selectCheck = ref()

function selectCheckPlot() {
    dialogVisible.value = true
    let optionsData: result[]
    if(props.isShow){
        optionsData = props.checkDATA as result[]
    }else{
        optionsData = getOptionsData()
    }
    nextTick(() => {
        const myEchartsall = echarts.init(selectCheck.value, undefined, { renderer: 'svg' })
        myEchartsall.clear()

        if(dataType.value === 'XRD') {
            // 动态修改高度
            const checkNumber = optionsData.length
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
</script>

<style scoped lang="scss">
@import "@/assets/scss/button.scss";
@include button-circle;
</style>
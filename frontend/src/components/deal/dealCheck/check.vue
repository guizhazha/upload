<template>
    <el-row>
        <el-col :lg="8" :sm="10" :xs="12" class="left">
            <!-- indeterminate：表示中间状态 -->
            <el-checkbox
                v-model="isCheck[num]"
                :indeterminate="isInde[num]"
                @change="handleCheckAll"
                border
                />
                <plotAll :isShow="false"/>
        </el-col>

        <el-col :lg="10" :sm="6" :xs="2"></el-col>

        <el-col :lg="6" :sm="8" :xs="10" class="right">
            <div @click="changeRight">
                <el-button v-if="!isRight" icon="Right" />
                <el-button v-else icon="Back" />
            </div>
        </el-col>
    </el-row>
</template>

<script lang="ts" setup>
import plotAll from '@/components/deal/dealCheck/plotAll.vue'

import { storeToRefs } from 'pinia'
import { clickButton } from '@/pinia/button'
import { changeRoute } from '@/pinia/route'
import { changeDeal } from '@/pinia/deal'

const deal = changeDeal()
const {uploadData,checkData,isCheck,isInde} = storeToRefs(deal)
const route = changeRoute()
const { num } = storeToRefs(route)
const handleCheckAll = (value: boolean) => {
    const isCheck = value ? true : false
    const isInde = false
    deal.setCheck(num.value, isCheck)
	deal.setInde(num.value, isInde)

    if(value) {
        let length = uploadData.value[num.value].length
        const allData = Array.from(new Array(length).keys()).slice(0)
        deal.setCheckData(num.value, allData)
    } else {
        deal.setCheckData(num.value, [])
    }
}

const button = clickButton()
const { isRight } = storeToRefs(button)
const changeRight = () => {
    isRight.value = !isRight.value
}
</script>

<style scoped lang="scss">
@import "@/assets/scss/header.scss";
@import "@/assets/scss/button.scss";
.right {
    @include button-fold;
}
</style>
  
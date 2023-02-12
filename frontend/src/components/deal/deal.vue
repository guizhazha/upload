<template>
    <el-container>
        <el-header>
            <upload />
        </el-header>
        
        <el-container>
            <el-container>
                <el-main>
                    <check v-show="uploadData[num] !== undefined"/>
                    <echarts />
                    <XRDcanvas v-if="dataType === 'XRD'"/>
                </el-main>
            </el-container>

            <el-aside v-show="isRight">
                <showData />
            </el-aside>
        </el-container>
    </el-container>
</template>

<script lang="ts" setup>
import upload from '@/components/deal/dealHeader/upload.vue';
import check from '@/components/deal/dealCheck/check.vue';
import echarts from '@/components/deal/echarts/echarts.vue';
import XRDcanvas from '@/components/deal/echarts/XRD/XRDcanvas.vue';
import showData from '@/components/deal/dealRight/showData.vue';

import { storeToRefs } from 'pinia'
import { clickButton } from '@/pinia/button'
import { changeRoute } from '@/pinia/route'
import { changeDeal } from '@/pinia/deal'

const button = clickButton()
const { isRight } = storeToRefs(button)
const route = changeRoute()
const { dataType,num } = storeToRefs(route)
const deal = changeDeal()
const { uploadData } = storeToRefs(deal)
</script>

<style scoped lang="scss">
@import "@/assets/scss/container.scss";
</style>
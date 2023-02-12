<template>
    <el-row>
        <div class="left">
            <div @click="closeMenu">
                <el-button v-if="!isFold" icon="Fold" />
                <el-button v-else icon="Expand" />
            </div>
            <span>{{t(curName)}} </span>
            <favicon />
        </div>

        <div class="right">
            <el-popover :visible="isOpen"
                placement="bottom"
                width="200">
                <template #reference>
                    <el-button 
                        @click="isOpen = !isOpen" 
                        icon="Bell" 
                        circle 
                        />
                </template>

                <notMess />
            </el-popover>
                
            <div @click="openScreen">
                <el-button 
                    v-if="isFull" 
                    icon="Crop" 
                    circle />
                <el-button 
                    v-else 
                    icon="FullScreen" 
                    circle />
            </div>
            <SkinLanguage />
        </div>
    </el-row>
</template>

<script lang="ts" setup>
import favicon from '@/components/tinyComponent/favicon.vue'
import SkinLanguage from '@/components/tinyComponent/skinLanguage.vue';
import notMess from '@/components/tinyComponent/notMess.vue';

import { storeToRefs } from 'pinia'
import { changeRoute } from '@/pinia/route'
import { clickButton } from '@/pinia/button'

import { ref } from 'vue'
// npm install screenfull@4.2.0 --save
import screenfull from "screenfull";
import { useI18n } from 'vue-i18n'
const { t } = useI18n()

const isOpen = ref(false)

const route = changeRoute()
const { curName } = storeToRefs(route)
const button = clickButton()
const { isFold, isFull } = storeToRefs(button)

const closeMenu = () => {
    isFold.value = !isFold.value
}
const openScreen = () => {
    isFull.value = !isFull.value
    if (!screenfull.isFullscreen) {
        screenfull.request()
    } else {
        screenfull.exit()
    }
}
</script>

<style scoped lang="scss">
@import "@/assets/scss/header.scss";
@import "@/assets/scss/button.scss";
.left {
    @include button-fold;
}
.right {
    @include button-circle;
}
</style>

<template>
    <el-switch v-model="skin"
        inline-prompt
        active-icon="Sunrise"
        inactive-icon="MoonNight"
        style="--el-switch-on-color: #DAA520; --el-switch-off-color: #696969"
        @change="changeSkin"
        />
        <div v-show="false" v-once>{{ changeSkin() }}</div>
        
    <el-switch v-model="buttonLanguage"
        inline-prompt
        active-text="中"
        inactive-text="EN"
        style="--el-switch-on-color: #FFD700; --el-switch-off-color: #008B8B"
        @change="changeLanguage"
        />
</template>

<script lang="ts" setup>
import { ref } from 'vue'
import { storeToRefs } from 'pinia'
import { clickButton } from '@/pinia/button'

import { useI18n } from 'vue-i18n'
const { locale } = useI18n()

const skin = ref(true)
const changeSkin = () => {
    if(skin.value) {
        window.document.documentElement.setAttribute('data-theme', 'bright')
    } else {
        window.document.documentElement.setAttribute('data-theme', 'dark')
    }
}


const button = clickButton()
const { language } = storeToRefs(button)
const buttonLanguage = ref(language.value  === 'zh-cn')
const changeLanguage = (value: boolean) => {
    if(value) {
        locale.value = 'zh-cn'
        language.value = 'zh-cn'
        
    } else {
        locale.value = 'en'
        language.value = 'en'
    }
}
</script>

<style scoped lang="scss">
@import "@/assets/scss/base/size.scss";

.el-switch {
    display: inline;
    margin: 0 map-get($length, size-2);
}
</style>

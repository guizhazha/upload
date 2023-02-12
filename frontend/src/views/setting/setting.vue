<template>
    <el-tabs tab-position="left">
        <el-tab-pane :label="t('components.baseInfo')">
            <baseInfo />
        </el-tab-pane>
        <el-tab-pane :label="t('setting.safe')">
            <SafeSetting />
        </el-tab-pane>
        <el-tab-pane :label="t('setting.notion')">
            <Notion />
        </el-tab-pane>
        <el-tab-pane v-if="isTeacher" :label="t('setting.daily')">
            <studentWork />
        </el-tab-pane>
    </el-tabs>
</template>

<script lang="ts" setup>
import baseInfo from '@/components/setting/baseInfo.vue'
import SafeSetting from '@/components/setting/safeSetting.vue';
import Notion from '@/components/setting/notion.vue';
import studentWork from '@/components/setting/studentWork.vue';

import { storeToRefs } from 'pinia'
import { clickButton } from '@/pinia/button'
import { useI18n } from 'vue-i18n'
const { t } = useI18n()

const button = clickButton()
const { isTeacher } = storeToRefs(button)
</script>

<style scoped lang="scss">
</style>
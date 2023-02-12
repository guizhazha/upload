<template>
    <el-descriptions
        :title="t('components.baseInfo')"
        direction="horizontal"
        column="1"
        border
        >

        <el-descriptions-item :label="t('setting.name')">
            <span>{{name}}</span>
        </el-descriptions-item>

        <el-descriptions-item :label="t('setting.email')">
            <span>{{email}}</span>
        </el-descriptions-item>

        <el-descriptions-item :label="t('setting.phone')">
            <span>{{phone}}</span>
        </el-descriptions-item>
        
        
        <el-descriptions-item :label="t('setting.role')">
            <span v-if="role == 0">
                {{t('setting.none')}}
            </span>
            <span v-if="role == 1">
                {{t('setting.teacher')}}
            </span>
            <span v-if="role == 2">
                {{t('setting.student')}}
            </span>
            
            
            <el-tooltip 
                v-if="isCheck == 0"
                effect="dark"
                :content="t('setting.noRole')"
                placement="top-start">
                <img src="../../assets/image/staff/uncheck.svg" />
            </el-tooltip>
            <el-tooltip 
                v-if="isCheck == 1"
                effect="dark"
                :content="t('setting.isRole')"
                placement="top-start">
                <img src="../../assets/image/staff/check.svg" />
            </el-tooltip>
            <span v-if="isCheck == 2">
                错误
            </span>

            <span v-if="isManage">
                {{t('setting.manage')}}
            </span>
        </el-descriptions-item>

        <el-descriptions-item :label="t('setting.school')">
            <span> {{t(getSchool(school as number))}} </span>
        </el-descriptions-item>

        <el-descriptions-item :label="t('setting.data')">
            <router-link to="/show/JV/0">
                JV
            </router-link>
            <router-link to="/show/XRD/0">
                XRD
            </router-link>
            <router-link to="/show/IPCE/0">
                IPCE
            </router-link>
            <router-link to="/show/PL/0">
                PL
            </router-link>
            <router-link to="/show/ABS/0">
                ABS
            </router-link>
        </el-descriptions-item>
        
    </el-descriptions>

</template>

<script lang="ts" setup>
import { ref,onMounted } from 'vue'
import {getSchool} from '@/utils/setting/school'

import axios from '@/utils/axios/axios'
import type { AxiosResponse, AxiosError } from 'axios'

import { useI18n } from 'vue-i18n'
const { t } = useI18n()

const email = ref()
const role = ref<number>(0)
const isCheck = ref()
const isManage = ref()
const name = ref()
const phone = ref()
const school = ref(0)

onMounted(() => {
    axios.post(
        'user/getUserInfo/'
    ).then(
        (response: AxiosResponse) => {
            const code = response.data.code
            if(code !== 'error'){
                email.value = response.data.response.email
                role.value = response.data.response.role
                isCheck.value = response.data.response.is_check
                isManage.value = response.data.response.is_manage
                name.value = response.data.response.name
                phone.value = response.data.response.phone
                school.value = response.data.response.school
            }
        }
    )
})
</script>

<style scoped lang="scss">
@import "@/assets/scss/base/size.scss";
.el-descriptions{
    width: map-get($length, size-14);
}
img {
    width: map-get($length, size-3);
    height: map-get($length, size-3);
    position: relative;
    top: map-get($length, size-2);
}
</style>
<template>
    <el-table
        :data="staffData">
        <!-- <el-table-column 
            prop="time" 
            :label="t('setting.time')" 
            sortable /> -->

        <!-- 姓名 -->
        <el-table-column
            prop="name" 
            :label="t('setting.name')"
            sortable>
            <template #default="scope">
                <span v-if="scope.row.name === undefined">
                    {{t('setting.anonymity')}}
                </span>
                <span v-else>
                    {{scope.row.name}}
                </span>
            </template>
        </el-table-column>

        <!-- 邮箱 -->
        <el-table-column 
            prop="email" 
            width="120px"
            :label="t('setting.email')"
            sortable 
            />

        <el-table-column
            prop="school" 
            :label="t('setting.school')"
            sortable>
            <template #default="scope">
                {{t(getSchool(scope.row.school))}}
            </template>
        </el-table-column>

        <!-- 身份 -->
        <el-table-column
            prop="role" 
            :label="t('setting.role')"
            sortable>
            <template #default="scope">
                <span v-if="scope.row.role === undefined">
                    {{t('setting.none')}}
                </span>
                <span v-else>
                    <span v-if="scope.row.role == 0">
                        {{t('setting.none')}}
                    </span>
                    <el-tooltip :content="t('setting.teacher')" v-if="scope.row.role == 1">
                        <img class="role" src="../../assets/image/staff/teacher.svg" />
                    </el-tooltip >
                    
                    <el-tooltip :content="t('setting.student')"  v-if="scope.row.role == 2">
                        <img class="role" src="../../assets/image/staff/student.svg" />
                    </el-tooltip >

                    <el-tooltip :content="t('setting.noRole')" v-if="scope.row.is_check == 0">
                        <img class="check" src="../../assets/image/staff/uncheck.svg" />
                    </el-tooltip >
                    <el-tooltip :content="t('setting.isRole')" v-if="scope.row.is_check == 1">
                        <img class="check" src="../../assets/image/staff/check.svg" />
                    </el-tooltip >
                    <div v-if="scope.row.is_check == 2">
                        {{t('setting.none')}}
                    </div>
                </span>
            </template>
        </el-table-column>

        <el-table-column :label="t('setting.exp')">
            <template #default="scope">
                {{scope.row.typeNumber}}
                <!-- <div>J-V</div> -->
            </template>
        </el-table-column>

        <el-table-column
            prop="processNumber"
            sortable
            :label="t('setting.pro')"
            />

    </el-table>
</template>

<script lang="ts" setup>
import axios from '@/utils/axios/axios'
import type { AxiosResponse, AxiosError } from 'axios'
import { onMounted, ref } from 'vue' 
import {getSchool} from '@/utils/setting/school'

import { useI18n } from 'vue-i18n'
const { t } = useI18n()

interface staffInterface{
    is_active: boolean
    email: string
    time: Date
    role?: number
    is_check?: number
    is_manage?: boolean
    students?: {
        student: string
        is_check: number
    }[]
    name?: string
    school?: number
    phone?: string
    typeNumber: [number, number, number, number, number]
    processNumber: number
}

const staffData = ref<staffInterface[]>([])
onMounted(() => {
    axios.post(
        'user/getInfos/'
    ).then(
        (response: AxiosResponse) => {
			staffData.value = response.data.responses
        }
    )
})
</script>

<style scoped lang="scss">
@import "@/assets/scss/base/size.scss";

.role {
    width: map-get($length, size-5);
    height: map-get($length, size-5);
}

.check {
    width: map-get($length, size-4);
    height: map-get($length, size-4);
    position: relative;
    right: map-get($length, size-2);
    top: map-get($length, size-1);
}
</style>



<template>
    <el-form ref="infoFormRef"
        :model="infoForm"
        status-icon
        :rules="infoFormRules"
        >

        <el-form-item :label="t('setting.role')" prop="role">
            <el-select v-model="infoForm.role" :placeholder="t('setting.role')">
                <el-option
                    v-for="item in roleOptions"
                    :key="item.value"
                    :label="t(item.label)"
                    :value="item.value"
                />
            </el-select>
        </el-form-item>


        <el-form-item :label="t('setting.name')" prop="name">
            <el-input v-model="infoForm.name" />
        </el-form-item>
        
        <el-form-item :label="t('setting.school')" prop="school">
            <el-select v-model="infoForm.school" :placeholder="t('setting.school')">
                <el-option
                  v-for="item in schoolOptions"
                  :key="item.value"
                  :label="t(item.label)"
                  :value="item.value"
                />
            </el-select>
        </el-form-item>

        <el-form-item :label="t('setting.phone')" prop="phone">
            <el-input v-model="infoForm.phone" />
        </el-form-item>

        <el-button @click="submitForm(infoFormRef)">
            {{t('setting.submit')}}
        </el-button>
    </el-form>
</template>

<script lang="ts" setup>
import { reactive, ref } from 'vue'
import type { FormInstance } from 'element-plus'

import axios from '@/utils/axios/axios'
import type { AxiosResponse, AxiosError } from 'axios'

import { clickButton } from '@/pinia/button'

import { useI18n } from "vue-i18n"
const { t } = useI18n()

const roleOptions = [
    {
        value: '1',
        label: 'setting.teacher',
    },
    {
        value: '2',
        label: 'setting.student',
    }
]
const schoolOptions = [
    {
        value: '0',
        label: 'setting.none',
    },
    {
        value: '1',
        label: 'setting.BISTU',
    }
]

const infoFormRef = ref<FormInstance>()
const infoForm = reactive({
    role: '',
    name: '',
    school: '',
    phone: ''
})


const validaterole = (rule: any, value: any, callback: any) => {
    if (value === '') {
        return callback(new Error(t("error.noroleError")))
    } else {
        callback()
    }
}
const validatename = (rule: any, value: any, callback: any) => {
    if (!value) {
        return callback(new Error(t("error.nonameError")))
    } else {
        callback()
    }
}
const validateSchool = (rule: any, value: any, callback: any) => {
    if (value === '') {
        return callback(new Error(t("error.noSchoolError")))
    } else {
        callback()
    }
}
const validatePhone = (rule: any, value: any, callback: any) => {
    if (value === '') {
        callback()
        // return callback(new Error(t("error.noPhoneError")))
    } else {
        if (/^1[34578]\d{9}$/.test(value) === false) {
            callback(new Error(t("error.phoneFormatError")))
        } else {
            callback()
        }
    }
}

const infoFormRules = reactive({
    role: [{ validator: validaterole, trigger: 'blur' }],
    name: [{ validator: validatename, trigger: 'blur' }],
    school: [{ validator: validateSchool, trigger: 'blur' }],
    phone: [{ validator: validatePhone, trigger: 'blur' }]
})

const submitForm = (formEl: FormInstance | undefined) => {
    if (!formEl) return
    formEl.validate((valid) => {
        if (valid) {
            axios.post(
                'user/setInfo/',
                {
                    role: infoForm.role,
                    name: infoForm.name,
                    school: infoForm.school,
                    phone: infoForm.phone
                }
            ).then((response: AxiosResponse) => {
                if(response.data.code == 'info'){
                    const button = clickButton()
                    button.setExist()
                }
            })
        }
    })
}
</script>

<style scoped lang="scss">
@import "@/assets/scss/base/size.scss";

.el-form {
    width: map-get($length, size-14);
    padding-top: map-get($length, size-8);

    ::v-deep .el-form-item__label {
        width: map-get($length, size-9);
        text-align: right;
    }
}

.el-input, .el-select {
    height: map-get($length, size-6);
    width: map-get($length, size-12);
}

.el-button {
    width: map-get($length, size-8);
    position: relative;
    left: map-get($length, size-12);
    margin-left: map-get($length, size-6);
    background-color: chocolate;
    color: rgb(13, 13, 13);
}
</style>


<template>
    <el-form ref="registerFormRef"
        :model="registerForm"
        status-icon
        :rules="registerFormRules"
        >

        <el-form-item :label="t('enter.email')" prop="email">
            <el-input v-model="registerForm.email" />
        </el-form-item>
        <el-form-item :label="t('enter.password')" prop="password">
            <el-input v-model="registerForm.password" type="password" show-password />
        </el-form-item>

        <el-form-item :label="t('enter.code')" prop="code">
            <div class="input-code">
                <el-input v-model="registerForm.code" />
                <el-button type="danger" @click="getCode(registerFormRef)">{{t('enter.getCode')}}</el-button>
            </div>
        </el-form-item>

        <div class="submit-reset">
            <el-button @click="submitForm(registerFormRef)">
                {{t('enter.register')}}
            </el-button>
            <el-button @click="resetForm(registerFormRef)">
                {{t('enter.reset')}}
            </el-button>
        </div>
    </el-form>
</template>

<script lang="ts" setup>
import { reactive, ref } from 'vue'
import type { FormInstance } from 'element-plus'
import { ElMessage } from 'element-plus'

import axios from '@/utils/axios/axios'
import type { AxiosResponse, AxiosError } from 'axios'
import { useRouter } from 'vue-router'

import { useI18n } from "vue-i18n"
const { t } = useI18n()

const registerFormRef = ref<FormInstance>()
const registerForm = reactive({
    email: '',
    password: '',
    code: ''
})


const validateEmail = (rule: any, value: any, callback: any) => {
    if (value === '') {
        return callback(new Error(t("error.noEmailError")))
    } else {
        if (
            /^[A-Za-z0-9\u4e00-\u9fa5]+@[a-zA-Z0-9_-]+(\.[a-zA-Z0-9_-]+)+$/.test(value) === false
        ) {
            callback(new Error(t("error.emailFormatError")))
        } else {
            callback()
        }
    }
}
const validatePassword = (rule: any, value: any, callback: any) => {
    if (!value) {
        return callback(new Error(t("error.noPasswordError")))
    } else {
        callback()
    }
}
const validateCode = (rule: any, value: any, callback: any) => {
    if (value === '') {
        return callback(new Error(t("error.noCodeError")))
    } else {
        if (
            /^[0-9]{6}$/.test(value) === false
        ) {
            callback(new Error(t("error.codeFormatError")))
        } else {
            callback()
        }
    }
}
const registerFormRules = reactive({
    email: [{ validator: validateEmail, trigger: 'blur' }],
    password: [{ validator: validatePassword, trigger: 'blur' }],
    code: [{ validator: validateCode, trigger: 'blur' }]
})

const getCode = (formEl: FormInstance | undefined) => {
    if (!formEl) return
    formEl.validateField('email', (valid) => {
        if(valid){
            axios.post(
                'user/getCode/',
                {
                    email: registerForm.email
                }
            )
        }
    })
}

const router = useRouter()
const submitForm = (formEl: FormInstance | undefined) => {
    if (!formEl) return
    formEl.validate((valid) => {
        if (valid) {
            axios.post(
                'user/register/',
                {
                    email: registerForm.email,
                    password: registerForm.password,
                    code: registerForm.code
                }
            ).then((response: AxiosResponse) => {
                if(response.data.code == 'info'){
                    router.push({ path: "/login" })
                }
            })
        }
    })
}

const resetForm = (formEl: FormInstance | undefined) => {
    if (!formEl) return
    formEl.resetFields()
}
</script>

<style scoped lang="scss">
@import "@/assets/scss/base/size.scss";
@import "@/assets/scss/animation.scss";
.el-form {
    width: map-get($length, size-14);

    ::v-deep .el-form-item__label {
        width: map-get($length, size-9);
        text-align: right;
    }
}

.el-input {
    height: map-get($length, size-6);
    width: map-get($length, size-12);
}
.input-code {
    width: map-get($length, size-12);
    .el-input {
        width: map-get($length, size-10);
    }
    .el-button {
        width: map-get($length, size-9);
        float: right;
    }
}

.submit-reset {
    display: flex;
    justify-content: space-around;
    align-items: center;
    width: map-get($length, size-13);

    .el-button {
        background-color: black;
        color: white;
        width: map-get($length, size-10);

        &:first-child {
            mask: url(~@/assets/image/enter/nature-sprite.png);
            mask-size: 2300% 100%;
            animation: ani2 1s steps(22) forwards;
            &:active {
                animation: ani 1s steps(22) forwards;
            }
        }

        &:last-child {
            mask: url(~@/assets/image/enter/urban-sprite.png);
            mask-size: 3000% 100%;
            animation: ani2 1s steps(29) forwards;
            &:active {
                animation: ani 1s steps(29) forwards;
            }
        }
    }
}
</style>


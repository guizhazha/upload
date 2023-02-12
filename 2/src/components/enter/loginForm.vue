<template>
    <el-form :model="loginForm">
        <img src="../../assets/image/enter/003.svg" />
        <h2>{{t('enter.welcome')}}</h2>

        <el-input v-model="loginForm.email" :placeholder="t('enter.email')"/>
        
        <el-input 
            v-model="loginForm.password" 
            type="password" 
            :placeholder="t('enter.password')"
            show-password />
        
        <div class="remember-forget">
            <el-checkbox v-model="rememberMe">
                {{t('enter.rememberMe')}}
            </el-checkbox>

            <el-button type="danger" @click="sendPassword">
                {{t('enter.forgetPassword')}}
            </el-button>
        </div>

        <el-button class="submit"  @click="submitForm">
            {{t('enter.login')}}
        </el-button>
    </el-form>
</template>

<script lang="ts" setup>
import { reactive, ref } from 'vue'

import axios from '@/utils/axios/axios'
import type { AxiosResponse, AxiosError } from 'axios'
import { setEmail } from "@/utils/cookies/cookies"

import { useRouter } from 'vue-router'

import { useI18n } from "vue-i18n"
const { t } = useI18n()

const loginForm = reactive({
    email: '',
    password: ''
})
const rememberMe = ref(true)
const router = useRouter()
const submitForm = () => {
    axios.post(
        'user/token/',
        {
            email: loginForm.email,
            password: loginForm.password
        }
    ).then((response: AxiosResponse) => {
        if(response.data.code == 'info'){
            const expires = rememberMe.value ? 30 : 0
            setEmail(response.data.email, expires)
            localStorage.setItem('token', response.data.token)

            if(/^[A-Za-z0-9\u4e00-\u9fa5]+@[a-zA-Z0-9_-]+(\.[a-zA-Z0-9_-]+)+$/.test(response.data.email) === false){
                localStorage.setItem('admin', 'true')
            }else{
                localStorage.setItem('admin', 'false')
            }
            
            router.push({ path: "/" })
        }
    })
}

const sendPassword = () => {
    axios.post(
        'user/forgetPassword/',
        {
            email: loginForm.email
        }
    )
}
</script>

<style scoped lang="scss">
@import "@/assets/scss/base/size.scss";
@import "@/assets/scss/animation.scss";
@import "@/assets/scss/base/color.scss";

.el-form {
    width: map-get($length, size-12);
    padding: 0 map-get($length, size-6);
    border-radius: map-get($length, size-2);
    box-shadow: 0 0 4px 2px map-get($main-color, main);
    
    img {
        display: block;
        width: map-get($length, size-6);
        padding: map-get($length, size-2);
        margin-left: auto;
    }

    h2 {
        margin: map-get($length, size-2);
    }

    .el-input {
        padding: map-get($length, size-2);
        &:first-child {
            padding-top: map-get($length, size-4);
        }
    }

    .remember-forget{
        display: flex;
        justify-content: space-around;
        align-items: center;
        padding: map-get($length, size-2) 0;
    }

    .submit {
        width: map-get($length, size-12);
        height: map-get($length, size-6);
        margin: auto;
        margin-top: map-get($length, size-3);
        margin-bottom: map-get($length, size-5);
    }
}
</style>
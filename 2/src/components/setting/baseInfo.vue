<template>
    <div v-if="isExist">
        <getInfo />
    </div>
    <div v-else>
        <setInfo />
    </div>
</template>

<script lang="ts" setup>
import setInfo from '@/components/setting/setInfo.vue'
import getInfo from '@/components/setting/getInfo.vue'

import {onMounted} from 'vue'
import axios from '@/utils/axios/axios'
import type { AxiosResponse, AxiosError } from 'axios'

import { storeToRefs } from 'pinia'
import { clickButton } from '@/pinia/button'
const button = clickButton()
const { isExist } = storeToRefs(button)


onMounted(() => {
    axios.post(
        'user/getUserInfo/'
    ).then(
        (response: AxiosResponse) => {
            const code = response.data.code
            if(code === 'error'){
                isExist.value = false
            }else{
                isExist.value = true
                const role = response.data.response.role
                const is_check = response.data.response.is_check
                
                // if(role == 1 && is_check == 1){
                if(role == 1){
                    button.setTeacher()
                }
            }
        }
    )
})
</script>

<style scoped lang="scss">
</style>
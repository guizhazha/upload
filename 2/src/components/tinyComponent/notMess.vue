<template>
    <el-tabs v-model="notMess" type="border-card" >
        <el-tab-pane is-dot :label="t('message.notification')" name="notification">
            <div v-for="not, index in nots" :key="index">
                <span>{{not.time}}</span>
                <span>{{not.content}}</span>
                <el-divider v-show="index + 1 !== nots.length" />
            </div>

            <div v-show="isNot">
                {{ t('message.noNot') }}
            </div>
        </el-tab-pane>

        <el-tab-pane :label="t('message.message')" name="Message">
            <div v-for="message, index in messages" :key="index">
                <h5>from: {{message.send_id}}</h5>
                <span>{{message.time}}</span>
                <span>{{message.content}}</span>
                <el-divider v-show="index + 1 !== messages.length" />
            </div>

            <div v-show="isMessage">
                {{ t('message.noMes') }}
            </div>
        </el-tab-pane>
    </el-tabs>
</template>

<script lang="ts" setup>
import axios from '@/utils/axios/axios'
import type { AxiosResponse, AxiosError } from 'axios'

import { ref, onMounted } from 'vue'
import { useI18n } from 'vue-i18n'
const { t } = useI18n()

const notMess = ref('notification')
const nots = ref<{[key:string]: string}[]>([])
const messages = ref<{[key:string]: string}[]>([])

onMounted(() => {
    axios.post(
        'message/getNotion/'
    ).then(
        (response: AxiosResponse) => {
            nots.value = response.data.responses
        }
    )

    axios.post(
        'message/getMessage/'
    ).then(
        (response: AxiosResponse) => {
            messages.value = response.data.responses
        }
    )
})

const isNot = ref(nots.value.length == 0)
const isMessage = ref(messages.value.length == 0)
</script>

<style scoped lang="scss">
::v-deep .el-card__body {
    padding: 0;
}
</style>
  